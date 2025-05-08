import { and, count, desc, eq, ilike, inArray, or } from "@cmt/db";
import { protectedProcedure } from "../trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { schema } from "@cmt/db/client";
import { paginateInputSchema } from "../utils/paginate";
import { payoutInsertSchema, payoutUpdateSchema } from "@cmt/db/schema";
import { getQueryUserIds } from "../utils/clerk";

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
          disbursedAt: new Date(),
        })
        .where(eq(schema.payouts.id, input.payoutId))
        .returning()
        .then((v) => v.at(0));
    }),

  /** Delete payment for paymentId
   * @context collector
   */
  delete: protectedProcedure
    .input(z.object({ paymentId: z.string().min(1) }))
    .mutation(({ ctx, input }) =>
      ctx.db
        .delete(schema.payouts)
        .where(eq(schema.payouts.id, input.paymentId))
    ),

  /** Update payout for payoutId
   * @context collector
   */
  update: protectedProcedure
    .input(payoutUpdateSchema.and(z.object({ paymentId: z.string().min(1) })))
    .mutation(({ ctx, input }) =>
      ctx.db
        .update(schema.payouts)
        .set(input)
        .where(eq(schema.payouts.id, input.paymentId))
        .returning()
        .then((v) => v.at(0))
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
          limit: pageSize,
          offset: pageIndex,
          orderBy: ({ month }) => [desc(month)],
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

  /** Get payment details by paymentID
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
};
