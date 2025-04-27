import { subscribersSchema } from "./_schema";
import { addresses } from "./addresses";
import { relations } from "drizzle-orm";
import { bankAccounts } from "./bank-accounts";
import { contacts } from "./contacts";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = subscribersSchema.table("users", (t) => ({
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

  updatedAt: t.timestamp().$onUpdate(() => new Date()),
  createdAt: t.timestamp().defaultNow(),
}));

// Relation
export const subscriberProfileRelations = relations(users, ({ one }) => ({
  homeAddress: one(addresses),
  bankAccount: one(bankAccounts),
  contact: one(contacts),
}));

// Validation Schemas
export const subscriberInsertSchema = createInsertSchema(users, {
  faceId: z.string().min(1, "Required"),
  dateOfBirth: z.string().min(1, "Required"),
  aadharBackFileKey: z.string().min(1, "Required"),
  aadharFrontFileKey: z.string().min(1, "Required"),
  nomineeName: z.string().min(2, "Invalid name"),
  nomineeRelationship: z.string().min(2, "Invalid relationship"),
}).omit({
  updatedAt: true,
  createdAt: true,
});
