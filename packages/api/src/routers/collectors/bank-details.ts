import { apiBuilder, parametersBuilder } from "@zodios/core";
import { z } from "zod";

export const BankDetailsSchema = z.object({
  id: z.string().min(1),
  account_holder_name: z.string().min(1),
  account_number: z.string().min(1),
  ifsc_code: z.string().min(1),
  branch_name: z.string().min(1),
  account_type: z.string().min(1),
  upi_id: z.string().min(1),
  city: z.string().min(1),
  state: z.string().min(1),
  pincode: z.string().min(1),
  created_at: z.date(),
  updated_at: z.date(),
});

export const bankDetailsProfileRouter = apiBuilder()
  .addEndpoint({
    method: "get",
    path: "/bank-details",
    alias: "get",
    response: BankDetailsSchema,
    requestFormat: "json",
  })
  .addEndpoint({
    method: "put",
    path: "/profile",
    alias: "update",
    response: BankDetailsSchema,
    parameters: parametersBuilder()
      .addBody(
        BankDetailsSchema.omit({
          created_at: true,
          updated_at: true,
          id: true,
        })
      )
      .build(),
    requestFormat: "json",
  })
  .build();
