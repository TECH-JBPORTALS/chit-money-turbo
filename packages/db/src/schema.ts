import { ulid } from "ulid";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { pgEnum, pgTable, unique } from "drizzle-orm/pg-core";
import * as colSchema from "./col.schema";
import * as subSchema from "./sub.schema";

/************************************* Exports ***************************************/

export const collectorsSchema = colSchema;
export const subscribersSchema = subSchema;

/************************************* Batches ***************************************/

export const batchTypeEnum = pgEnum("batch_type_enum", ["interest", "auction"]);
export const batchStatusEnum = pgEnum("batch_status_enum", [
  "active",
  "completed",
]);

export const batches = pgTable("batches", (t) => ({
  id: t
    .text()
    .$defaultFn(() => `batch_${ulid()}`)
    .primaryKey(),
  collectorId: t.text().references(() => colSchema.users.id, {
    onDelete: "cascade",
    onUpdate: "cascade",
  }),
  name: t.text().notNull(),
  batchType: batchTypeEnum("batch_type").default("interest").notNull(),
  dueOn: t.numeric().notNull(),
  startsOn: t.date().notNull(),
  endsOn: t.date().notNull(),
  scheme: t.integer().notNull(),
  fundAmount: t.numeric().notNull(),
  defaultCommissionRate: t.numeric().notNull(),
  batchStatus: batchStatusEnum("batch_status").default("active").notNull(),
  updatedAt: t.timestamp().$onUpdate(() => new Date()),
  createdAt: t.timestamp().defaultNow(),
}));

// Relations
export const batchRelations = relations(batches, ({ one }) => ({
  collector: one(colSchema.users, {
    fields: [batches.collectorId],
    references: [colSchema.users.id],
  }),
}));

// Validation Schemas
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

/************************************* Subscribers-To-Batches ***************************************/

export const subscribersToBatches = pgTable(
  "subscribers_to_batches",
  (t) => ({
    id: t
      .text()
      .$defaultFn(() => `batch_${ulid()}`)
      .primaryKey(),
    batchId: t
      .text()
      .references(() => batches.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      })
      .notNull(),
    subscriberId: t
      .text()
      .references(() => subSchema.users.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      })
      .notNull(),

    /** Should be a unique ID within the single batch */
    chitId: t.text().notNull(),

    /** Determines weather subscriber's chit is freezed within the batch */
    isFreezed: t.boolean().default(false),
    freezedAt: t.timestamp(),

    updatedAt: t.timestamp().$onUpdate(() => new Date()),
    createdAt: t.timestamp().defaultNow(),
  }),
  (self) => [
    unique("chitId_unique_batch")
      .on(self.chitId, self.batchId)
      .nullsNotDistinct(),
  ]
);

// Relations
export const subscribersToBatchRelations = relations(
  subscribersToBatches,
  ({ one }) => ({
    batch: one(batches, {
      fields: [subscribersToBatches.batchId],
      references: [batches.id],
    }),
    subscriber: one(colSchema.users, {
      fields: [subscribersToBatches.subscriberId],
      references: [subSchema.users.id],
    }),
  })
);

// Validation Schemas
export const subscribersToBatchInsertSchema = createInsertSchema(
  subscribersToBatches
).omit({
  id: true,
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
