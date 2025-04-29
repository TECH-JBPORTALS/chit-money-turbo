import { ulid } from "ulid";
import { accountTypeEnum } from "../enums";
import { subscribersSchema } from "../table.helpers";

/************************************* Users ****************************************/

export const subscribers = subscribersSchema.table("users", (t) => ({
  /** Clerk userId will be used as collector ID */
  id: t.text().primaryKey(),

  /** Subcriber him/her - self will have unique FACE ID on the application,
     So that later collectors can refer this to add the subscribers to the batches */
  faceId: t.text().unique().notNull(),
  dateOfBirth: t.date().notNull(),
  panCardNumber: t.text().unique().notNull(),

  nomineeName: t.text().notNull(),
  nomineeRelationship: t.text().notNull(),

  /** Neccessary documents file keys - Uploadthing return file keys */
  aadharFrontFileKey: t.text().notNull(),
  aadharBackFileKey: t.text().notNull(),

  updatedAt: t.timestamp().$onUpdate(() => new Date()),
  createdAt: t.timestamp().defaultNow().notNull(),
}));

/************************************* Contacts ****************************************/

export const subscribersContacts = subscribersSchema.table(
  "subscribersContacts",
  (t) => ({
    id: t
      .text()
      .$defaultFn(() => `con_${ulid()}`)
      .primaryKey(),
    userId: t
      .text()
      .notNull()
      .references(() => subscribers.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    primaryPhoneNumber: t.numeric().notNull(),
    secondaryPhoneNumber: t.numeric(),
    updatedAt: t.timestamp().$onUpdate(() => new Date()),
    createdAt: t.timestamp().defaultNow().notNull(),
  })
);

/************************************* Bank Accounts ****************************************/

export const subscribersBankAccounts = subscribersSchema.table(
  "bank_accounts",
  (t) => ({
    id: t
      .text()
      .$defaultFn(() => `acc_${ulid()}`)
      .primaryKey(),
    userId: t
      .text()
      .notNull()
      .references(() => subscribers.id, {
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

/************************************* subscribersAddresses ****************************************/

export const subscribersAddresses = subscribersSchema.table(
  "addresses",
  (t) => ({
    id: t
      .text()
      .$defaultFn(() => `add_${ulid()}`)
      .primaryKey(),
    userId: t
      .text()
      .notNull()
      .references(() => subscribers.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    addressLine: t.text().notNull(),
    pincode: t.numeric().notNull(),
    city: t.text().notNull(),
    state: t.text().notNull(),
    updatedAt: t.timestamp().$onUpdate(() => new Date()),
    createdAt: t.timestamp().defaultNow().notNull(),
  })
);
