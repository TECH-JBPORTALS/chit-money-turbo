import { batchInsertSchema } from "@cmt/db/schema";
import { and, count, eq, ilike, inArray, or, sql } from "@cmt/db";
import { protectedProcedure } from "../trpc";
import { addMonths } from "date-fns";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { schema } from "@cmt/db/client";
import { generateChitId } from "@cmt/db/utils";
import { getPagination, paginateInputSchema } from "../utils/paginate";
import { getQueryUserIds } from "../utils/clerk";

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

  // Get subscribers within the batch
  getSubscribersOfBatch: protectedProcedure
    .input(
      paginateInputSchema.and(
        z.object({
          batchId: z.string(),
          query: z.string().optional(),
        })
      )
    )
    .query(async ({ ctx, input }) => {
      const { pageIndex, pageSize, query } = input;
      const { offset } = getPagination(pageIndex, pageSize);

      const batch = await ctx.db.query.batches.findFirst({
        where: eq(schema.batches.id, input.batchId),
      });

      if (!batch)
        throw new TRPCError({ message: "Batch not found", code: "NOT_FOUND" });

      const userIds = await getQueryUserIds(ctx.clerk, query);

      const [subs, total] = await Promise.all([
        ctx.db.query.subscribersToBatches.findMany({
          where: and(
            eq(schema.subscribersToBatches.batchId, input.batchId),
            query
              ? or(
                  inArray(
                    schema.subscribersToBatches.subscriberId,
                    userIds ?? []
                  ),
                  ilike(schema.subscribersToBatches.chitId, query)
                )
              : undefined
          ),
          with: {
            subscriber: true,
          },
          limit: pageSize,
          offset: !query ? offset : undefined,
          orderBy: (t, { desc }) => [desc(t.createdAt)],
        }),
        ctx.db
          .select({ count: count() })
          .from(schema.subscribersToBatches)
          .where(eq(schema.subscribersToBatches.batchId, input.batchId))
          .then((v) => v.at(0)?.count ?? 0),
      ]);

      const items = await Promise.all(
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

      return { items, total, pageSize, pageIndex };
    }),
};
