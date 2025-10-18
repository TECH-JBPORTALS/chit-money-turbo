import {
  batchInsertSchema,
  batchSelectSchema,
  batchUpdateSchema,
} from "@cmt/db/schema";
import { and, desc, eq, inArray, not, or, sql } from "@cmt/db";
import { protectedProcedure } from "../trpc";
import { addMonths } from "date-fns";
import { z } from "zod";
import { schema } from "@cmt/db/client";
import { generateChitId } from "@cmt/db/utils";
import { paginateInputSchema } from "../utils/paginate";
import {
  getFundProgressOfBatch,
  getSubscribersByBatchId,
} from "../utils/actions";
import { TRPCError } from "@trpc/server";

export const batchesRouter = {
  /** Create new batch only
   * @context collector
   */
  create: protectedProcedure
    .input(batchInsertSchema)
    .mutation(({ ctx, input }) =>
      ctx.db
        .insert(schema.batches)
        .values({
          ...input,
          collectorId: ctx.session.userId,
          endsOn: addMonths(input.startsOn, input.scheme).toDateString(),
        })
        .returning()
    ),

  /**
   * Get all batches
   * @context collector
   */
  getAll: protectedProcedure
    .input(batchSelectSchema.pick({ batchStatus: true }).optional())
    .query(async ({ ctx, input }) => {
      const batchStatus = input?.batchStatus ?? "active";
      const batchesList = ctx.db.query.batches.findMany({
        where: and(
          eq(schema.batches.collectorId, ctx.session.userId),
          eq(schema.batches.batchStatus, batchStatus)
        ),
        orderBy: desc(schema.batches.createdAt),
      });
      return batchesList ?? [];
    }),

  /**
   * Get details of a batch
   * @context collector | subscriber
   */
  getById: protectedProcedure
    .input(z.object({ batchId: z.string() }))
    .query(async ({ ctx, input }) => {
      const batch = await ctx.db.query.batches.findFirst({
        where: eq(schema.batches.id, input.batchId),
        with: { collector: true },
      });

      if (!batch)
        throw new TRPCError({ message: "No batch found", code: "NOT_FOUND" });

      const fundProgress = await getFundProgressOfBatch(
        new Date(),
        batch.id,
        ctx.db
      );

      const canCompleteBatch =
        fundProgress.completedMonths === fundProgress.totalMonths;
      const canUpdateFundAmount = fundProgress.completedMonths === 0;
      const minSchemaValue =
        fundProgress.completedMonths !== 0 ? fundProgress.completedMonths : 1; // Make sure if the completed months is none then minmum there should be 1 month scheme
      const canUpdateStartsOn = fundProgress.completedMonths === 0;

      return {
        ...batch,
        canCompleteBatch,
        canUpdateFundAmount,
        minSchemaValue,
        canUpdateStartsOn,
      };
    }),

  update: protectedProcedure
    .input(batchUpdateSchema.and(z.object({ batchId: z.string() })))
    .mutation(async ({ ctx, input }) => {
      const {
        name,
        fundAmount,
        scheme,
        startsOn,
        dueOn,
        defaultCommissionRate,
        batchId,
      } = input;

      const batch = await ctx.db.query.batches.findFirst({
        where: eq(schema.batches.id, batchId),
      });

      if (!batch)
        throw new TRPCError({ message: "Batch not found", code: "NOT_FOUND" });

      //Reset the batch with pyments and payouts with given scheme

      // New runway dates

      if (!startsOn || isNaN(new Date(startsOn).getTime())) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Invalid or missing 'startsOn' date",
        });
      }

      const runwayDates = Array.from({ length: scheme }).map((_, i) =>
        addMonths(new Date(startsOn), i)
      );

      const rdConditionsForPayments = runwayDates.map((date) =>
        and(
          not(
            eq(
              sql`EXTRACT (MONTH FROM ${schema.payments.runwayDate})`,
              date.getMonth() + 1
            )
          ),
          not(
            eq(
              sql`EXTRACT (YEAR FROM ${schema.payments.runwayDate})`,
              date.getFullYear()
            )
          )
        )
      );

      const rdConditionsForPayouts = runwayDates.map((date) =>
        and(
          not(
            eq(
              sql`EXTRACT (MONTH FROM ${schema.payouts.month})`,
              date.getMonth() + 1
            )
          ),
          not(
            eq(
              sql`EXTRACT (YEAR FROM ${schema.payouts.month})`,
              date.getFullYear()
            )
          )
        )
      );

      // 1. Delete all the payments which is beyond the scheme limit
      const paymentsOutOfBoundary = await ctx.db
        .select({ paymentId: schema.payments.id })
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
            eq(schema.subscribersToBatches.batchId, batchId),
            or(...rdConditionsForPayments)
          )
        );

      if (paymentsOutOfBoundary.length > 0)
        await ctx.db.delete(schema.payments).where(
          inArray(
            schema.payments.id,
            paymentsOutOfBoundary.map((p) => p.paymentId)
          )
        );

      // 2. Delete all the payouts which is beyond the scheme limit
      const payoutsOutOfBoundary = await ctx.db
        .select({ payoutId: schema.payouts.id })
        .from(schema.payouts)
        .innerJoin(
          schema.subscribersToBatches,
          eq(schema.subscribersToBatches.id, schema.payouts.subscriberToBatchId)
        )
        .where(
          and(
            eq(schema.subscribersToBatches.batchId, batchId),
            or(...rdConditionsForPayouts)
          )
        );

      if (payoutsOutOfBoundary.length > 0)
        await ctx.db.delete(schema.payouts).where(
          inArray(
            schema.payouts.id,
            payoutsOutOfBoundary.map((p) => p.payoutId)
          )
        );

      // 3. Update the batch details
      const newBatch = await ctx.db
        .update(schema.batches)
        .set({
          name,
          startsOn,
          scheme,
          fundAmount,
          dueOn,
          defaultCommissionRate,
        })
        .where(eq(schema.batches.id, batchId))
        .returning();

      return newBatch.at(0);
    }),

  delete: protectedProcedure
    .input(z.object({ batchId: z.string() }))
    .mutation(({ ctx, input }) =>
      ctx.db.delete(schema.batches).where(eq(schema.batches.id, input.batchId))
    ),

  markAsCompleted: protectedProcedure
    .input(z.object({ batchId: z.string() }))
    .mutation(({ ctx, input }) =>
      ctx.db
        .update(schema.batches)
        .set({ batchStatus: "completed" })
        .where(eq(schema.batches.id, input.batchId))
    ),

  /**
   * Add subscriber
   * @context collector
   */
  addSubscriber: protectedProcedure
    .input(z.object({ subId: z.string().min(1), batchId: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      const { batch } = await generateChitId(input.batchId);

      const subToBatch = await ctx.db
        .insert(schema.subscribersToBatches)
        .values({
          // chitId,
          subscriberId: input.subId,
          batchId: batch.id,
          commissionRate: batch.defaultCommissionRate,
        })
        .returning();

      return subToBatch.at(0);
    }),

  /**
   * Update commision rate of chit
   * @context collector
   */
  updateCommissionRate: protectedProcedure
    .input(
      z.object({
        subscriberToBatchId: z.string(),
        newCommissionRate: z.number(),
      })
    )
    .mutation(({ ctx, input }) =>
      ctx.db
        .update(schema.subscribersToBatches)
        .set({ commissionRate: input.newCommissionRate })
        .where(eq(schema.subscribersToBatches.id, input.subscriberToBatchId))
    ),

  /**
   * Get's batches the subscriber involved in a particular collector's org
   * @context collector
   */
  bySubscriberId: protectedProcedure
    .input(z.object({ subscriberId: z.string() }))
    .query(({ ctx, input }) =>
      ctx.db.query.batches.findMany({
        where: eq(schema.batches.collectorId, ctx.session.userId),
        with: {
          subscribersToBatches: {
            where: eq(
              sql`${schema.subscribersToBatches.subscriberId}`,
              input.subscriberId
            ),
          },
        },
      })
    ),

  /**
    Get's subscriber of given batch withing the collector context
    @context collector
    @param batchId unique batch ID
    @param query search string which searches through firstName, lastName, emailAddress, chitId
    @returns subscribers
   */
  getSubscribers: protectedProcedure
    .input(
      paginateInputSchema.and(
        z.object({
          batchId: z.string(),
          query: z.string().optional(),
        })
      )
    )
    .query(async ({ ctx, input }) => {
      return getSubscribersByBatchId({ ctx, input });
    }),
};
