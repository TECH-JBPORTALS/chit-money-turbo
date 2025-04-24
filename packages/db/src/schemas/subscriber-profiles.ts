import { pgTable, primaryKey } from "drizzle-orm/pg-core";
import { ulid } from "ulid";
import { addresses } from "./addresses";
import { relations } from "drizzle-orm";
import { users } from "./users";
import { bankAccounts } from "./bank-accounts";
import { contacts } from "./contacts";

export const subscriberProfiles = pgTable(
  "subscriber_profiles",
  (t) => ({
    /**
     * Clerk userId will be used as collector ID
     */
    id: t
      .text()
      .$defaultFn(() => `sub_${ulid()}`)
      .notNull(),
    userId: t
      .text()
      .references(() => users.id, { onDelete: "cascade", onUpdate: "cascade" })
      .notNull(),
    nomineeName: t.text().notNull(),
    nomineeRelationship: t.text().notNull(),
    homeAddressId: t.text().references(() => addresses.id, {
      onUpdate: "cascade",
      onDelete: "set null",
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
      name: "subscriber_primary_keys",
      columns: [self.id, self.userId],
    }),
  ]
);

export const subscriberProfileRelations = relations(
  subscriberProfiles,
  ({ one }) => ({
    homeAddress: one(addresses, {
      fields: [subscriberProfiles.homeAddressId],
      references: [addresses.id],
    }),
    bankAccount: one(bankAccounts, {
      fields: [subscriberProfiles.bankAccountId],
      references: [bankAccounts.id],
    }),
    contacts: one(contacts, {
      fields: [subscriberProfiles.contactId],
      references: [contacts.id],
    }),
    user: one(users, {
      fields: [subscriberProfiles.userId],
      references: [users.id],
    }),
  })
);
