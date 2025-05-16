import { z } from "zod";
import { protectedProcedure } from "../trpc";
import { getSubscriberBatchesWithPagination } from "../utils/actions";
import { eq } from "@cmt/db";
import { schema } from "@cmt/db/client";

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
};
