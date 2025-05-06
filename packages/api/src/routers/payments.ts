import { and, eq, sql } from "@cmt/db";
import { protectedProcedure } from "../trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { schema } from "@cmt/db/client";
import { addMonths, format } from "date-fns";
import { paginateInputSchema } from "../utils/paginate";
import { getSubscribersByBatchId } from "../utils/actions";
import { generateChitId } from "@cmt/db/utils";
import { paymentInsertSchema, paymentUpdateSchema } from "@cmt/db/schema";

export const paymentsRouter = {
  /** Create payment for subscribersToBatchId
   * @context collector
   */
  create: protectedProcedure
    .input(
      paymentInsertSchema.omit({ totalAmount: true, creditScoreAffected: true })
    )
    .mutation(({ ctx, input }) =>
      ctx.db
        .insert(schema.payments)
        .values({
          ...input,
          totalAmount: input.subscriptionAmount + input.penalty,
          creditScoreAffected: input.paidOn > input.runwayDate ? -10 : 10,
        })
        .returning()
        .then((v) => v.at(0))
    ),

  /** Delete payment for paymentId
   * @context collector
   */
  delete: protectedProcedure
    .input(z.object({ paymentId: z.string().min(1) }))
    .mutation(({ ctx, input }) =>
      ctx.db
        .delete(schema.payments)
        .where(eq(schema.payments.id, input.paymentId))
    ),

  /** Update payment for paymentId
   * @context collector
   */
  update: protectedProcedure
    .input(paymentUpdateSchema.and(z.object({ paymentId: z.string().min(1) })))
    .mutation(({ ctx, input }) =>
      ctx.db
        .update(schema.payments)
        .set(input)
        .where(eq(schema.payments.id, input.paymentId))
        .returning()
        .then((v) => v.at(0))
    ),

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
          runwayDate: z.string(),
        })
      )
    )
    .query(async ({ ctx, input }) => {
      const subs = await getSubscribersByBatchId({ ctx, input });
      const runwayDate = new Date(input.runwayDate);
      const { batch } = await generateChitId(input.batchId);
      const subscriptionAmount = Math.ceil(
        parseInt(batch.fundAmount) / batch.scheme
      );

      const mappedItems = await Promise.all(
        subs.items.flatMap(async (sub) => {
          let status: "paid" | "not paid" = "not paid";

          const inputMonth = runwayDate.getMonth() + 1; // JavaScript months are 0-indexed
          const inputYear = runwayDate.getFullYear();

          // Check if: subscriber paid for given runway date
          const payment = await ctx.db.query.payments.findFirst({
            where: and(
              eq(schema.payments.subscriberToBatchId, sub.id),
              sql`EXTRACT(MONTH FROM ${schema.payments.runwayDate}) = ${inputMonth}`,
              sql`EXTRACT(YEAR FROM ${schema.payments.runwayDate}) = ${inputYear}`
            ),
          });

          if (payment) status = "paid";

          return {
            ...sub,
            payment: {
              ...payment,
              subscriptionAmount:
                payment?.subscriptionAmount ?? subscriptionAmount,
              status,
              runwayDate: payment?.runwayDate ?? input.runwayDate,
            },
          };
        })
      );

      return { ...subs, items: mappedItems };
    }),
  /** Get payment details by paymentID
   * @context collector
   */
  getById: protectedProcedure
    .input(z.object({ paymentId: z.string().min(1) }))
    .query(async ({ ctx, input }) => {
      const payment = await ctx.db.query.payments.findFirst({
        where: eq(schema.payments.id, input.paymentId),
        with: {
          subscribersToBatches: {
            with: {
              subscriber: true,
            },
          },
        },
      });

      if (!payment)
        throw new TRPCError({
          message: "Payment Not Found",
          code: "NOT_FOUND",
        });

      const subscriber = await ctx.clerk.users.getUser(
        payment.subscribersToBatches.subscriberId
      );

      return {
        ...payment,
        subscribersToBatches: {
          ...payment.subscribersToBatches,
          subscriber: {
            ...payment.subscribersToBatches.subscriber,
            imageUrl: subscriber.imageUrl,
            firstName: subscriber.firstName,
            lastName: subscriber.lastName,
          },
        },
      };
    }),
};
