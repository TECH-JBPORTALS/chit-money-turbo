import { schema } from "@cmt/db/client";
import { protectedProcedure } from "../trpc";
import { and, desc, eq, inArray, lt, lte, sql, unionAll } from "@cmt/db";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

export const transactionsRouter = {
  /**
   * ### Get all transactions (payments & payouts)
   *
   * @context subscriber
   */
  getInfinitiyOfSubscriber: protectedProcedure
    .input(
      z
        .object({
          limit: z.number().optional(),
          cursor: z.string().optional(),
          type: z.enum(["payouts", "all"]).optional(),
          /** Fetch transaction based on current chit */
          subToBatchId: z.string().optional(),
        })
        .optional()
    )
    .query(async ({ ctx, input }) => {
      const limit = input?.limit ?? 10;
      const cursor = input?.cursor;

      const subToBatchCond = input?.subToBatchId
        ? eq(schema.subscribersToBatches.id, input.subToBatchId)
        : undefined;

      const subToBatch = await ctx.db.query.subscribersToBatches.findMany({
        where: and(
          eq(schema.subscribersToBatches.subscriberId, ctx.session.userId),
          subToBatchCond
        ),
      });

      if (subToBatch.length === 0)
        throw new TRPCError({ message: "No chit found", code: "NOT_FOUND" });

      const payments = ctx.db
        .select({
          transactionId: schema.payments.id,
          type: sql<string>`'payment'`.mapWith(String).as("type"),
          totalAmount: schema.payments.totalAmount,
          creditScoreAffected: schema.payments.creditScoreAffected,
          batchName: schema.batches.name,
          orgName: schema.collectors.orgName,
          payoutStatus: sql<
            "requested" | "rejected" | "disbursed" | "cancelled" | "approved"
          >`NULL`.as("payoutStatus"),
          month: schema.payments.paidOn,
          updatedAt: sql<
            typeof schema.payments.$inferSelect.updatedAt
          >`${schema.payments.updatedAt}`.as("updatedAt"),
        })
        .from(schema.payments)
        .where(
          inArray(
            schema.payments.subscriberToBatchId,
            subToBatch.map((s) => s.id)
          )
        )
        .leftJoin(
          schema.subscribersToBatches,
          eq(
            schema.subscribersToBatches.id,
            schema.payments.subscriberToBatchId
          )
        )
        .leftJoin(
          schema.batches,
          eq(schema.batches.id, schema.subscribersToBatches.batchId)
        )
        .leftJoin(
          schema.collectors,
          eq(schema.collectors.id, schema.batches.collectorId)
        );

      const payouts = ctx.db
        .select({
          transactionId: schema.payouts.id,
          type: sql`'payout'`.mapWith(String).as("type"),
          totalAmount: schema.payouts.totalAmount,
          creditScoreAffected: sql<number>`NULL`
            .mapWith(Number)
            .as("creditScoreAffected"),
          batchName: schema.batches.name,
          orgName: schema.collectors.orgName,
          payoutStatus: schema.payouts.payoutStatus,
          month: schema.payouts.month,
          updatedAt: sql<
            typeof schema.payouts.$inferSelect.updatedAt
          >`${schema.payouts.updatedAt}`.as("updatedAt"),
        })
        .from(schema.payouts)
        .where(
          inArray(
            schema.payouts.subscriberToBatchId,
            subToBatch.map((s) => s.id)
          )
        )
        .leftJoin(
          schema.subscribersToBatches,
          eq(schema.subscribersToBatches.id, schema.payouts.subscriberToBatchId)
        )
        .leftJoin(
          schema.batches,
          eq(schema.batches.id, schema.subscribersToBatches.batchId)
        )
        .leftJoin(
          schema.collectors,
          eq(schema.collectors.id, schema.batches.collectorId)
        );

      const unionTransaction = unionAll(payments, payouts).as("transaction");

      const cursorCond = cursor
        ? lte(unionTransaction.transactionId, cursor)
        : undefined;

      const filtersCond =
        input?.type === "payouts"
          ? eq(unionTransaction.type, "payout")
          : undefined;

      const transactions = await ctx.db
        .select()
        .from(unionTransaction)
        .where(and(cursorCond, filtersCond))
        .orderBy(
          desc(unionTransaction.updatedAt),
          desc(unionTransaction.transactionId)
        )
        .limit(limit + 1);

      const nextCursor =
        transactions.length > limit
          ? transactions.pop()?.transactionId
          : undefined;

      return {
        items: transactions,
        nextCursor,
      };
    }),
};
