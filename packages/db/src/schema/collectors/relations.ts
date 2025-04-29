import { relations } from "drizzle-orm";
import {
  collectors,
  collectorsAddresses,
  collectorsBankAccounts,
  collectorsContacts,
} from ".";
import { batches } from "../public";

export const collectorsRelations = relations(collectors, ({ one, many }) => ({
  orgAddress: one(collectorsAddresses),
  collectorsBankAccounts: one(collectorsBankAccounts),
  contact: one(collectorsContacts),
  batches: many(batches),
}));

export const collectorsContactRelations = relations(
  collectorsContacts,
  ({ one }) => ({
    user: one(collectors, {
      fields: [collectorsContacts.userId],
      references: [collectors.id],
    }),
  })
);

export const collectorsBankAccountsRelations = relations(
  collectorsBankAccounts,
  ({ one }) => ({
    user: one(collectors, {
      fields: [collectorsBankAccounts.userId],
      references: [collectors.id],
    }),
  })
);

export const collectorsAddressRelations = relations(
  collectorsAddresses,
  ({ one }) => ({
    user: one(collectors, {
      fields: [collectorsAddresses.userId],
      references: [collectors.id],
    }),
  })
);
