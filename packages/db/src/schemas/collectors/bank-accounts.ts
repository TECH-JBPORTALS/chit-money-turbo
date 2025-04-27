import { ulid } from "ulid";
import { collectorsSchema } from "./_schema";
import { users } from "./users";
import { relations } from "drizzle-orm";
import { createInsertSchema, createUpdateSchema } from "drizzle-zod";

export const accountTypeEnum = collectorsSchema.enum("account_type_enum", [
  "savings",
  "current",
]);

export const bankAccounts = collectorsSchema.table("bank_accounts", (t) => ({
  id: t
    .text()
    .$defaultFn(() => `acc_${ulid()}`)
    .primaryKey(),
  userId: t
    .text()
    .notNull()
    .references(() => users.id, { onDelete: "cascade", onUpdate: "cascade" }),
  accountNumber: t.text().notNull(),
  accountHolderName: t.text().notNull(),
  accountType: accountTypeEnum("account_type").default("savings").notNull(),
  upiId: t.text().notNull(),
  branchName: t.text().notNull(),
  ifscCode: t.text().notNull(),
  city: t.text().notNull(),
  state: t.text().notNull(),
  pincode: t.numeric().notNull(),
  updatedAt: t.timestamp().$onUpdate(() => new Date()),
  createdAt: t.timestamp().defaultNow(),
}));

// Realtions
export const bankAccountRelations = relations(bankAccounts, ({ one }) => ({
  user: one(users, {
    fields: [bankAccounts.userId],
    references: [users.id],
  }),
}));

// Validation Schemas
export const bankAccountInsertSchema = createInsertSchema(bankAccounts).omit({
  userId: true,
});
export const bankAccountUpdateSchema = createUpdateSchema(bankAccounts);
