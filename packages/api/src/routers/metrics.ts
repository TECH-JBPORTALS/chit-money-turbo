import { count, desc, eq, sql, sum } from "@cmt/db";
import { protectedProcedure } from "../trpc";
import { schema } from "@cmt/db/client";

export const metricsRouter = {
  /** Get total batches of organization */
  getTotalBatchesOfOrganization: protectedProcedure.query(async ({ ctx }) =>
    ctx.db
      .select({ count: count() })
      .from(schema.batches)
      .where(eq(schema.batches.collectorId, ctx.session.userId))
      .then((r) => r.at(0)?.count ?? 0)
  ),

  /** Get total subscribers involved in organization */
  getTotalSubscribersInvolvedInOrganization: protectedProcedure.query(
    async ({ ctx }) =>
      ctx.db
        .select({ count: count() })
        .from(schema.subscribersToBatches)
        .leftJoin(
          schema.batches,
          eq(schema.subscribersToBatches.batchId, schema.batches.id)
        )
        .where(eq(schema.batches.collectorId, ctx.session.userId))
        .groupBy(schema.subscribersToBatches.subscriberId)
        .then((r) => r.at(0)?.count ?? 0)
  ),

  /** Get latest 4 subscribers */
  getLatestSubscribers: protectedProcedure.query(async ({ ctx }) => {
    const subs = await ctx.db
      .select({ subscriberId: schema.subscribersToBatches.subscriberId })
      .from(schema.subscribersToBatches)
      .leftJoin(
        schema.batches,
        eq(schema.subscribersToBatches.batchId, schema.batches.id)
      )
      .where(eq(schema.batches.collectorId, ctx.session.userId))
      //   .orderBy(desc(schema.subscribersToBatches.createdAt))
      .limit(4);

    const subsWithClerkUser = await Promise.all(
      subs.map(async (sub) => {
        console.log(sub.subscriberId);
        const user = await ctx.clerk.users.getUser(sub.subscriberId);
        return {
          ...sub,
          user: {
            id: user.id,
            imageUrl: user.imageUrl,
            firstName: user.firstName,
            lastName: user.lastName,
          },
        };
      })
    );

    return subsWithClerkUser;
  }),

  /** Total collection of payments from active batches
   * :TODO
   */
  getTotalCollectionOfOrganization: protectedProcedure.query(
    async ({ ctx }) => {
      const totalAmountToBeCollected = await ctx.db
        .select({
          sum: sql`${schema.batches.fundAmount}*${schema.batches.scheme}`.mapWith(
            Number
          ),
        })
        .from(schema.subscribersToBatches)
        .leftJoin(
          schema.batches,
          eq(schema.batches.id, schema.subscribersToBatches.batchId)
        )
        .where(eq(schema.batches.collectorId, ctx.session.userId))
        .then((r) => r.at(0)?.sum ?? 0);

      const collectedAmount = await ctx.db
        .select({
          sum: sum(schema.payments.subscriptionAmount).mapWith(Number),
        })
        .from(schema.subscribersToBatches)
        .leftJoin(
          schema.batches,
          eq(schema.batches.id, schema.subscribersToBatches.batchId)
        )
        .leftJoin(
          schema.payments,
          eq(
            schema.payments.subscriberToBatchId,
            schema.subscribersToBatches.id
          )
        )
        .where(eq(schema.batches.collectorId, ctx.session.userId))
        .then((r) => r.at(0)?.sum ?? 0);

      return {
        totalAmountToBeCollected,
        collectedAmount,
      };
    }
  ),

  /** Get total penalty collected from all batches payments in organization */
  getTotalPenaltyCollectedInOrganization: protectedProcedure.query(({ ctx }) =>
    ctx.db
      .select({
        sum: sum(schema.payments.penalty).mapWith(Number),
        totalTransactions: count(schema.payments.id),
      })
      .from(schema.subscribersToBatches)
      .leftJoin(
        schema.batches,
        eq(schema.batches.id, schema.subscribersToBatches.batchId)
      )
      .leftJoin(
        schema.payments,
        eq(schema.payments.subscriberToBatchId, schema.subscribersToBatches.id)
      )
      .where(eq(schema.batches.collectorId, ctx.session.userId))
      .then((r) => ({
        totalPenalty: r.at(0)?.sum ?? 0,
        totalTransaction: r.at(0)?.totalTransactions ?? 0,
      }))
  ),
};
