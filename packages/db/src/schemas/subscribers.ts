import { pgTable } from "drizzle-orm/pg-core";
import { addresses } from "./addresses";
import { relations } from "drizzle-orm";
import { bankAccounts } from "./bank-accounts";
import { contacts } from "./contacts";

export const subscribers = pgTable("subscribers", (t) => ({
  /** Clerk userId will be used as collector ID */
  id: t.text().primaryKey(),

  /** Subcriber him/her - self will have unique FACE ID on the application,
   So that later collectors can refer this to add the subscriber to the batches */
  faceId: t.text().unique().notNull(),
  dateOfBirth: t.date().notNull(),
  panCardNumber: t.text().unique().notNull(),

  nomineeName: t.text().notNull(),
  nomineeRelationship: t.text().notNull(),

  /** Neccessary documents file keys - Uploadthing return file keys */
  aadharFrontFileKey: t.text().notNull(),
  aadharBackFileKey: t.text().notNull(),

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
}));

export const subscriberProfileRelations = relations(subscribers, ({ one }) => ({
  homeAddress: one(addresses, {
    fields: [subscribers.homeAddressId],
    references: [addresses.id],
  }),
  bankAccount: one(bankAccounts, {
    fields: [subscribers.bankAccountId],
    references: [bankAccounts.id],
  }),
  contacts: one(contacts, {
    fields: [subscribers.contactId],
    references: [contacts.id],
  }),
}));
