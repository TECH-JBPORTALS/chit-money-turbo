import { eq } from "@cmt/db";
import { protectedProcedure } from "../trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { schema } from "@cmt/db/client";
import { addMonths, format } from "date-fns";
import { paginateInputSchema } from "../utils/paginate";
import { getSubscribersByBatchId } from "../utils/actions";

export const paymentsRouter = {
  /** Get runway for specific brach based batch schema and starts on date
   * @context collector
   */
  getRunway: protectedProcedure
    .input(z.object({ batchId: z.string() }))
    .query(async ({ ctx, input }) => {
      const batch = await ctx.db.query.batches.findFirst({
        where: eq(schema.batches.id, input.batchId),
      });

      if (!batch)
        throw new TRPCError({ message: "Batch Not Found", code: "NOT_FOUND" });

      const scheme = batch.scheme;
      const startsOn = new Date(batch.startsOn);

      const months = Array.from({ length: scheme }, (_, index) => {
        const date = addMonths(startsOn, index);
        return {
          value: format(date, "yyyy-MM-dd"),
          label: format(date, "MMM yyyy"),
        };
      });

      return { batch, months };
    }),

  /** Get list subscribers for runway with the status of payment paid or not paid
   * @context collector
   */
  ofBatchSelectedRunway: protectedProcedure
    .input(
      paginateInputSchema.and(
        z.object({
          batchId: z.string(),
          query: z.string().optional(),
          runway: z.string(),
        })
      )
    )
    .query(async ({ ctx, input }) => {
      const subs = await getSubscribersByBatchId({ ctx, input });

      return subs;
    }),
};
