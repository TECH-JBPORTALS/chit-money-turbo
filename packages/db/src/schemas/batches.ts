import { foreignKey, pgEnum, pgTable } from "drizzle-orm/pg-core";
import { ulid } from "ulid";
import { collectors } from "./collectors";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";

export const batchTypeEnum = pgEnum("batch_type_enum", ["interest", "auction"]);
export const batchStatusEnum = pgEnum("batch_status_enum", [
  "upcoming",
  "active",
  "completed",
]);

export const batches = pgTable("batches", (t) => ({
  id: t
    .text()
    .$defaultFn(() => `batch_${ulid()}`)
    .primaryKey(),
  collectorId: t
    .text()
    .references(() => collectors.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    })
    .notNull(),
  name: t.text().notNull(),
  batchType: batchTypeEnum("batch_type").default("interest").notNull(),
  startsOn: t.date().notNull(),
  endsOn: t.date().notNull(),
  scheme: t.integer().notNull(),
  fundAmount: t.numeric().notNull(),
  defaultCommissionRate: t.numeric().notNull(),
  batchStatus: batchStatusEnum("batch_status").default("upcoming").notNull(),
  updatedAt: t.timestamp().$onUpdate(() => new Date()),
  createdAt: t.timestamp().defaultNow(),
}));

export const batchRelations = relations(batches, ({ one }) => ({
  collector: one(collectors, {
    fields: [batches.collectorId],
    references: [collectors.id],
  }),
}));

export const batchInsertSchema = createInsertSchema(batches).omit({
  id: true,
  collectorId: true,
  endsOn: true, //Calculate when inserting using startsOn field
  createdAt: true,
  updatedAt: true,
});
