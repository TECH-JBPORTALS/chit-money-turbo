import { z } from "zod";
import { protectedProcedure } from "../trpc";
import { getSubscriberBatchesWithPagination } from "../utils/actions";
import { and, between, eq, gte, inArray, lte, sql } from "@cmt/db";
import { schema } from "@cmt/db/client";
import { TRPCError } from "@trpc/server";
import {
  addMonths,
  endOfMonth,
  getMonth,
  getYear,
  setDate,
  startOfMonth,
} from "date-fns";

export const chitsRouter = {
  /**
    Get's batches of subscriber withing the subscriber context
    @context collector
    @returns batches
   */
  ofSubscriber: protectedProcedure
    .input(
      z
        .object({
          cursor: z.string().optional(),
          limit: z.number().default(10),
          query: z.string().optional(),
          batchStatus: z
            .enum(["all", "active", "upcoming", "completed"])
            .default("all"),
        })
        .optional()
    )
    .query(async ({ ctx, input }) => {
      return getSubscriberBatchesWithPagination({ ctx, input });
    }),

  /**
   * Get details of a chit
   * @context subscriber
   */
  getById: protectedProcedure
    .input(z.object({ subToBatchId: z.string() }))
    .query(({ ctx, input }) =>
      ctx.db.query.subscribersToBatches.findFirst({
        where: eq(schema.subscribersToBatches.id, input.subToBatchId),
        with: {
          batch: {
            with: {
              collector: true,
            },
          },
        },
      })
    ),

  /**
   * Get runway for batch withing subscriber context
   * 1. Get's completed months
   * 2. Get's any available slots for payouts
   * 3. Get's approved or requested payouts
   *
   * @context Subscriber
   */
  getRunway: protectedProcedure
    .input(z.object({ subToBatchId: z.string() }))
    .query(async ({ ctx, input }) => {
      const subToBatch = await ctx.db.query.subscribersToBatches.findFirst({
        where: eq(schema.batches.id, input.subToBatchId),
        with: {
          batch: true,
        },
      });

      if (!subToBatch)
        throw new TRPCError({ message: "No chit found", code: "NOT_FOUND" });

      const scheme = subToBatch.batch.scheme;
      const startsOn = subToBatch.batch.startsOn;

      const months = await Promise.all(
        Array.from({ length: scheme }, async (_, index) => {
          const date = addMonths(startsOn, index);

          console.log(date);

          const id = `${index + 1}`;

          const month = getMonth(date) + 1;
          const year = getYear(date);

          // Check if any requests made by this chit already have requested, approved, rejected for this month
          const payoutOfMonth = await ctx.db.query.payouts.findFirst({
            where: and(
              sql`EXTRACT(MONTH FROM ${schema.payouts.month}) = ${month}`,
              sql`EXTRACT(YEAR FROM ${schema.payouts.month}) = ${year}`,
              inArray(schema.payouts.payoutStatus, [
                "requested",
                "approved",
                "rejected",
              ]),
              eq(schema.payouts.subscriberToBatchId, subToBatch.id)
            ),
          });

          /**
           *  If there is a payout and that matches with the current chit,
           *  Then returns the payout with exact status and id
           * */
          if (payoutOfMonth)
            return {
              id,
              date,
              payoutId: payoutOfMonth.id,
              payoutStatus: payoutOfMonth.payoutStatus,
            };

          /** If there is no payout for the month for current chit, then look for others */
          const othersPayoutOfMonth = await ctx.db.query.payouts.findFirst({
            where: and(
              sql`EXTRACT(MONTH FROM ${schema.payouts.month}) = ${month}`,
              sql`EXTRACT(YEAR FROM ${schema.payouts.month}) = ${year}`,
              inArray(schema.payouts.payoutStatus, ["approved", "disbursed"])
            ),
          });

          console.log(
            "month-year",
            month,
            year,
            payoutOfMonth,
            othersPayoutOfMonth
          );

          /** If there is no other chit's payouts exists for the month,
           * then give option to raise request */
          if (!othersPayoutOfMonth)
            return {
              id,
              date,
              payoutId: undefined,
              payoutStatus: "available",
            };

          return {
            id,
            date,
            payoutId: undefined,
            payoutStatus: undefined,
          };
        })
      );

      return months;
    }),
};
