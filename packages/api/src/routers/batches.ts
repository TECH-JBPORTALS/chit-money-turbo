import { batchInsertSchema } from "@cmt/db/schema";
import { eq } from "@cmt/db";
import { protectedProcedure } from "../trpc";
import { addMonths } from "date-fns";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { schema } from "@cmt/db/client";

export const batchesRouter = {
  // Create new batch
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

  // Get all batches of collector
  getAll: protectedProcedure.query(async ({ ctx }) => {
    const batchesList = ctx.db.query.batches.findMany({
      where: eq(schema.batches.collectorId, ctx.session.userId),
    });
    return batchesList ?? [];
  }),

  // Get subscribers within the batch
  getSubscribersOfBatch: protectedProcedure
    .input(z.object({ batchId: z.string() }))
    .query(async ({ ctx, input }) => {
      const batch = await ctx.db.query.batches.findFirst({
        where: eq(schema.batches.id, input.batchId),
      });

      if (!batch)
        throw new TRPCError({ message: "Batch not found", code: "NOT_FOUND" });

      const subs = await ctx.db.query.subscribersToBatches.findMany({
        where: eq(schema.subscribersToBatches.batchId, input.batchId),
        with: {
          subscriber: true,
          batch: true,
        },
      });

      const mappedSubs = await Promise.all(
        subs.map(async (sub) => {
          const user = await ctx.clerk.users.getUser(sub.subscriberId);

          return {
            ...sub,
            subscriber: {
              ...sub.subscriber,
              firstName: user.firstName,
              lastName: user.lastName,
              imageUrl: user.imageUrl,
              primaryEmailAddress: user.primaryEmailAddress?.emailAddress,
            },
          };
        })
      );

      return mappedSubs;
    }),
};
