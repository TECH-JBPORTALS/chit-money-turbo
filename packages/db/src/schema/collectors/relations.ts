import { relations } from "drizzle-orm";

import {
  collectors,
  collectorsAddresses,
  collectorsBankAccounts,
  collectorsContacts,
} from ".";

import { batches } from "../public";

export const collectorsRelations = relations(collectors, ({ one, many }) => ({
  orgAddress: one(collectorsAddresses, {
    fields: [collectors.id],
    references: [collectorsAddresses.userId],
    relationName: "collector_orgAddress",
  }),
  collectorsBankAccount: one(collectorsBankAccounts, {
    fields: [collectors.id],
    references: [collectorsBankAccounts.userId],
    relationName: "collector_bankAccount",
  }),
  contact: one(collectorsContacts),
  batches: many(batches),
}));

export const collectorsContactRelations = relations(
  collectorsContacts,
  ({ one }) => ({
    user: one(collectors, {
      fields: [collectorsContacts.userId],
      references: [collectors.id],
      relationName: "collector_contacts",
    }),
  })
);

export const collectorsBankAccountsRelations = relations(
  collectorsBankAccounts,
  ({ one }) => ({
    user: one(collectors, {
      fields: [collectorsBankAccounts.userId],
      references: [collectors.id],
      relationName: "collector_bank_accounts",
    }),
  })
);

export const collectorsAddressRelations = relations(
  collectorsAddresses,
  ({ one }) => ({
    user: one(collectors, {
      fields: [collectorsAddresses.userId],
      references: [collectors.id],
      relationName: "collector_address",
    }),
  })
);
