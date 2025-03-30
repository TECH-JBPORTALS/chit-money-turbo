import { z } from "zod";

export const personalInfoSchema = z.object({
  full_name: z.string().trim().min(2, "Enter valid name"),
  date_of_birth: z.string().trim().min(2, "Enter valid date of birth"),
});

export const contactInfoSchema = z.object({
  primary_phone_number: z
    .string()
    .min(10, "Phone number must be 10 digits")
    .max(10, "Phone number must be 10 digits"),
  alternative_phone_number: z
    .string()
    .min(10, "Phone number must be 10 digits")
    .max(10, "Phone number must be 10 digits"),
});

export const nomineeInfoSchema = z.object({
  full_name: z.string().min(2, "Enter valid name"),
  relationship: z.string().min(3, "Enter Valid Relationship"),
});

export const documentsSchema = z.object({
  pan_number: z.string().min(2, "Enter valid PAN number"),
  aadhar_uri: z.string().min(3, "Required"),
});

export const onboardingSchema = z.object({
  perosnalInfo: personalInfoSchema,
  contactInfo: contactInfoSchema,
  nomineeInfo: nomineeInfoSchema,
  documents: documentsSchema,
});
