import {
  batchUpdateSchema,
  collectorsAddressInsertSchema,
  collectorsBankAccountsInsertSchema,
  collectorsContactInsertSchema,
  collectorsInsertSchema,
  subscribersAddressInsertSchema,
  subscribersBankAccountInsertSchema,
  subscribersContactInsertSchema,
  subscribersInsertSchema,
} from "@cmt/db/schema";
import { z } from "zod";

export const personalInfoSchema = collectorsInsertSchema
  .pick({ dateOfBirth: true })
  .and(
    z.object({
      firstName: z
        .string()
        .trim()
        .min(2, "First name must be at least 2 characters long"),
      lastName: z.string().trim(),
    })
  );

export const contactInfoSchema = collectorsContactInsertSchema;

export const addressInfoSchema = collectorsAddressInsertSchema;

export const orgInfoSchema = collectorsInsertSchema.pick({
  orgName: true,
});

export const bankInfoSchema = collectorsBankAccountsInsertSchema
  .and(z.object({ confirmAccountNumber: z.string().min(1) }))
  .refine((s) => s.accountNumber === s.confirmAccountNumber, {
    message: "Confirm account number not matched with original account number ",
    path: ["confirmAccountNumber"],
  });

export const documentsSchema = collectorsInsertSchema.pick({
  aadharBackFileKey: true,
  aadharFrontFileKey: true,
  orgCertificateKey: true,
});

export const onboardingSchema = z.object({
  currentStep: z.number().default(1),
  personalInfo: personalInfoSchema,
  contactInfo: contactInfoSchema,
  addressInfo: addressInfoSchema,
  orgInfo: orgInfoSchema,
  bankInfo: bankInfoSchema,
  documents: documentsSchema,
});

const documentKeys = Object.keys(documentsSchema.shape) as [
  string,
  ...string[],
];

export const DocumentKeysEnum = z.enum(documentKeys);

export const batchSchema = batchUpdateSchema;

/* Subscriber Onboarding Schema's */
export const subscriberPersonalInfoSchema = subscribersInsertSchema
  .pick({ dateOfBirth: true })
  .and(
    z.object({
      firstName: z
        .string()
        .trim()
        .min(2, "First name must be at least 2 characters long"),
      lastName: z.string().trim(),
    })
  );
export const nomineeInfoSchema = subscribersInsertSchema.pick({
  nomineeName: true,
  nomineeRelationship: true,
});
export const subscriberDocumentsSchema = subscribersInsertSchema.pick({
  aadharBackFileKey: true,
  aadharFrontFileKey: true,
  panCardNumber: true,
});
export const subscriberAddressInfoSchema = subscribersAddressInsertSchema;
export const subscriberContactInfoSchema = subscribersContactInsertSchema;
export const subscriberBankInfoSchema = subscribersBankAccountInsertSchema
  .and(z.object({ confirmAccountNumber: z.string().min(1) }))
  .refine((s) => s.accountNumber === s.confirmAccountNumber, {
    message: "Confirm account number not matched with original account number ",
    path: ["confirmAccountNumber"],
  });

export const subscriberOnboardingSchema = z.object({
  personalInfo: subscriberPersonalInfoSchema,
  contactInfo: subscriberContactInfoSchema,
  nomineeInfo: nomineeInfoSchema,
  documents: subscriberDocumentsSchema,
  addressInfo: subscriberAddressInfoSchema,
  bankInfo: subscriberBankInfoSchema,
});
