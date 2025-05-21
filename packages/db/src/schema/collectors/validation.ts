import { createInsertSchema, createUpdateSchema } from "drizzle-zod";
import {
  collectors,
  collectorsAddresses,
  collectorsBankAccounts,
  collectorsContacts,
} from ".";
import { z } from "zod";

export const collectorsInsertSchema = createInsertSchema(collectors, {
  orgName: z.string().min(1, "Required"),
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
    secondaryPhoneNumber: z.string().optional(),
  }
).omit({
  userId: true,
});

export const collectorsContactUpdateSchema =
  createUpdateSchema(collectorsContacts);
