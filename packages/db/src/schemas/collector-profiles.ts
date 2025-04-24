import { pgTable, primaryKey } from "drizzle-orm/pg-core";
import { ulid } from "ulid";
import { addresses } from "./addresses";
import { relations } from "drizzle-orm";
import { users } from "./users";
import { bankAccounts } from "./bank-accounts";
import { contacts } from "./contacts";

export const collectorProfiles = pgTable(
  "collector_profiles",
  (t) => ({
    /**
     * Clerk userId will be used as collector ID
     */
    id: t
      .text()
      .$defaultFn(() => `col_${ulid()}`)
      .notNull(),
    orgName: t.text().notNull(),
    userId: t
      .text()
      .unique()
      .references(() => users.id, { onDelete: "cascade", onUpdate: "cascade" })
      .notNull(), //To make this easy work with authentication level from foreign table
    orgAddress: t.text().references(() => addresses.id, {
      onUpdate: "cascade",
      onDelete: "set null",
    }),
    addressId: t.text().references(() => addresses.id, {
      onDelete: "set null",
      onUpdate: "cascade",
    }),
    contactId: t.text().references(() => contacts.id, {
      onDelete: "set null",
      onUpdate: "cascade",
    }),
    bankAccountId: t.text().references(() => bankAccounts.id, {
      onDelete: "set null",
      onUpdate: "cascade",
    }),
    updatedAt: t.timestamp().$onUpdate(() => new Date()),
    createdAt: t.timestamp().defaultNow(),
  }),
  (self) => [
    primaryKey({
      name: "collector_primary_keys",
      columns: [self.id, self.userId],
    }),
  ]
);

export const collectorProfileRelations = relations(
  collectorProfiles,
  ({ one }) => ({
    address: one(addresses, {
      fields: [collectorProfiles.addressId],
      references: [addresses.id],
    }),
    bankAccount: one(bankAccounts, {
      fields: [collectorProfiles.bankAccountId],
      references: [bankAccounts.id],
    }),
    contacts: one(contacts, {
      fields: [collectorProfiles.contactId],
      references: [contacts.id],
    }),
    user: one(users, {
      fields: [collectorProfiles.userId],
      references: [users.id],
    }),
  })
);
