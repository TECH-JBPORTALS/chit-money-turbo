import { pgEnum, pgTable } from "drizzle-orm/pg-core";
import { ulid } from "ulid";
import { relations } from "drizzle-orm";
import { collectorProfiles } from "./collector-profiles";
import { subscriberProfiles } from "./subscriber-profiles";

export const accountTypeEnum = pgEnum("account_type_enum", [
  "savings",
  "current",
]);

export const bankAccounts = pgTable("bank_accounts", (t) => ({
  id: t
    .text()
    .$defaultFn(() => `acc_${ulid()}`)
    .primaryKey(),
  accountNumber: t.text().notNull(),
  accountHolderName: t.text().notNull(),
  accountType: accountTypeEnum("account_type").default("savings").notNull(),
  upiId: t.text().notNull(),
  branchName: t.text().notNull(),
  ifscCode: t.text().notNull(),
  updatedAt: t.timestamp().$onUpdate(() => new Date()),
  createdAt: t.timestamp().defaultNow(),
}));

export const bankAccountRelations = relations(bankAccounts, ({ many }) => ({
  collectorProfiles: many(collectorProfiles),
  subscriberProfiles: many(subscriberProfiles),
}));
