import { createInsertSchema, createUpdateSchema } from "drizzle-zod";
import {
  subscribers,
  subscribersAddresses,
  subscribersBankAccounts,
  subscribersContacts,
} from ".";
import { z } from "zod";
import { allowValidPhoneNumberRegex } from "@cmt/db/utils";

export const subscribersAddressInsertSchema = createInsertSchema(
  subscribersAddresses
).omit({
  userId: true,
});
export const subscribersAddressUpdateSchema =
  createUpdateSchema(subscribersAddresses);

export const subscribersBankAccountInsertSchema = createInsertSchema(
  subscribersBankAccounts,
  {
    accountType: z.enum(["savings", "current"]),
    upiId: z
      .string()
      .min(3, "UPI ID too short")
      .max(50, "UPI ID too long")
      .regex(/^[\w.-]+@[\w.-]+$/, "Invalid UPI ID"),
  }
).omit({
  userId: true,
});

export const subscribersBankAccountUpdateSchema = createUpdateSchema(
  subscribersBankAccounts,
  {
    accountType: z.enum(["savings", "current"]),
    upiId: z
      .string()
      .min(3, "UPI ID too short")
      .max(50, "UPI ID too long")
      .regex(/^[\w.-]+@[\w.-]+$/, "Invalid UPI ID"),
  }
);

export const subscribersContactInsertSchema = createInsertSchema(
  subscribersContacts,
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

export const subscribersContactUpdateSchema = createUpdateSchema(
  subscribersContacts,
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

export const subscribersInsertSchema = createInsertSchema(subscribers, {
  faceId: z.string().min(1, "Required"),
  dateOfBirth: z.string().min(1, "Required"),
  aadharBackFileKey: z.string().min(1, "Required"),
  aadharFrontFileKey: z.string().min(1, "Required"),
  nomineeName: z.string().min(2, "Invalid name"),
  nomineeRelationship: z.string().min(2, "Invalid relationship"),
}).omit({
  updatedAt: true,
  createdAt: true,
});

export const subscribersUpdateSchema = createUpdateSchema(subscribers, {
  faceId: z.string().min(1, "Required"),
  dateOfBirth: z.string().min(1, "Required"),
  aadharBackFileKey: z.string().min(1, "Required"),
  aadharFrontFileKey: z.string().min(1, "Required"),
  nomineeName: z.string().min(2, "Invalid name"),
  nomineeRelationship: z.string().min(2, "Invalid relationship"),
}).omit({
  updatedAt: true,
  createdAt: true,
});
