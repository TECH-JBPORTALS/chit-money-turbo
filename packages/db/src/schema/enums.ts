import { pgEnum } from "drizzle-orm/pg-core";

export const batchStatusEnum = pgEnum("batch_status_enum", [
  "active",
  "completed",
]);

export const batchTypeEnum = pgEnum("batch_type_enum", ["interest", "auction"]);

export const accountTypeEnum = pgEnum("account_type_enum", [
  "savings",
  "current",
]);

export const paymentModeEnum = pgEnum("payment_mode_enum", [
  "cash",
  "upi/bank",
  "cheque",
]);

export const payoutStatusEnum = pgEnum("payout_status_enum", [
  "requested",
  "rejected",
  "disbursed",
  "cancelled",
  "approved",
]);
