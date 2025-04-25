import {
  addressInsertSchema,
  bankAccountInsertSchema,
  collectorInsertSchema,
  contactInsertSchema,
} from "@cmt/db/schemas";
import { z } from "zod";

export const personalInfoSchema = collectorInsertSchema
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

export const contactInfoSchema = contactInsertSchema;

export const addressInfoSchema = addressInsertSchema;

export const orgInfoSchema = collectorInsertSchema.pick({
  orgName: true,
});

export const bankInfoSchema = bankAccountInsertSchema
  .and(z.object({ confirmAccountNumber: z.string().min(1) }))
  .refine((s) => s.accountNumber === s.confirmAccountNumber, {
    message: "Confirm account number not matched with original account number ",
    path: ["confirm_account_number"],
  });

export const documentsSchema = collectorInsertSchema.pick({
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

export const batchSchema = z.object({
  name: z.string().nonempty("Required"),
  number_of_months: z.number().min(1, "Required"),
  starts_on: z.string().nonempty("Required"),
  due_date: z.string().nonempty("Required"),
});
