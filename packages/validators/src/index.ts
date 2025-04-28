import * as publicSchema from "@cmt/db/schema";
import { collectorsSchema } from "@cmt/db/schema";
import { subscribersSchema } from "@cmt/db/schema";
import { z } from "zod";

export const personalInfoSchema = collectorsSchema.collectorInsertSchema
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

export const contactInfoSchema = collectorsSchema.contactInsertSchema;

export const addressInfoSchema = collectorsSchema.addressInsertSchema;

export const orgInfoSchema = collectorsSchema.collectorInsertSchema.pick({
  orgName: true,
});

export const bankInfoSchema = collectorsSchema.bankAccountInsertSchema
  .and(z.object({ confirmAccountNumber: z.string().min(1) }))
  .refine((s) => s.accountNumber === s.confirmAccountNumber, {
    message: "Confirm account number not matched with original account number ",
    path: ["confirmAccountNumber"],
  });

export const documentsSchema = collectorsSchema.collectorInsertSchema.pick({
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

export const batchSchema = publicSchema.batchUpdateSchema;

/* Subscriber Onboarding Schema's */
export const subscriberPersonalInfoSchema =
  subscribersSchema.subscriberInsertSchema.pick({ dateOfBirth: true }).and(
    z.object({
      firstName: z
        .string()
        .trim()
        .min(2, "First name must be at least 2 characters long"),
      lastName: z.string().trim(),
    })
  );
export const nomineeInfoSchema = subscribersSchema.subscriberInsertSchema.pick({
  nomineeName: true,
  nomineeRelationship: true,
});
export const subscriberDocumentsSchema =
  subscribersSchema.subscriberInsertSchema.pick({
    aadharBackFileKey: true,
    aadharFrontFileKey: true,
    panCardNumber: true,
  });
export const subscriberAddressInfoSchema =
  subscribersSchema.addressInsertSchema;
export const subscriberContactInfoSchema =
  subscribersSchema.contactInsertSchema;
export const subscriberBankInfoSchema =
  subscribersSchema.bankAccountInsertSchema;

export const subscriberOnboardingSchema = z.object({
  personalInfo: subscriberPersonalInfoSchema,
  contactInfo: subscriberContactInfoSchema,
  nomineeInfo: nomineeInfoSchema,
  documents: subscriberDocumentsSchema,
  addressInfo: subscriberAddressInfoSchema,
  bankInfo: subscriberBankInfoSchema,
});
