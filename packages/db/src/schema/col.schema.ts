import { PgSchema } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema, createUpdateSchema } from "drizzle-zod";
import { z } from "zod";
import { ulid } from "ulid";
import { batches } from ".";

/************************************* Schema ***************************************/

export const collectorsSchema = new PgSchema("collectors");

/************************************* Users ****************************************/

export const users = collectorsSchema.table("users", (t) => ({
  /** Clerk userId will be used as collector ID */
  id: t.text().primaryKey(),
  dateOfBirth: t.date().notNull(),

  /** Chit Fund House Name */
  orgName: t.text().notNull(),

  /** Neccessary documents file keys - Uploadthing return file keys */
  orgCertificateKey: t.text().notNull(),
  aadharFrontFileKey: t.text().notNull(),
  aadharBackFileKey: t.text().notNull(),

  updatedAt: t.timestamp().$onUpdate(() => new Date()),
  createdAt: t.timestamp().defaultNow(),
}));

// Relations
export const collectorRelations = relations(users, ({ one, many }) => ({
  orgAddress: one(addresses),
  bankAccount: one(bankAccounts),
  contact: one(contacts),
  batches: many(batches),
}));

// Validation Schemas
export const collectorInsertSchema = createInsertSchema(users, {
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
  });

export const collectorUpdateSchema = createUpdateSchema(users).omit({
  createdAt: true,
  updatedAt: true,
});

/************************************* Contacts ****************************************/

export const contacts = collectorsSchema.table("contacts", (t) => ({
  id: t
    .text()
    .$defaultFn(() => `con_${ulid()}`)
    .primaryKey(),
  userId: t
    .text()
    .notNull()
    .references(() => users.id, { onDelete: "cascade", onUpdate: "cascade" }),
  primaryPhoneNumber: t.numeric().notNull(),
  secondaryPhoneNumber: t.numeric(),
  updatedAt: t.timestamp().$onUpdate(() => new Date()),
  createdAt: t.timestamp().defaultNow(),
}));

// Realtions
export const contactRelations = relations(contacts, ({ one }) => ({
  user: one(users, {
    fields: [contacts.userId],
    references: [users.id],
  }),
}));

// Validation Schemas
export const contactInsertSchema = createInsertSchema(contacts, {
  secondaryPhoneNumber: z.string().optional(),
}).omit({
  userId: true,
});
export const contactUpdateSchema = createUpdateSchema(contacts);

/************************************* Bank Accounts ****************************************/

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
export const bankAccountInsertSchema = createInsertSchema(bankAccounts, {
  accountType: z.enum(["savings", "current"]).default("savings"),
}).omit({
  userId: true,
});
export const bankAccountUpdateSchema = createUpdateSchema(bankAccounts);

/************************************* Addresses ****************************************/

export const addresses = collectorsSchema.table("addresses", (t) => ({
  id: t
    .text()
    .$defaultFn(() => `add_${ulid()}`)
    .primaryKey(),
  userId: t
    .text()
    .notNull()
    .references(() => users.id, { onDelete: "cascade", onUpdate: "cascade" }),
  addressLine: t.text().notNull(),
  pincode: t.numeric().notNull(),
  city: t.text().notNull(),
  state: t.text().notNull(),
  updatedAt: t.timestamp().$onUpdate(() => new Date()),
  createdAt: t.timestamp().defaultNow(),
}));

// Realtions
export const addressRelations = relations(addresses, ({ one }) => ({
  user: one(users, {
    fields: [addresses.userId],
    references: [users.id],
  }),
}));

// Validation Schemas
export const addressInsertSchema = createInsertSchema(addresses).omit({
  userId: true,
});
export const addressUpdateSchema = createUpdateSchema(addresses);
