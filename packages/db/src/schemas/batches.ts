import { foreignKey, pgEnum, pgTable } from "drizzle-orm/pg-core";
import { ulid } from "ulid";
import { collectorProfiles } from "./collector-profiles";

export const batchTypeEnum = pgEnum("batch_type_enum", ["interest", "auction"]);
export const batchStatusEnum = pgEnum("batch_status_enum", [
  "upcoming",
  "active",
  "completed",
]);

export const batches = pgTable(
  "batches",
  (t) => ({
    id: t
      .text()
      .$defaultFn(() => `batch_${ulid()}`)
      .primaryKey(),
    collectorProfileUserId: t.text().notNull(),
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
  }),
  (self) => [
    foreignKey({
      columns: [self.collectorProfileUserId],
      foreignColumns: [collectorProfiles.userId],
    })
      .onDelete("cascade")
      .onUpdate("cascade"),
  ]
);

// export const batchRelations = relations(batches, ({ one }) => ({
//   collectorProfile: one(collectorProfiles, {
//     fields: [batches.collectorProfileUserId],
//     references: [collectorProfiles.userId],
//   }),
// }));
