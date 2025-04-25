import { pgEnum, pgTable } from "drizzle-orm/pg-core";
import { ulid } from "ulid";
import { relations } from "drizzle-orm";
import { collectors } from "./collectors";
import { subscribers } from "./subscribers";
import { createInsertSchema, createUpdateSchema } from "drizzle-zod";
import { z } from "zod";

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
  city: t.text().notNull(),
  state: t.text().notNull(),
  pincode: t.numeric().notNull(),
  updatedAt: t.timestamp().$onUpdate(() => new Date()),
  createdAt: t.timestamp().defaultNow(),
}));

export const bankAccountInsertSchema = createInsertSchema(bankAccounts, {
  accountHolderName: z.string().min(1, "Required"),
  accountNumber: z.string().min(4, "Enter valid account number"),
  upiId: z.string().min(1, "Required"),
  branchName: z.string().min(1, "Required"),
  ifscCode: z.string().min(1, "Required"),
  pincode: z.string().min(1, "Required"),
  city: z.string().min(1, "Required"),
  state: z.string().min(1, "Required"),
  accountType: z.enum(["savings", "current"]),
}).omit({
  id: true,
  updatedAt: true,
  createdAt: true,
});

export const bankAccountUpdateSchema = createUpdateSchema(bankAccounts).omit({
  id: true,
  updatedAt: true,
  createdAt: true,
});

export const bankAccountRelations = relations(bankAccounts, ({ many }) => ({
  collectors: many(collectors),
  subscribers: many(subscribers),
}));
