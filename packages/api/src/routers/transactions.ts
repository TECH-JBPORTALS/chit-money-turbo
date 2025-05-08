import { schema } from "@cmt/db/client";
import { protectedProcedure } from "../trpc";
import { desc, eq, inArray, sql, unionAll } from "@cmt/db";
import { TRPCError } from "@trpc/server";

export const transactionsRouter = {
  /**
   * ### Get all transactions (payments & payouts)
   *
   * @context subscriber
   */
  getInfinitiyOfSubscriber: protectedProcedure.query(async ({ ctx }) => {
    // Union query for mix up the payments and payouts
    const subToBatch = await ctx.db.query.subscribersToBatches.findMany({
      where: eq(schema.subscribersToBatches.subscriberId, ctx.session.userId),
    });

    if (!subToBatch)
      throw new TRPCError({ message: "No chit found", code: "NOT_FOUND" });

    const payments = ctx.db
      .select({
        transactionId: schema.payments.id,
        type: sql<string>`'payment'`.mapWith(String).as("type"),
        totalAmount: schema.payments.totalAmount,
        creditScoreAffected: schema.payments.creditScoreAffected,
        batch: schema.batches,
        payoutStatus: sql<
          "requested" | "rejected" | "disbursed" | "cancelled" | "approved"
        >`NULL`.as("payoutStatus"),
        collector: schema.collectors,
        createdAt: sql`"payments"."created_at" as createdAt`,
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
        eq(schema.subscribersToBatches.id, schema.payments.subscriberToBatchId)
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
        batch: schema.batches,
        payoutStatus: schema.payouts.payoutStatus,
        collector: schema.collectors,
        createdAt: sql`"payouts"."created_at" as createdAt`,
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

    return unionAll(payments, payouts)
      .limit(10)
      .orderBy(desc(sql`createdAt`)); // 👈 for pagination
  }),
};
