import { relations } from "drizzle-orm";
import { batches, payments, payouts, subscribersToBatches } from ".";
import { collectors } from "../collectors";
import { subscribers } from "../subscribers";

export const batcheRelations = relations(batches, ({ one, many }) => ({
  collector: one(collectors, {
    fields: [batches.collectorId],
    references: [collectors.id],
  }),
  subscribersToBatches: many(subscribersToBatches),
}));

export const subscribersToBatchesRelations = relations(
  subscribersToBatches,
  ({ one, many }) => ({
    batch: one(batches, {
      fields: [subscribersToBatches.batchId],
      references: [batches.id],
    }),
    subscriber: one(subscribers, {
      fields: [subscribersToBatches.subscriberId],
      references: [subscribers.id],
    }),
    payments: many(payments),
    payouts: many(payouts),
  })
);

export const paymentsRelations = relations(payments, ({ one }) => ({
  subscribersToBatches: one(subscribersToBatches, {
    fields: [payments.subscriberToBatchId],
    references: [subscribersToBatches.id],
  }),
}));

export const payoutsRelations = relations(payouts, ({ one }) => ({
  subscribersToBatches: one(subscribersToBatches, {
    fields: [payouts.subscriberToBatchId],
    references: [subscribersToBatches.id],
  }),
}));
