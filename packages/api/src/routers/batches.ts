import { batches, batchInsertSchema } from "@cmt/db/schemas";
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
          collectorProfileUserId: ctx.auth.userId,
          endsOn: addMonths(input.startsOn, input.scheme).toDateString(),
        })
        .returning()
    ),
  getAll: protectedProcedure.query(({ ctx }) =>
    ctx.db.query.batches.findMany({
      where: eq(batches.collectorProfileUserId, ctx.auth.userId),
    })
  ),
};
