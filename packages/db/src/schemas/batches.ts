import { ulid } from "ulid";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { users } from "@/schemas/collectors/users";
import { pgEnum, pgTable } from "drizzle-orm/pg-core";

export const batchTypeEnum = pgEnum("batch_type_enum", ["interest", "auction"]);
export const batchStatusEnum = pgEnum("batch_status_enum", [
  "active",
  "completed",
]);

export const batches = pgTable("batches", (t) => ({
  id: t
    .text()
    .$defaultFn(() => `batch_${ulid()}`)
    .primaryKey(),
  collectorId: t.text().references(() => users.id, {
    onDelete: "cascade",
    onUpdate: "cascade",
  }),
  name: t.text().notNull(),
  batchType: batchTypeEnum("batch_type").default("interest").notNull(),
  dueOn: t.numeric().notNull(),
  startsOn: t.date().notNull(),
  endsOn: t.date().notNull(),
  scheme: t.integer().notNull(),
  fundAmount: t.numeric().notNull(),
  defaultCommissionRate: t.numeric().notNull(),
  batchStatus: batchStatusEnum("batch_status").default("active").notNull(),
  updatedAt: t.timestamp().$onUpdate(() => new Date()),
  createdAt: t.timestamp().defaultNow(),
}));

// Relations
export const batchRelations = relations(batches, ({ one }) => ({
  collector: one(users, {
    fields: [batches.collectorId],
    references: [users.id],
  }),
}));

// Validation Schemas
export const batchInsertSchema = createInsertSchema(batches).omit({
  id: true,
  collectorId: true,
  endsOn: true, //Calculate when inserting using startsOn field
  createdAt: true,
  updatedAt: true,
  batchStatus: true,
});

export const batchUpdateSchema = createInsertSchema(batches)
  .omit({
    id: true,
    collectorId: true,
    endsOn: true, //Calculate when inserting using startsOn field
    createdAt: true,
    updatedAt: true,
  })
  .and(
    z.object({ batchId: z.string().min(1, "batchId is required for updation") })
  );
