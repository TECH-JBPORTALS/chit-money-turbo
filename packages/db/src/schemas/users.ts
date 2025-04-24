import { relations } from "drizzle-orm";
import { pgEnum, pgTable } from "drizzle-orm/pg-core";
import { bankAccounts } from "./bank-accounts";
import { contacts } from "./contacts";

export const roleEnum = pgEnum("roleEnum", ["collector", "subscriber"]);

export const users = pgTable("users", (t) => ({
  /**
   * Clerk userId will be used as user ID
   */
  id: t.text().primaryKey(),
  role: roleEnum("role").notNull(),
  date_of_birth: t.date(),
  updatedAt: t.timestamp().$onUpdate(() => new Date()),
  createdAt: t.timestamp().defaultNow(),
}));

export const userRelations = relations(users, ({ many }) => ({
  bankAccounts: many(bankAccounts),
  contacts: many(contacts),
}));
