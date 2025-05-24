import { relations } from "drizzle-orm";

import {
  collectors,
  collectorsAddresses,
  collectorsBankAccounts,
  collectorsContacts,
} from ".";

import { batches } from "../public";

export const collectorsRelations = relations(collectors, ({ one, many }) => ({
  address: one(collectorsAddresses, {
    fields: [collectors.id],
    references: [collectorsAddresses.userId],
  }),
  bankAccount: one(collectorsBankAccounts, {
    fields: [collectors.id],
    references: [collectorsBankAccounts.userId],
  }),
  contact: one(collectorsContacts, {
    fields: [collectors.id],
    references: [collectorsContacts.userId],
  }),
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
