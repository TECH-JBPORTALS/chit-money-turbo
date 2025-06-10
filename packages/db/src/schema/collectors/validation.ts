import { createInsertSchema, createUpdateSchema } from "drizzle-zod";
import {
  collectors,
  collectorsAddresses,
  collectorsBankAccounts,
  collectorsContacts,
} from ".";
import { z } from "zod";
import { allowValidPhoneNumberRegex } from "@cmt/db/utils";

export const collectorsInsertSchema = createInsertSchema(collectors, {
  orgName: z
    .string()
    .regex(allowValidPhoneNumberRegex, { message: "Allowed only alphabets" })
    .min(1, "Required"),
  orgCertificateKey: z.string().min(1, "Required"),
  aadharBackFileKey: z.string().min(1, "Required"),
  aadharFrontFileKey: z.string().min(1, "Required"),
  dateOfBirth: z.string().min(1, "Required"),
})
  .required()
  .omit({
    createdAt: true,
    updatedAt: true,
  });

export const collectorsUpdateSchema = createUpdateSchema(collectors).omit({
  createdAt: true,
  updatedAt: true,
});

export const collectorsAddressInsertSchema = createInsertSchema(
  collectorsAddresses
).omit({
  userId: true,
});

export const collectorsAddressUpdateSchema =
  createUpdateSchema(collectorsAddresses);

export const collectorsBankAccountsInsertSchema = createInsertSchema(
  collectorsBankAccounts,
  {
    accountType: z.enum(["savings", "current"]),
    upiId: z
      .string()
      .min(3, "UPI ID too short")
      .max(50, "UPI ID too long")
      .regex(/^[\w.-]+@[\w.-]+$/, "Invalid UPI ID"),
    pincode: z
      .string()
      .regex(/^[0-9]+/)
      .min(6, "Pincode must be minimum 6 digits")
      .max(6, "Pincode must be maximum 6 digits"),
  }
).omit({
  userId: true,
});

export const collectorsBankAccountsUpdateSchema = createUpdateSchema(
  collectorsBankAccounts,
  {
    accountType: z.enum(["savings", "current"]),
    upiId: z
      .string()
      .min(3, "UPI ID too short")
      .max(50, "UPI ID too long")
      .regex(/^[\w.-]+@[\w.-]+$/, "Invalid UPI ID"),
  }
);

export const collectorsContactInsertSchema = createInsertSchema(
  collectorsContacts,
  {
    secondaryPhoneNumber: z
      .string()
      .regex(
        allowValidPhoneNumberRegex,
        "Invlaid phone number. Must be 10 digits and starts with 9 to 6."
      )
      .optional(),
    primaryPhoneNumber: z
      .string()
      .regex(
        allowValidPhoneNumberRegex,
        "Invlaid phone number. Must be 10 digits and starts with 9 to 6."
      ),
  }
)
  .omit({
    userId: true,
  })
  .refine((v) => v.primaryPhoneNumber !== v.secondaryPhoneNumber, {
    message: "Primary and Secondary phone numbers can't be same",
    path: ["secondaryPhoneNumber"],
  });

export const collectorsContactUpdateSchema = createUpdateSchema(
  collectorsContacts,
  {
    secondaryPhoneNumber: z
      .string()
      .regex(
        allowValidPhoneNumberRegex,
        "Invlaid phone number. Must be 10 digits and starts with 9 to 6."
      )
      .optional(),
    primaryPhoneNumber: z
      .string()
      .regex(
        allowValidPhoneNumberRegex,
        "Invlaid phone number. Must be 10 digits and starts with 9 to 6."
      ),
  }
).refine((v) => v.primaryPhoneNumber !== v.secondaryPhoneNumber, {
  message: "Primary and Secondary phone numbers can't be same",
  path: ["secondaryPhoneNumber"],
});
