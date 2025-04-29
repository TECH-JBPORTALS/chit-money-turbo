import { ulid } from "ulid";
import { pgTable, uniqueIndex } from "drizzle-orm/pg-core";
import { collectors } from "../collectors";
import { subscribers } from "../subscribers";
import { batchStatusEnum, batchTypeEnum } from "../enums";

/************************************* Batches ***************************************/

export const batches = pgTable("batches", (t) => ({
  id: t
    .text()
    .$defaultFn(() => `batch_${ulid()}`)
    .primaryKey(),
  collectorId: t.text().references(() => collectors.id, {
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
  createdAt: t.timestamp().defaultNow().notNull(),
}));

/************************************* Subscribers-To-Batches ***************************************/

export const subscribersToBatches = pgTable(
  "subscribers_to_batches",
  (t) => ({
    batchId: t
      .text()
      .references(() => batches.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      })
      .notNull(),
    subscriberId: t
      .text()
      .references(() => subscribers.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      })
      .notNull(),

    /** Should be a unique ID within the single batch */
    chitId: t.text().notNull(),

    commissionRate: t.numeric().notNull(),

    /** Determines weather subscriber's chit is freezed within the batch */
    isFreezed: t.boolean().default(false),
    freezedAt: t.timestamp(),

    updatedAt: t.timestamp().$onUpdate(() => new Date()),
    createdAt: t.timestamp().defaultNow().notNull(),
  }),
  (self) => [uniqueIndex("chitId_unique_batch").on(self.chitId, self.batchId)]
);
