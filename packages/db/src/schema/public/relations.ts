import { relations } from "drizzle-orm";
import { batches, subscribersToBatches } from ".";
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
  ({ one }) => ({
    batch: one(batches, {
      fields: [subscribersToBatches.batchId],
      references: [batches.id],
    }),
    subscriber: one(subscribers, {
      fields: [subscribersToBatches.subscriberId],
      references: [subscribers.id],
    }),
  })
);
