import { z } from "zod";

export const personalInfoSchema = z.object({
  firstName: z.string().trim().min(2, "Enter valid name"),
  lastName: z.string().trim().min(2, "Enter valid name"),
  dateOfBirth: z.string().trim().min(2, "Enter valid date of birth"),
});

export const contactInfoSchema = z.object({
  primary_phone_number: z
    .string()
    .trim()
    .min(10, "Phone number must be 10 digits")
    .max(10, "Phone number must be 10 digits"),
  alternative_phone_number: z
    .string()
    .trim()
    .min(10, "Phone number must be 10 digits")
    .max(10, "Phone number must be 10 digits"),
});

export const nomineeInfoSchema = z.object({
  full_name: z.string().trim().min(2, "Enter valid name"),
  relationship: z.string().trim().min(3, "Enter Valid Relationship"),
});

export const documentsSchema = z.object({
  pan_number: z.string().trim().min(2, "Enter valid PAN number"),
  aadhar_uri: z.string().trim().min(3, "Required"),
});

export const addressInfoSchema = z.object({
  complete_address: z.string().trim().min(2, "Invalid address"),
  pincode: z
    .string()
    .trim()
    .min(6, "Pincode must be 6 digit")
    .max(6, "Pincode must be 6 digit"),
  city: z.string().trim().min(1, "Required"),
  state: z.string().trim().min(1, "Required"),
});

export const bankInfoSchema = z
  .object({
    account_number: z.string().trim().min(2, "Invalid account number"),
    confirm_account_number: z.string().trim().min(1, "required"),
    account_holder_name: z.string().trim().min(3, "Required"),
    ifsc_code: z.string().trim().min(1, "Required"),
    branch_name: z.string().trim().min(1, "Required"),
    upi_id: z.string().trim().min(1, "Required"),
    account_type: z.string().trim().min(1, "Required"),
  })
  .refine((v) => v.account_number === v.confirm_account_number, {
    message: "Account number not matching",
    path: ["confirm_account_number"],
  });

export const onboardingSchema = z.object({
  personalInfo: personalInfoSchema,
  contactInfo: contactInfoSchema,
  nomineeInfo: nomineeInfoSchema,
  documents: documentsSchema,
  addressInfo: addressInfoSchema,
  bankInfo: bankInfoSchema,
});
