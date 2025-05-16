import { batchInsertSchema } from "@cmt/db/schema";
import { eq, sql } from "@cmt/db";
import { protectedProcedure } from "../trpc";
import { addMonths } from "date-fns";
import { z } from "zod";
import { schema } from "@cmt/db/client";
import { generateChitId } from "@cmt/db/utils";
import { paginateInputSchema } from "../utils/paginate";
import { getSubscribersByBatchId } from "../utils/actions";

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
  getAll: protectedProcedure.query(async ({ ctx }) => {
    const batchesList = ctx.db.query.batches.findMany({
      where: eq(schema.batches.collectorId, ctx.session.userId),
    });
    return batchesList ?? [];
  }),

  /**
   * Get details of a batch
   * @context collector | subscriber
   */
  getById: protectedProcedure
    .input(z.object({ batchId: z.string() }))
    .query(({ ctx, input }) =>
      ctx.db.query.batches.findFirst({
        where: eq(schema.batches.id, input.batchId),
        with: { collector: true },
      })
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
