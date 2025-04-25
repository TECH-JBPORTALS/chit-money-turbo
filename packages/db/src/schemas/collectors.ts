import { pgTable } from "drizzle-orm/pg-core";
import { addresses } from "./addresses";
import { relations } from "drizzle-orm";
import { bankAccounts } from "./bank-accounts";
import { contacts } from "./contacts";
import { createInsertSchema, createUpdateSchema } from "drizzle-zod";
import { z } from "zod";

export const collectors = pgTable("collectors", (t) => ({
  /** Clerk userId will be used as collector ID */
  id: t.text().primaryKey(),
  dateOfBirth: t.date().notNull(),

  /** Chit Fund House Name */
  orgName: t.text().notNull(),
  orgAddressId: t.text().references(() => addresses.id, {
    onDelete: "set null",
    onUpdate: "cascade",
  }),

  /** Neccessary documents file keys - Uploadthing return file keys */
  orgCertificateKey: t.text().notNull(),
  aadharFrontFileKey: t.text().notNull(),
  aadharBackFileKey: t.text().notNull(),

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

export const collectorInsertSchema = createInsertSchema(collectors, {
  orgName: z.string().min(1, "Required"),
  orgCertificateKey: z.string().min(1, "Required"),
  aadharBackFileKey: z.string().min(1, "Required"),
  aadharFrontFileKey: z.string().min(1, "Required"),
  dateOfBirth: z.string().min(1, "Required"),
})
  .required()
  .omit({
    createdAt: true,
    updatedAt: true,
    orgAddressId: true,
    contactId: true,
    bankAccountId: true,
  });

export const collectorUpdateSchema = createUpdateSchema(collectors).omit({
  createdAt: true,
  updatedAt: true,
});

export const collectorRelations = relations(collectors, ({ one }) => ({
  orgAddress: one(addresses, {
    fields: [collectors.orgAddressId],
    references: [addresses.id],
  }),
  bankAccount: one(bankAccounts, {
    fields: [collectors.bankAccountId],
    references: [bankAccounts.id],
  }),
  contacts: one(contacts, {
    fields: [collectors.contactId],
    references: [contacts.id],
  }),
}));
