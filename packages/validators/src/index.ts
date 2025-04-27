import { schema } from "@cmt/db/client";
import { z } from "zod";

export const personalInfoSchema = schema.collectorInsertSchema
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

export const contactInfoSchema = schema.contactInsertSchema;

export const addressInfoSchema = schema.addressInsertSchema;

export const orgInfoSchema = schema.collectorInsertSchema.pick({
  orgName: true,
});

export const bankInfoSchema = schema.bankAccountInsertSchema
  .and(z.object({ confirmAccountNumber: z.string().min(1) }))
  .refine((s) => s.accountNumber === s.confirmAccountNumber, {
    message: "Confirm account number not matched with original account number ",
    path: ["confirm_account_number"],
  });

export const documentsSchema = schema.collectorInsertSchema.pick({
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

export const batchSchema = schema.batchUpdateSchema;

/* Subscriber Onboarding Schema's */
export const subscriberPersonalInfoSchema = schema.subscriberInsertSchema
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

export const nomineeInfoSchema = schema.subscriberInsertSchema.pick({
  nomineeName: true,
  nomineeRelationship: true,
});

export const subscriberDocumentsSchema = schema.subscriberInsertSchema.pick({
  aadharBackFileKey: true,
  aadharFrontFileKey: true,
  panCardNumber: true,
});

export const subscriberAddressInfoSchema = addressInfoSchema;
export const subscriberContactInfoSchema = contactInfoSchema;

export const subscriberBankInfoSchema = bankInfoSchema;

export const subscriberOnboardingSchema = z.object({
  personalInfo: subscriberPersonalInfoSchema,
  contactInfo: subscriberContactInfoSchema,
  nomineeInfo: nomineeInfoSchema,
  documents: subscriberDocumentsSchema,
  addressInfo: subscriberAddressInfoSchema,
  bankInfo: subscriberBankInfoSchema,
});
