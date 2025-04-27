import { subscribersSchema } from "./_schema";
import { ulid } from "ulid";
import { users } from "./users";
import { relations } from "drizzle-orm";
import { createInsertSchema, createUpdateSchema } from "drizzle-zod";
import { z } from "zod";

export const contacts = subscribersSchema.table("contacts", (t) => ({
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
