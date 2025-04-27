import { schema } from "@cmt/db/client";
import { eq } from "@cmt/db";
import { protectedProcedure } from "../trpc";
import { addMonths } from "date-fns";

export const batchesRouter = {
  create: protectedProcedure
    .input(schema.batchInsertSchema)
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
  getAll: protectedProcedure.query(async ({ ctx }) => {
    const batchesList = ctx.db.query.batches.findMany({
      where: eq(schema.batches.collectorId, ctx.session.userId),
    });
    return batchesList ?? [];
  }),
};
