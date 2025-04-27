import { ulid } from "ulid";
import { subscribersSchema } from "./_schema";
import { users } from "./users";
import { relations } from "drizzle-orm";
import { createInsertSchema, createUpdateSchema } from "drizzle-zod";

export const addresses = subscribersSchema.table("addresses", (t) => ({
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
export const subscriberAddressInsertSchema = createInsertSchema(addresses);
export const subscriberAddressUpdateSchema = createUpdateSchema(addresses);
