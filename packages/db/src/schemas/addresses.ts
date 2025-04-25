import { relations } from "drizzle-orm";
import { pgTable } from "drizzle-orm/pg-core";
import { ulid } from "ulid";
import { collectors } from "./collectors";
import { subscribers } from "./subscribers";

export const addresses = pgTable("addresses", (t) => ({
  id: t
    .text()
    .$defaultFn(() => `add_${ulid()}`)
    .primaryKey(),
  addressLine: t.text().notNull(),
  pincode: t.numeric().notNull(),
  city: t.text().notNull(),
  state: t.text().notNull(),
  updatedAt: t.timestamp().$onUpdate(() => new Date()),
  createdAt: t.timestamp().defaultNow(),
}));

export const addressRelations = relations(addresses, ({ many }) => ({
  collectors: many(collectors),
  subscribers: many(subscribers),
}));
