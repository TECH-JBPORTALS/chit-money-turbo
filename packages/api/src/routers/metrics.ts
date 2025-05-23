import { z } from "zod";
import {
  and,
  count,
  countDistinct,
  eq,
  getTableColumns,
  gt,
  inArray,
  lt,
  lte,
  notExists,
  notInArray,
  sql,
  sum,
} from "@cmt/db";
import { protectedProcedure } from "../trpc";
import { schema } from "@cmt/db/client";
import { startOfToday } from "date-fns";
import { getBatchById } from "../utils/actions";
import { getClerkUser } from "../utils/clerk";

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

  /** Total collection of payments from active batches  */
  getTotalCollectionOfOrganization: protectedProcedure
    .input(z.object({ forThisMonth: z.boolean() }).optional())
    .query(async ({ ctx, input }) => {
      const thisMonthCondForCollectedAmount = input?.forThisMonth
        ? and(
            eq(
              sql`EXTRACT(MONTH FROM ${schema.payments.runwayDate})`,
              new Date().getMonth()
            ),
            eq(
              sql`EXTRACT(YEAR FROM ${schema.payments.runwayDate})`,
              new Date().getFullYear()
            )
          )
        : undefined;

      const totalAmountToBeCollected = await ctx.db
        .select({
          sum: input?.forThisMonth
            ? sum(schema.batches.fundAmount).mapWith(Number)
            : sql`SUM(${schema.batches.fundAmount}*${schema.batches.scheme})`.mapWith(
                Number
              ),
        })
        .from(schema.batches)
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
        .where(
          and(
            eq(schema.batches.collectorId, ctx.session.userId),
            thisMonthCondForCollectedAmount
          )
        )
        .then((r) => r.at(0)?.sum ?? 0);

      return {
        totalAmountToBeCollected,
        collectedAmount,
      };
    }),

  /** Get's current batch fund progress till today */
  getFundProgressOfBatch: protectedProcedure
    .input(z.object({ batchId: z.string() }))
    .query(async ({ ctx, input }) => {
      const batch = await getBatchById(input.batchId, ctx.db);

      const totalMonths = batch.scheme;
      const completedMonths =
        (startOfToday().getFullYear() - batch.startsOn.getFullYear()) * 12 +
        (startOfToday().getMonth() - batch.startsOn.getMonth() - 1); // Except this month still to be done

      return {
        totalMonths,
        completedMonths,
      };
    }),

  /** Get's this month approved or disbursed payout */
  getThisMonthPayoutOfBatch: protectedProcedure
    .input(z.object({ batchId: z.string() }))
    .query(async ({ ctx, input }) => {
      const batch = await getBatchById(input.batchId, ctx.db);

      const payout = await ctx.db
        .select({
          ...getTableColumns(schema.payouts),
          subscriberToBatch: getTableColumns(schema.subscribersToBatches),
        })
        .from(schema.payouts)
        .innerJoin(
          schema.subscribersToBatches,
          eq(schema.subscribersToBatches.id, schema.payouts.subscriberToBatchId)
        )
        .where(
          and(
            eq(schema.subscribersToBatches.batchId, batch.id),
            eq(
              sql`EXTRACT(MONTH FROM ${schema.payouts.month})`,
              new Date().getMonth()
            ),
            eq(
              sql`EXTRACT(YEAR FROM ${schema.payouts.month})`,
              new Date().getFullYear()
            ),
            inArray(schema.payouts.payoutStatus, ["approved", "disbursed"])
          )
        )
        .then((r) => r.at(0));

      if (!payout) return null;

      const clerkUser = await getClerkUser(
        payout.subscriberToBatch.subscriberId
      );

      return {
        ...payout,
        subscriber: clerkUser,
        fundAmount: batch.fundAmount,
      };
    }),

  /** ## Get's this month payments progress
   * Returns total payments should be collected and number of payments done in the batch
   */
  getThisMonthPaymentsProgressOfBatch: protectedProcedure
    .input(z.object({ batchId: z.string() }))
    .query(async ({ ctx, input }) => {
      const batch = await getBatchById(input.batchId, ctx.db);

      const totalPaymentsToBeCollected = await ctx.db
        .select({ count: countDistinct(schema.subscribersToBatches.id) })
        .from(schema.subscribersToBatches)
        .where(eq(schema.subscribersToBatches.batchId, batch.id))
        .then((r) => r.at(0)?.count ?? 0);

      const paymentsDone = await ctx.db
        .select({ count: countDistinct(schema.payments.subscriberToBatchId) })
        .from(schema.payments)
        .innerJoin(
          schema.subscribersToBatches,
          eq(
            schema.subscribersToBatches.id,
            schema.payments.subscriberToBatchId
          )
        )
        .where(
          and(
            eq(schema.subscribersToBatches.batchId, batch.id),
            eq(
              sql`EXTRACT(MONTH FROM ${schema.payments.runwayDate})`,
              new Date().getMonth() + 1
            ),
            eq(
              sql`EXTRACT(YEAR FROM ${schema.payments.runwayDate})`,
              new Date().getFullYear()
            )
          )
        )
        .then((r) => r[0]?.count ?? 0);

      return {
        totalPaymentsToBeCollected,
        paymentsDone,
      };
    }),

  /** ## Get's this month pending payments
   * Returns total pending payments count and 3 users
   */
  getThisMonthPendingPaymentsOfBatch: protectedProcedure
    .input(z.object({ batchId: z.string() }))
    .query(async ({ ctx, input }) => {
      const batch = await getBatchById(input.batchId, ctx.db);

      const totalPaymentsToBeCollected = await ctx.db
        .select({ count: countDistinct(schema.subscribersToBatches.id) })
        .from(schema.subscribersToBatches)
        .where(eq(schema.subscribersToBatches.batchId, batch.id))
        .then((r) => r.at(0)?.count ?? 0);

      const paymentsDone = await ctx.db
        .select({ count: countDistinct(schema.payments.subscriberToBatchId) })
        .from(schema.payments)
        .innerJoin(
          schema.subscribersToBatches,
          eq(
            schema.subscribersToBatches.id,
            schema.payments.subscriberToBatchId
          )
        )
        .where(
          and(
            eq(schema.subscribersToBatches.batchId, batch.id),
            eq(
              sql`EXTRACT(MONTH FROM ${schema.payments.runwayDate})`,
              new Date().getMonth() + 1
            ),
            eq(
              sql`EXTRACT(YEAR FROM ${schema.payments.runwayDate})`,
              new Date().getFullYear()
            )
          )
        )
        .then((r) => r[0]?.count ?? 0);

      const paidIds = await ctx.db
        .select({ id: schema.payments.subscriberToBatchId })
        .from(schema.payments)
        .innerJoin(
          schema.subscribersToBatches,
          eq(
            schema.subscribersToBatches.id,
            schema.payments.subscriberToBatchId
          )
        )
        .where(
          and(
            eq(schema.subscribersToBatches.batchId, batch.id),
            eq(
              sql`EXTRACT(MONTH FROM ${schema.payments.runwayDate})`,
              new Date().getMonth() + 1
            ),
            eq(
              sql`EXTRACT(YEAR FROM ${schema.payments.runwayDate})`,
              new Date().getFullYear()
            )
          )
        );

      const paidIdList = paidIds.map((r) => r.id);

      const pendingSubs = await ctx.db
        .select()
        .from(schema.subscribersToBatches)
        .where(
          and(
            eq(schema.subscribersToBatches.batchId, batch.id),
            notInArray(schema.subscribersToBatches.id, paidIdList)
          )
        )
        .limit(3);

      const pendingSubsWithClerkUsers = await Promise.all(
        pendingSubs.map(async (s) => {
          const clerkUser = await getClerkUser(s.subscriberId);

          return {
            ...clerkUser,
          };
        })
      );

      return {
        totalPaymentsToBeCollected,
        paymentsDone,
        pendingUsers: pendingSubsWithClerkUsers,
      };
    }),

  /** Total collection of payments from batch  */
  getTotalCollectionOfBatch: protectedProcedure
    .input(
      z.object({ forThisMonth: z.boolean().optional(), batchId: z.string() })
    )
    .query(async ({ ctx, input }) => {
      const thisMonthCondForCollectedAmount = input?.forThisMonth
        ? and(
            eq(
              sql`EXTRACT(MONTH FROM ${schema.payments.runwayDate})`,
              new Date().getMonth()
            ),
            eq(
              sql`EXTRACT(YEAR FROM ${schema.payments.runwayDate})`,
              new Date().getFullYear()
            )
          )
        : undefined;

      const totalAmountToBeCollected = await ctx.db
        .select({
          sum: input?.forThisMonth
            ? sum(schema.batches.fundAmount).mapWith(Number)
            : sql`SUM(${schema.batches.fundAmount}*${schema.batches.scheme})`.mapWith(
                Number
              ),
        })
        .from(schema.batches)
        .where(eq(schema.batches.id, input.batchId))
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
        .where(
          and(
            eq(schema.batches.id, input.batchId),
            thisMonthCondForCollectedAmount
          )
        )
        .then((r) => r.at(0)?.sum ?? 0);

      return {
        totalAmountToBeCollected,
        collectedAmount,
      };
    }),

  /** Get total penalty collected from all batches payments in organization */
  getTotalPenaltyCollectedInOrganization: protectedProcedure
    .input(z.object({ forThisMonth: z.boolean() }).optional())
    .query(async ({ ctx, input }) => {
      const thisMonthCondForCollectedAmount = input?.forThisMonth
        ? and(
            eq(
              sql`EXTRACT(MONTH FROM ${schema.payments.runwayDate})`,
              new Date().getMonth()
            ),
            eq(
              sql`EXTRACT(YEAR FROM ${schema.payments.runwayDate})`,
              new Date().getFullYear()
            )
          )
        : undefined;

      const response = await ctx.db
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
          eq(
            schema.payments.subscriberToBatchId,
            schema.subscribersToBatches.id
          )
        )
        .where(
          and(
            eq(schema.batches.collectorId, ctx.session.userId),
            thisMonthCondForCollectedAmount
          )
        )
        .then((r) => ({
          totalPenalty: r.at(0)?.sum ?? 0,
          totalTransaction: r.at(0)?.totalTransactions ?? 0,
        }));
      return response;
    }),

  /** Get Pre, On-Time, Late Payments Counts for this month in the current organization's all active batches */
  getPaymentsMetricsForThisMonth: protectedProcedure
    .input(z.enum(["pre", "on-time", "late"]))
    .query(async ({ ctx, input }) => {
      const paidOnCond = () => {
        switch (input) {
          case "pre":
            return lt(schema.payments.paidOn, schema.payments.runwayDate);

          case "on-time":
            return eq(schema.payments.paidOn, schema.payments.runwayDate);

          case "on-time":
            return gt(schema.payments.paidOn, schema.payments.runwayDate);

          default:
            return undefined;
        }
      };

      const paymentMetrics = await ctx.db
        .select({
          count: count(schema.payments.id),
          numberOfBatches: count(schema.batches.id),
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
        .where(
          and(eq(schema.batches.collectorId, ctx.session.userId), paidOnCond())
        )
        .groupBy(schema.batches.id)
        .then((r) => ({
          totalPayments: r.at(0)?.count ?? 0,
          fromTotalBatches: r.at(0)?.numberOfBatches ?? 0,
        }));

      return paymentMetrics;
    }),

  /** Get payments dues count for subscriber from all active batches
   * @context Subscriber
   */
  getPaymentsDuesCount: protectedProcedure.query(async ({ ctx }) => {
    const currentRunwayMonth = new Date().getMonth();
    const currentRunwayYear = new Date().getFullYear();

    return await ctx.db
      .select({ count: count(schema.subscribersToBatches.id) })
      .from(schema.subscribersToBatches)
      .innerJoin(
        schema.batches,
        and(
          eq(schema.batches.id, schema.subscribersToBatches.batchId),
          eq(schema.batches.batchStatus, "active")
        )
      )
      .where(
        and(
          eq(schema.subscribersToBatches.subscriberId, ctx.session.userId),
          notExists(
            ctx.db
              .select()
              .from(schema.payments)
              .where(
                and(
                  eq(
                    schema.payments.subscriberToBatchId,
                    schema.subscribersToBatches.id
                  ),
                  eq(
                    sql`EXTRACT(MONTH FROM ${schema.payments.runwayDate})`,
                    currentRunwayMonth
                  ),
                  eq(
                    sql`EXTRACT(YEAR FROM ${schema.payments.runwayDate})`,
                    currentRunwayYear
                  )
                )
              )
          )
        )
      )
      .then((r) => r.at(0)?.count ?? 0);
  }),

  /** Get payments made count for subscriber from all active batches
   * @context Subscriber
   */
  getPaymentsMadeCount: protectedProcedure.query(({ ctx }) =>
    ctx.db
      .select({ count: count(schema.payments.id) })
      .from(schema.payments)
      .leftJoin(
        schema.subscribersToBatches,
        eq(schema.subscribersToBatches.id, schema.payments.subscriberToBatchId)
      )
      .leftJoin(
        schema.batches,
        eq(schema.batches.id, schema.subscribersToBatches.batchId)
      )
      .where(
        and(
          eq(schema.subscribersToBatches.subscriberId, ctx.session.userId),
          eq(schema.batches.batchStatus, "active")
        )
      )
      .then((r) => r.at(0)?.count ?? 0)
  ),

  /** Get missed payments count for subscriber from all active batches
   * @context Subscriber
   */
  getMissedPaymentsCount: protectedProcedure.query(async ({ ctx }) => {
    // const userId = ctx.session.userId;
    // const today = new Date();

    const missedPayments = await ctx.db
      .select({ count: count(schema.subscribersToBatches.id) })
      .from(schema.subscribersToBatches)
      .innerJoin(
        schema.batches,
        and(
          eq(schema.batches.batchStatus, "active"),
          eq(schema.batches.id, schema.subscribersToBatches.batchId)
        )
      )
      .where(
        and(
          eq(schema.subscribersToBatches.subscriberId, ctx.session.userId),
          notExists(
            ctx.db
              .select()
              .from(schema.payments)
              .where(
                and(
                  eq(
                    schema.payments.subscriberToBatchId,
                    schema.subscribersToBatches.id
                  ),
                  lte(schema.payments.runwayDate, new Date().toDateString())
                )
              )
          )
        )
      )
      .then((r) => r.at(0)?.count ?? 0);

    return missedPayments;
  }),

  /** Get missed payments count for subscriber from all active batches
   * @context Subscriber
   */
  getLatePaymentsCount: protectedProcedure.query(({ ctx }) =>
    ctx.db
      .select({ count: count(schema.payments.id) })
      .from(schema.payments)
      .leftJoin(
        schema.subscribersToBatches,
        eq(schema.subscribersToBatches.id, schema.payments.subscriberToBatchId)
      )
      .leftJoin(
        schema.batches,
        eq(schema.batches.id, schema.subscribersToBatches.batchId)
      )
      .where(
        and(
          eq(schema.subscribersToBatches.subscriberId, ctx.session.userId),
          eq(schema.batches.batchStatus, "active"),
          gt(schema.payments.paidOn, schema.payments.runwayDate)
        )
      )
      .then((r) => r.at(0)?.count ?? 0)
  ),
};
