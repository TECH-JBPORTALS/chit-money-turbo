import { addresses } from "./addresses";
import { relations } from "drizzle-orm";
import { bankAccounts } from "./bank-accounts";
import { contacts } from "./contacts";
import { createInsertSchema, createUpdateSchema } from "drizzle-zod";
import { z } from "zod";
import { batches } from "@/schemas";
import { collectorsSchema } from "./_schema";

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

export const collectorRelations = relations(users, ({ one, many }) => ({
  orgAddress: one(addresses),
  bankAccount: one(bankAccounts),
  contact: one(contacts),
  batches: many(batches),
}));
