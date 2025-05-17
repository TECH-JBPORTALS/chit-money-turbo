import {
  and,
  count,
  desc,
  eq,
  exists,
  ilike,
  inArray,
  lte,
  not,
  or,
} from "@cmt/db";
import { protectedProcedure } from "../trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { db, schema } from "@cmt/db/client";
import { getPagination, paginateInputSchema } from "../utils/paginate";
import { payoutInsertSchema, payoutUpdateSchema } from "@cmt/db/schema";
import { getClerkUser, getQueryUserIds } from "../utils/clerk";

export const payoutsRouter = {
  /** Create payout for subscribersToBatchId with approved status
   * @context collector
   */
  approve: protectedProcedure
    .input(payoutInsertSchema.omit({ totalAmount: true }))
    .mutation(async ({ ctx, input }) => {
      const deductions = (input.appliedCommissionRate / 100) * input.amount;

      return await ctx.db
        .insert(schema.payouts)
        .values({
          ...input,
          totalAmount: input.amount + deductions,
          payoutStatus: "approved",
          approvedAt: new Date(),
        })
        .onConflictDoUpdate({
          set: {
            ...input,
            totalAmount: input.amount + deductions,
            payoutStatus: "approved",
            approvedAt: new Date(),
          },
          target: schema.payouts.id,
        })
        .returning()
        .then((v) => v.at(0));
    }),

  /** Request the payout for the month
   * @context subscriber
   */
  request: protectedProcedure
    .input(z.object({ subscriberToBatchId: z.string(), month: z.date() }))
    .mutation(async ({ ctx, input }) => {
      const subToBatch = await ctx.db.query.subscribersToBatches.findFirst({
        where: eq(schema.subscribersToBatches.id, input.subscriberToBatchId),
        with: {
          batch: true,
        },
      });

      if (!subToBatch)
        throw new TRPCError({ message: "No chit found", code: "BAD_REQUEST" });

      const deductions =
        (subToBatch.commissionRate / 100) * subToBatch.batch.fundAmount;

      return await ctx.db
        .insert(schema.payouts)
        .values({
          ...input,
          amount: subToBatch.batch.fundAmount,
          appliedCommissionRate: subToBatch.commissionRate,
          totalAmount: subToBatch.batch.fundAmount + deductions,
          payoutStatus: "approved",
          requestedAt: new Date(),
        })
        .onConflictDoUpdate({
          set: {
            ...input,
            amount: subToBatch.batch.fundAmount,
            appliedCommissionRate: subToBatch.commissionRate,
            totalAmount: subToBatch.batch.fundAmount + deductions,
            payoutStatus: "approved",
            requestedAt: new Date(),
          },
          target: schema.payouts.id,
        })
        .returning()
        .then((v) => v.at(0));
    }),

  /** Cancell payout request
   * @context subscriber
   */
  cancel: protectedProcedure
    .input(z.object({ payoutId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.db
        .update(schema.payouts)
        .set({ payoutStatus: "cancelled", cancelledAt: new Date() })
        .returning()
        .then((v) => v.at(0));
    }),

  /** Update payout for subscribersToBatchId with disbursed status
   * @context collector
   */
  disburseAmount: protectedProcedure
    .input(
      payoutUpdateSchema
        .omit({ totalAmount: true })
        .and(z.object({ payoutId: z.string() }))
    )
    .mutation(async ({ ctx, input }) => {
      const deductions = Math.floor(
        (input.appliedCommissionRate / 100) * input.amount
      );

      return await ctx.db
        .update(schema.payouts)
        .set({
          ...input,
          deductions,
          totalAmount: input.amount + deductions,
          payoutStatus: "disbursed",
        })
        .where(eq(schema.payouts.id, input.payoutId))
        .returning()
        .then((v) => v.at(0));
    }),

  /** Delete payout for payoutId
   * @context collector
   */
  delete: protectedProcedure
    .input(z.object({ payoutId: z.string().min(1) }))
    .mutation(({ ctx, input }) =>
      ctx.db.delete(schema.payouts).where(eq(schema.payouts.id, input.payoutId))
    ),

  /** Get list subscribers who has approved or disubursed payouts
   * @context collector
   */
  ofBatch: protectedProcedure
    .input(
      paginateInputSchema.and(
        z.object({
          batchId: z.string(),
          query: z.string().optional(),
        })
      )
    )
    .query(async ({ ctx, input }) => {
      const subIds = await getQueryUserIds(ctx.clerk, input.query);
      const pageIndex = input.pageIndex;
      const pageSize = input.pageSize;

      const { offset } = getPagination(pageIndex, pageSize);

      const queryCond = input.query
        ? ilike(schema.subscribersToBatches.chitId, `%${input.query}%`)
        : undefined;

      const sb = await ctx.db.query.subscribersToBatches.findMany({
        where: subIds
          ? and(
              eq(schema.subscribersToBatches.batchId, input.batchId),
              and(
                inArray(schema.subscribersToBatches.subscriberId, subIds),
                queryCond
              )
            )
          : or(
              eq(schema.subscribersToBatches.batchId, input.batchId),
              queryCond
            ),
      });

      const [payouts, total] = await Promise.all([
        ctx.db.query.payouts.findMany({
          where: and(
            inArray(
              schema.payouts.subscriberToBatchId,
              sb.map((v) => v.id)
            ),
            inArray(schema.payouts.payoutStatus, ["approved", "disbursed"])
          ),
          with: {
            subscribersToBatches: true,
          },
          orderBy: ({ month }) => [desc(month)],
          limit: pageSize,
          offset,
        }),
        ctx.db
          .select({ count: count() })
          .from(schema.payouts)
          .where(
            inArray(
              schema.payouts.subscriberToBatchId,
              sb.map((v) => v.id)
            )
          )
          .then((r) => r.at(0)?.count ?? 0),
      ]);

      const mappedItems = await Promise.all(
        payouts.map(async (p) => {
          const sub = await ctx.clerk.users.getUser(
            p.subscribersToBatches.subscriberId
          );

          return {
            ...p,
            subscriber: {
              firstName: sub.firstName,
              lastName: sub.lastName,
              imageUrl: sub.imageUrl,
            },
          };
        })
      );

      return {
        items: mappedItems,
        total,
        pageIndex,
        pageSize,
      };
    }),

  /** Get payout details by payoutId
   * @context collector
   */
  getById: protectedProcedure
    .input(z.object({ payoutId: z.string().min(1) }))
    .query(async ({ ctx, input }) => {
      const payment = await ctx.db.query.payouts.findFirst({
        where: eq(schema.payouts.id, input.payoutId),
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

  /**
   * ### Get Next Eligible Subscribers
   * @context collector
   */
  getNextElligibleSubs: protectedProcedure
    .input(
      z.object({
        cursor: z.string().optional(),
        limit: z.number().default(10),
        query: z.string().optional(),
        batchId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const cursor = input.cursor;
      const limit = input.limit + 1;

      const clerkSubsIds = await getQueryUserIds(ctx.clerk, input.query);

      const queryCond =
        input.query && clerkSubsIds
          ? or(
              ilike(schema.subscribersToBatches.chitId, input.query),
              inArray(schema.subscribersToBatches.subscriberId, clerkSubsIds)
            )
          : undefined;

      const cursorCond = cursor
        ? lte(schema.subscribersToBatches.id, cursor)
        : undefined;

      // List out the not paid subscribers
      const notPaidCond = and(
        ...(cursorCond ? [cursorCond] : []),
        not(
          exists(
            db
              .select()
              .from(schema.payouts)
              .where(
                eq(
                  schema.subscribersToBatches.id,
                  schema.payouts.subscriberToBatchId
                )
              )
          )
        ),
        eq(schema.subscribersToBatches.batchId, input.batchId),
        ...(queryCond ? [queryCond] : [])
      );

      const nextSubs = await ctx.db
        .select()
        .from(schema.subscribersToBatches)
        .where(notPaidCond)
        .limit(limit)
        .orderBy(({ id }) => [desc(id)]);

      // Attach the clerk user object
      const nextSubsWithClerk = await Promise.all(
        nextSubs.map(async (sub) => {
          const user = await getClerkUser(sub.subscriberId);
          const batch = await db.query.batches.findFirst({
            columns: { fundAmount: true },
            where: eq(schema.batches.id, sub.batchId),
          });

          if (!batch)
            throw new TRPCError({
              message: "No batch fount",
              code: "NOT_FOUND",
            });

          return {
            ...sub,
            subscriber: user,
            /** @todo Fetch dynamicaly next month */
            month: new Date(),
            amount: batch.fundAmount,
          };
        })
      );

      const nextCursor =
        nextSubsWithClerk.length === limit
          ? nextSubsWithClerk.pop()?.id
          : undefined;

      return { items: nextSubsWithClerk, nextCursor };
    }),
};
