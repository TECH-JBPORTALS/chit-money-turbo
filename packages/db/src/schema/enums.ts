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
