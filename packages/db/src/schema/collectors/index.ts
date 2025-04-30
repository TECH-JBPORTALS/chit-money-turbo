import { ulid } from "ulid";
import { collectorsSchema } from "../table.helpers";
import { accountTypeEnum } from "../enums";

/************************************* Users ****************************************/

export const collectors = collectorsSchema.table("collectors", (t) => ({
  /** Clerk userId will be used as collectors ID */
  id: t.text().primaryKey(),
  dateOfBirth: t.date().notNull(),

  /** Chit Fund House Name */
  orgName: t.text().notNull(),

  /** Neccessary documents file keys - Uploadthing return file keys */
  orgCertificateKey: t.text().notNull(),
  aadharFrontFileKey: t.text().notNull(),
  aadharBackFileKey: t.text().notNull(),

  updatedAt: t.timestamp().$onUpdate(() => new Date()),
  createdAt: t.timestamp().defaultNow().notNull(),
}));

/************************************* Contacts ****************************************/

export const collectorsContacts = collectorsSchema.table("contacts", (t) => ({
  id: t
    .text()
    .$defaultFn(() => `con_${ulid()}`)
    .primaryKey(),
  userId: t
    .text()
    .notNull()
    .references(() => collectors.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
  primaryPhoneNumber: t.numeric().notNull(),
  secondaryPhoneNumber: t.numeric(),
  updatedAt: t.timestamp().$onUpdate(() => new Date()),
  createdAt: t.timestamp().defaultNow().notNull(),
}));

/************************************* Bank Accounts ****************************************/

export const collectorsBankAccounts = collectorsSchema.table(
  "bank_accounts",
  (t) => ({
    id: t
      .text()
      .$defaultFn(() => `acc_${ulid()}`)
      .primaryKey(),
    userId: t
      .text()
      .notNull()
      .references(() => collectors.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    accountNumber: t.text().notNull(),
    accountHolderName: t.text().notNull(),
    accountType: accountTypeEnum("account_type").default("savings").notNull(),
    upiId: t.text().notNull(),
    branchName: t.text().notNull(),
    ifscCode: t.text().notNull(),
    city: t.text().notNull(),
    state: t.text().notNull(),
    pincode: t.numeric().notNull(),
    updatedAt: t.timestamp().$onUpdate(() => new Date()),
    createdAt: t.timestamp().defaultNow().notNull(),
  })
);

/************************************* Addresses ****************************************/

export const collectorsAddresses = collectorsSchema.table("addresses", (t) => ({
  id: t
    .text()
    .$defaultFn(() => `add_${ulid()}`)
    .primaryKey(),
  userId: t
    .text()
    .notNull()
    .references(() => collectors.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
  addressLine: t.text().notNull(),
  pincode: t.numeric().notNull(),
  city: t.text().notNull(),
  state: t.text().notNull(),
  updatedAt: t.timestamp().$onUpdate(() => new Date()),
  createdAt: t.timestamp().defaultNow().notNull(),
}));
