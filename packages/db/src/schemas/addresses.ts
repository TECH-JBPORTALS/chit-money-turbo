import { relations } from "drizzle-orm";
import { pgTable } from "drizzle-orm/pg-core";
import { ulid } from "ulid";
import { collectors } from "./collectors";
import { subscribers } from "./subscribers";
import { createInsertSchema, createUpdateSchema } from "drizzle-zod";
import { z } from "zod";

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

export const addressInsertSchema = createInsertSchema(addresses, {
  addressLine: z.string().min(1, "Required"),
  city: z.string().min(1, "Required"),
  state: z.string().min(1, "Required"),
  pincode: z.string().min(1, "Required"),
})
  .omit({
    id: true,
    createdAt: true,
    updatedAt: true,
  })
  .required();

export const addressUpdateSchema = createUpdateSchema(addresses).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const addressRelations = relations(addresses, ({ many }) => ({
  collectors: many(collectors),
  subscribers: many(subscribers),
}));
