import { relations } from "drizzle-orm";
import {
  subscribers,
  subscribersAddresses,
  subscribersBankAccounts,
  subscribersContacts,
} from ".";
import { subscribersToBatches } from "../public";

export const subscribersRelations = relations(subscribers, ({ one, many }) => ({
  contact: one(subscribersContacts),
  homeAddress: one(subscribersAddresses),
  bankAccount: one(subscribersBankAccounts),
  subscribersToBatches: many(subscribersToBatches),
}));

export const subscribersContactRelations = relations(
  subscribersContacts,
  ({ one }) => ({
    user: one(subscribers, {
      fields: [subscribersContacts.userId],
      references: [subscribers.id],
    }),
  })
);

export const subscribersBankAccountRelations = relations(
  subscribersBankAccounts,
  ({ one }) => ({
    user: one(subscribers, {
      fields: [subscribersBankAccounts.userId],
      references: [subscribers.id],
    }),
  })
);

export const subscribersAddressesRelations = relations(
  subscribersAddresses,
  ({ one }) => ({
    user: one(subscribers, {
      fields: [subscribersAddresses.userId],
      references: [subscribers.id],
    }),
  })
);
