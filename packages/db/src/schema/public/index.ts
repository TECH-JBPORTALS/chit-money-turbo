import { ulid } from "ulid";
import { index, pgTable, uniqueIndex } from "drizzle-orm/pg-core";
import { collectors } from "../collectors";
import { subscribers } from "../subscribers";
import {
  batchStatusEnum,
  batchTypeEnum,
  paymentModeEnum,
  payoutStatusEnum,
} from "../enums";

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
  defaultCommissionRate: t
    .numeric({ precision: 3, scale: 1, mode: "number" })
    .notNull(),
  batchStatus: batchStatusEnum("batch_status").default("active").notNull(),
  updatedAt: t.timestamp().$onUpdate(() => new Date()),
  createdAt: t.timestamp().defaultNow().notNull(),
}));

/************************************* Subscribers-To-Batches ***************************************/

export const subscribersToBatches = pgTable(
  "subscribers_to_batches",
  (t) => ({
    id: t
      .text()
      .$defaultFn(() => `sb_${ulid()}`)
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
      .references(() => subscribers.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      })
      .notNull(),

    /** Should be a unique ID within the single batch */
    chitId: t
      .text()
      .$default(() => {
        const id = ulid();
        return `CHIT${id.substring(id.length - 6, id.length)}`;
      })
      .notNull(),

    commissionRate: t
      .numeric({ precision: 3, scale: 1, mode: "number" })
      .notNull(),

    /** Determines weather subscriber's chit is freezed within the batch */
    isFreezed: t.boolean().default(false),
    freezedAt: t.timestamp(),

    updatedAt: t.timestamp().$onUpdate(() => new Date()),
    createdAt: t.timestamp().defaultNow().notNull(),
  }),
  (self) => [uniqueIndex("chitId_unique_batch").on(self.chitId, self.batchId)]
);

/************************************* Payments ***************************************/

export const payments = pgTable(
  "payments",
  (t) => ({
    id: t
      .text()
      .$defaultFn(() => `pamnt_${ulid()}`)
      .primaryKey(),
    subscriberToBatchId: t
      .text()
      .references(() => subscribersToBatches.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      })
      .notNull(),
    penalty: t.numeric({ precision: 3, mode: "number" }).default(0).notNull(),
    subscriptionAmount: t.numeric({ precision: 3, mode: "number" }).notNull(),
    totalAmount: t.numeric({ precision: 3, mode: "number" }).notNull(),
    paymentMode: paymentModeEnum("payment_mode").default("cash").notNull(),
    transactionId: t.text(),
    creditScoreAffected: t.integer().notNull(),
    /** Special paid on to explicitly define the paid date */
    paidOn: t.date().defaultNow().notNull(),
    updatedAt: t.timestamp().$onUpdate(() => new Date()),
    createdAt: t.timestamp().defaultNow().notNull(),
  }),
  (self) => [index().on(self.subscriberToBatchId)]
);

export const payouts = pgTable(
  "payouts",
  (t) => ({
    id: t
      .text()
      .$defaultFn(() => `paout_${ulid()}`)
      .primaryKey(),
    subscriberToBatchId: t
      .text()
      .references(() => subscribersToBatches.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      })
      .notNull(),

    month: t.date().notNull(),
    deductions: t
      .numeric({ precision: 3, mode: "number" })
      .default(0)
      .notNull(),
    amount: t.numeric({ precision: 3, mode: "number" }).notNull(),
    totalAmount: t.numeric({ precision: 3, mode: "number" }).notNull(),
    payoutStatus: payoutStatusEnum("payout_status")
      .default("requested")
      .notNull(),
    paymentMode: paymentModeEnum("payment_mode").default("cash").notNull(),
    transactionId: t.text(),

    /** Special paid on to explicitly define the paid date */
    requestedAt: t.timestamp(),
    acceptedAt: t.timestamp(),
    cancelledAt: t.timestamp(),
    rejectionReason: t.text(),
    disbursedAt: t.timestamp(),
    rejectedAt: t.timestamp(),
    updatedAt: t.timestamp().$onUpdate(() => new Date()),
    createdAt: t.timestamp().defaultNow().notNull(),
  }),
  (self) => [index().on(self.subscriberToBatchId)]
);
