import { z } from "zod";

export const personalInfoSchema = z.object({
  first_name: z
    .string()
    .trim()
    .min(2, "First name must be at least 2 characters long"),
  last_name: z.string().trim(),
  date_of_birth: z.string().min(1),
});

export const contactInfoSchema = z.object({
  primary_phone_number: z
    .string()
    .trim()
    .min(10, "Phone number must be 10 digit")
    .max(10, "Phone number must be 10 digit")
    .default(""),
  contact_address: z.string().trim().min(4).default(""),
  contact_pincode: z.string().trim().min(6, "Invalid pincode").default(""),
  contact_city: z.string().trim().min(1, "Required").default(""),
  contact_state: z.string().trim().min(1, "Required").default(""),
});

export const orgInfoSchema = z.object({
  company_fullname: z.string().trim().min(1, "Required"),
  company_address: z.string().trim().min(4),
  company_pincode: z.string().trim().min(6, "Invalid pincode"),
  company_city: z.string().trim().min(1, "Required"),
  company_state: z.string().trim().min(1, "Required"),
});

export const bankInfoSchema = z
  .object({
    account_number: z.string().trim().min(1, "Required"),
    confirm_account_number: z.string().trim().min(4),
    account_holder_name: z.string().trim().min(1, "Required"),
    branch_name: z.string().trim().min(1, "Required"),
    ifsc_code: z.string().trim().min(1, "Required"),
    bank_address_pincode: z.string().trim().min(6, "Invalid Pincode"),
    bank_city: z.string().trim().min(1, "Required"),
    bank_state: z.string().trim().min(1, "Required"),
  })
  .refine((s) => s.account_number === s.confirm_account_number, {
    message: "Account number not confirmed correctly",
    path: ["confirm_account_number"],
  });

export const documentsSchema = z.object({
  registeration_certificate_url: z.string().trim().min(1, "Required"),
  aadhar_card_front_url: z.string().trim().min(1, "Required"),
  aadhar_card_back_url: z.string().trim().min(1, "Required"),
});

export const onboardingSchema = z.object({
  currentStep: z.number().default(1),
  personalInfo: personalInfoSchema,
  contactInfo: contactInfoSchema,
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
  start_month: z.string().nonempty("Required"),
  due_date: z.string().nonempty("Required"),
});
