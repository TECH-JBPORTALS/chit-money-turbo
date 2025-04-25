import { pgTable } from "drizzle-orm/pg-core";
import { ulid } from "ulid";
import { relations } from "drizzle-orm";
import { collectors } from "./collectors";
import { subscribers } from "./subscribers";
import { createInsertSchema, createUpdateSchema } from "drizzle-zod";
import { z } from "zod";

export const contacts = pgTable("contacts", (t) => ({
  id: t
    .text()
    .$defaultFn(() => `con_${ulid()}`)
    .primaryKey(),
  primaryPhoneNumber: t.numeric().notNull(),
  secondaryPhoneNumber: t.numeric(),
  updatedAt: t.timestamp().$onUpdate(() => new Date()),
  createdAt: t.timestamp().defaultNow(),
}));

export const contactInsertSchema = createInsertSchema(contacts, {
  primaryPhoneNumber: z
    .string()
    .regex(/^[6-9]\d{9}$/, {
      message:
        "Invalid Indian mobile number. Must be 10 digits starting with 6-9.",
    })
    .min(10),
  secondaryPhoneNumber: z
    .string()
    .regex(/^[6-9]\d{9}$/, {
      message:
        "Invalid Indian mobile number. Must be 10 digits starting with 6-9.",
    })
    .optional(),
})
  .omit({
    id: true,
    createdAt: true,
    updatedAt: true,
  })
  .required();

export const contactUpdateSchema = createUpdateSchema(contacts).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const contactRelations = relations(contacts, ({ many }) => ({
  collectors: many(collectors),
  subscribers: many(subscribers),
}));
