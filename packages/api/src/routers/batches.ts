import { batches, batchInsertSchema } from "@cmt/db/schema";
import { eq } from "@cmt/db";
import { protectedProcedure } from "../trpc";
import { addMonths } from "date-fns";

export const batchesRouter = {
  create: protectedProcedure
    .input(batchInsertSchema)
    .mutation(({ ctx, input }) =>
      ctx.db
        .insert(batches)
        .values({
          ...input,
          collectorId: ctx.session.userId,
          endsOn: addMonths(input.startsOn, input.scheme).toDateString(),
        })
        .returning()
    ),
  getAll: protectedProcedure.query(async ({ ctx }) => {
    const batchesList = ctx.db.query.batches.findMany({
      where: eq(batches.collectorId, ctx.session.userId),
    });
    return batchesList ?? [];
  }),
};
