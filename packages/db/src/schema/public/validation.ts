import { createInsertSchema, createUpdateSchema } from "drizzle-zod";
import { batches, payments, subscribersToBatches } from ".";
import { z } from "zod";

export const batchInsertSchema = createInsertSchema(batches).omit({
  id: true,
  collectorId: true,
  endsOn: true, //Calculate when inserting using startsOn field
  createdAt: true,
  updatedAt: true,
  batchStatus: true,
});

export const batchUpdateSchema = createInsertSchema(batches)
  .omit({
    id: true,
    collectorId: true,
    endsOn: true, //Calculate when inserting using startsOn field
    createdAt: true,
    updatedAt: true,
  })
  .and(
    z.object({ batchId: z.string().min(1, "batchId is required for updation") })
  );

export const subscribersToBatchInsertSchema = createInsertSchema(
  subscribersToBatches
).omit({
  updatedAt: true,
  createdAt: true,
});

export const subscribersToBatchUpdateSchema = createInsertSchema(
  subscribersToBatches
)
  .omit({
    id: true,
    chitId: true,
    createdAt: true,
    updatedAt: true,
  })
  .and(
    z.object({
      /** Single unique id of junction table 'subscribersToBatches' */
      subscriberToBatchId: z
        .string()
        .min(1, "subscriberToBatchId is required for updation"),
    })
  );

export const paymentInsertSchema = createInsertSchema(payments, {
  penalty: z.number({ invalid_type_error: "Invalid penalty" }),
  subscriptionAmount: z.number({
    invalid_type_error: "Invalid subscription amount",
  }),
  paidOn: z.string().min(1, "Payment date is required"),
  transactionId: z.string().optional(),
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const paymentUpdateSchema = createUpdateSchema(payments, {
  penalty: z.number({ invalid_type_error: "Invalid penalty" }),
  subscriptionAmount: z.number({
    invalid_type_error: "Invalid subscription amount",
  }),
  paidOn: z.string().min(1, "Payment date is required"),
  transactionId: z.string().optional(),
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
