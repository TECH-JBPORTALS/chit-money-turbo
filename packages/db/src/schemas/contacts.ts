import { pgTable } from "drizzle-orm/pg-core";
import { ulid } from "ulid";
import { relations } from "drizzle-orm";
import { collectors } from "./collectors";
import { subscribers } from "./subscribers";

export const contacts = pgTable("contacts", (t) => ({
  id: t
    .text()
    .$defaultFn(() => `con_${ulid()}`)
    .primaryKey(),
  primaryPhoneNumber: t.text().notNull(),
  secondaryPhoneNumber: t.text().notNull(),
  updatedAt: t.timestamp().$onUpdate(() => new Date()),
  createdAt: t.timestamp().defaultNow(),
}));

export const contactRelations = relations(contacts, ({ many }) => ({
  collectors: many(collectors),
  subscribers: many(subscribers),
}));
