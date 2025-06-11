import {
  or,
  and,
  count,
  desc,
  eq,
  gt,
  ilike,
  inArray,
  lt,
  lte,
  sql,
  sum,
  notExists,
  getTableColumns,
} from "@cmt/db";
import { protectedProcedure } from "../trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { schema } from "@cmt/db/client";
import { addMonths, format, setDate } from "date-fns";
import {
  cursorPaginateInputSchema,
  getPagination,
  paginateInputSchema,
} from "../utils/paginate";
import {
  getCreditScoreMeta,
  getFundProgressOfBatch,
  getPaymentProgressOfMonth,
  getSubscribersByBatchId,
} from "../utils/actions";
import { generateChitId } from "@cmt/db/utils";
import { paymentInsertSchema, paymentUpdateSchema } from "@cmt/db/schema";
import { getClerkUser, getQueryUserIds } from "../utils/clerk";
import { withPagination } from "../utils/dynamic";

export const paymentsRouter = {
  /** Create payment for subscribersToBatchId
   * @context collector
   */
  create: protectedProcedure
    .input(
      paymentInsertSchema.omit({ totalAmount: true, creditScoreAffected: true })
    )
    .mutation(({ ctx, input }) =>
      ctx.db
        .insert(schema.payments)
        .values({
          ...input,
          totalAmount: input.subscriptionAmount + input.penalty,
          creditScoreAffected:
            input.paidOn > new Date(input.runwayDate) ? -10 : 10,
        })
        .returning()
        .then((v) => v.at(0))
    ),

  /** Delete payment for paymentId
   * @context collector
   */
  delete: protectedProcedure
    .input(z.object({ paymentId: z.string().min(1) }))
    .mutation(({ ctx, input }) =>
      ctx.db
        .delete(schema.payments)
        .where(eq(schema.payments.id, input.paymentId))
    ),

  /** Update payment for paymentId
   * @context collector
   */
  update: protectedProcedure
    .input(paymentUpdateSchema.and(z.object({ paymentId: z.string().min(1) })))
    .mutation(({ ctx, input }) =>
      ctx.db
        .update(schema.payments)
        .set(input)
        .where(eq(schema.payments.id, input.paymentId))
        .returning()
        .then((v) => v.at(0))
    ),

  /** Get runway for specific brach based batch schema and starts on date
   * @context collector
   */
  getRunway: protectedProcedure
    .input(z.object({ batchId: z.string() }))
    .query(async ({ ctx, input }) => {
      const batch = await ctx.db.query.batches.findFirst({
        where: eq(schema.batches.id, input.batchId),
      });

      if (!batch)
        throw new TRPCError({ message: "Batch Not Found", code: "NOT_FOUND" });

      const scheme = batch.scheme;
      const startsOn = new Date(batch.startsOn);

      const months = Array.from({ length: scheme }, (_, index) => {
        const date = addMonths(startsOn, index);
        return {
          value: format(date, "yyyy-MM-dd"),
          label: format(date, "MMM yyyy"),
        };
      });

      return { batch, months };
    }),

  /** Get list subscribers for runway with the status of payment paid or not-paid
   * @context collector
   */
  ofBatchSelectedRunway: protectedProcedure
    .input(
      paginateInputSchema.and(
        z.object({
          batchId: z.string(),
          query: z.string().optional(),
          runwayDate: z.string(),
          paymentStatus: z.enum(["all", "not-paid"]).optional(),
        })
      )
    )
    .query(async ({ ctx, input }) => {
      const paymentStatus = input.paymentStatus ?? "all";
      const runwayDate = new Date(input.runwayDate);
      const { batch } = await generateChitId(input.batchId);
      const subscriptionAmount = Math.ceil(batch.fundAmount / batch.scheme);
      const { pageIndex, pageSize } = input;

      const inputMonth = runwayDate.getMonth() + 1; // JavaScript months are 0-indexed
      const inputYear = runwayDate.getFullYear();

      // Check if: subscriber paid for given runway date
      type PaymentStatus = "paid" | "not-paid";
      const baseQuery = ctx.db
        .select({
          ...getTableColumns(schema.subscribersToBatches),
          payment: getTableColumns(schema.payments),
          payemntStatus: sql<PaymentStatus>`CASE 
                WHEN ${schema.payments.id} IS NOT NULL THEN 'paid'
                ELSE 'not-paid'
              END`,
        })
        .from(schema.subscribersToBatches)
        .leftJoin(
          schema.payments,
          and(
            eq(
              schema.payments.subscriberToBatchId,
              schema.subscribersToBatches.id
            ),
            sql`EXTRACT(MONTH FROM ${schema.payments.runwayDate}) = ${inputMonth}`,
            sql`EXTRACT(YEAR FROM ${schema.payments.runwayDate}) = ${inputYear}`
          )
        )
        .where(
          and(
            eq(schema.subscribersToBatches.batchId, batch.id),
            paymentStatus === "not-paid"
              ? sql`${schema.payments.id} IS NULL`
              : undefined
          )
        );

      const dynamicQuery = baseQuery.$dynamic();

      const subscriberPayments = await withPagination(
        dynamicQuery,
        pageIndex,
        pageSize
      );

      const totalRecords = await ctx.db.$count(dynamicQuery);

      const response = await Promise.all(
        subscriberPayments.map(async (sp) => {
          const subscriber = await getClerkUser(sp.subscriberId);
          return {
            subscriber,
            ...sp,
            payment: {
              ...sp?.payment,
              subscriptionAmount:
                sp?.payment?.subscriptionAmount ?? subscriptionAmount,
              runwayDate: sp?.payment?.runwayDate ?? input.runwayDate,
              status: sp?.payemntStatus ?? "not-paid",
            },
          };
        })
      );

      return { pageIndex, pageSize, items: response, total: totalRecords };
    }),

  /** Get list subscribers for runway with the status of payment paid or not-paid
   * @context collector
   */
  ofBatchThisMonth: protectedProcedure
    .input(
      cursorPaginateInputSchema.and(
        z.object({
          batchId: z.string(),
          query: z.string().optional(),
        })
      )
    )
    .query(async ({ ctx, input }) => {
      const limit = input.limit ?? 10;

      const subIds = await getQueryUserIds(input.query);

      const queryCond = input.query
        ? or(
            subIds
              ? inArray(schema.subscribersToBatches.subscriberId, subIds)
              : undefined,
            ilike(schema.subscribersToBatches.chitId, `%${input.query}%`)
          )
        : undefined;

      const cursorCond = input.cursor
        ? lte(schema.subscribersToBatches.id, input.cursor)
        : undefined;

      const subs = await ctx.db.query.subscribersToBatches.findMany({
        where: and(
          cursorCond,
          queryCond,
          eq(schema.subscribersToBatches.batchId, input.batchId)
        ),
        with: {
          subscriber: true,
        },
        limit: limit + 1,
        orderBy: desc(schema.subscribersToBatches.id),
      });

      const runwayDate = new Date();
      const { batch } = await generateChitId(input.batchId);
      const subscriptionAmount = Math.ceil(batch.fundAmount / batch.scheme);

      const mappedItems = await Promise.all(
        subs.flatMap(async (sub) => {
          let status: "paid" | "not-paid" = "not-paid";

          const inputMonth = runwayDate.getMonth() + 1; // JavaScript months are 0-indexed
          const inputYear = runwayDate.getFullYear();

          // Check if: subscriber paid for given runway date
          const payment = await ctx.db.query.payments.findFirst({
            where: and(
              eq(schema.payments.subscriberToBatchId, sub.id),
              sql`EXTRACT(MONTH FROM ${schema.payments.runwayDate}) = ${inputMonth}`,
              sql`EXTRACT(YEAR FROM ${schema.payments.runwayDate}) = ${inputYear}`
            ),
          });

          const subscriber = await getClerkUser(sub.subscriberId);

          return {
            ...sub,
            payment: {
              ...payment,
              subscriptionAmount:
                payment?.subscriptionAmount ?? subscriptionAmount,
              status,
              runwayDate: runwayDate.toDateString(),
            },
            subscriber,
          };
        })
      );

      const nextCursor =
        mappedItems.length > limit ? mappedItems.pop()?.id : undefined;

      return { nextCursor, items: mappedItems };
    }),

  /** Get payment details by paymentID
   * @context collector
   */
  getById: protectedProcedure
    .input(z.object({ paymentId: z.string().min(1) }))
    .query(async ({ ctx, input }) => {
      const payment = await ctx.db.query.payments.findFirst({
        where: eq(schema.payments.id, input.paymentId),
        with: {
          subscribersToBatches: {
            with: {
              subscriber: true,
              batch: {
                with: {
                  collector: true,
                },
              },
            },
          },
        },
      });

      if (!payment)
        throw new TRPCError({
          message: "Payment Not Found",
          code: "NOT_FOUND",
        });

      const subscriber = await ctx.clerk.users.getUser(
        payment.subscribersToBatches.subscriberId
      );

      return {
        ...payment,
        subscribersToBatches: {
          ...payment.subscribersToBatches,
          subscriber: {
            ...payment.subscribersToBatches.subscriber,
            imageUrl: subscriber.imageUrl,
            firstName: subscriber.firstName,
            lastName: subscriber.lastName,
          },
        },
      };
    }),

  /** Get credit score history of subscriber
   * @context subscriber
   */
  getCreditScoreHistory: protectedProcedure
    .input(
      z
        .object({
          limit: z.number().optional(),
          cursor: z.string().optional(),
          subscriberId: z.string().optional(),
        })
        .partial()
        .optional()
    )
    .query(async ({ ctx, input }) => {
      const limit = input?.limit ?? 10;
      const subscriberId = input?.subscriberId ?? ctx.session.userId;
      const cursorCond = input?.cursor
        ? or(lt(schema.payments.id, input.cursor))
        : undefined;

      const subscriberToBatch =
        await ctx.db.query.subscribersToBatches.findMany({
          where: eq(schema.subscribersToBatches.subscriberId, subscriberId),
        });

      const items = await ctx.db.query.payments.findMany({
        where: and(
          inArray(
            schema.payments.subscriberToBatchId,
            subscriberToBatch.map((s) => s.id)
          ),
          cursorCond
        ),
        columns: {
          id: true,
          paidOn: true,
          creditScoreAffected: true,
          runwayDate: true,
          subscriptionAmount: true,
        },
        with: {
          subscribersToBatches: {
            columns: { chitId: true },
            with: {
              batch: true,
            },
          },
        },
        limit: limit + 1,
        orderBy: ({ paidOn, id }, { desc, asc }) => [desc(id), asc(paidOn)],
      });

      const nextCursor = items.length > limit ? items.pop()?.id : undefined;

      return {
        items,
        nextCursor,
      };
    }),

  getCreditScoreMeta: protectedProcedure
    .input(z.object({ subscriberId: z.string() }).optional())
    .query(({ ctx, input }) =>
      getCreditScoreMeta({
        ctx,
        subscriberId: input?.subscriberId ?? ctx.session.userId,
      })
    ),

  /** Get upcoming payments due of subscriber */
  getUpcomingDues: protectedProcedure
    .input(cursorPaginateInputSchema.optional())
    .query(async ({ ctx, input }) => {
      const nextMonth = addMonths(new Date(), 1);
      const limit = input?.limit ?? 10;
      const cursorCond = input?.cursor
        ? lte(schema.subscribersToBatches.id, input.cursor)
        : undefined;

      const paymentsNotExists = (alias: typeof schema.subscribersToBatches) =>
        notExists(
          ctx.db
            .select()
            .from(schema.payments)
            .where(
              and(
                eq(schema.payments.subscriberToBatchId, alias.id), // correlate here
                eq(
                  sql`EXTRACT(MONTH FROM ${schema.payments.runwayDate})`,
                  nextMonth.getMonth() + 1
                ),
                eq(
                  sql`EXTRACT(YEAR FROM ${schema.payments.runwayDate})`,
                  nextMonth.getFullYear()
                )
              )
            )
        );

      const dues = await ctx.db
        .select({
          id: schema.subscribersToBatches.id,
          batchId: schema.batches.id,
          batchName: schema.batches.name,
          batchDueOn: schema.batches.dueOn,
          totalAmount: schema.batches.fundAmount,
          orgName: schema.collectors.orgName,
          chitId: schema.subscribersToBatches.chitId,
        })
        .from(schema.subscribersToBatches)
        .innerJoin(
          schema.batches,
          eq(schema.batches.id, schema.subscribersToBatches.batchId)
        )
        .innerJoin(
          schema.collectors,
          eq(schema.collectors.id, schema.batches.collectorId)
        )
        .where(
          and(
            cursorCond,
            paymentsNotExists(schema.subscribersToBatches),
            eq(schema.subscribersToBatches.subscriberId, ctx.session.userId)
          )
        )
        .limit(limit + 1)
        .orderBy(desc(schema.subscribersToBatches.id));

      const mappedItems = await Promise.all(
        dues.map(async (d) => {
          const fundProgress = await getFundProgressOfBatch(
            nextMonth,
            d.batchId,
            ctx.db
          );
          return {
            ...d,
            dueOn: setDate(nextMonth, parseInt(d.batchDueOn)),
            fundProgress,
          };
        })
      );

      const nextCursor =
        mappedItems.length > limit ? mappedItems.pop()?.id : undefined;

      return {
        items: mappedItems,
        nextCursor,
      };
    }),
};
