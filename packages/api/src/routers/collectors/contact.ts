import { apiBuilder, parametersBuilder } from "@zodios/core";
import { z } from "zod";

export const ContactSchema = z.object({
  id: z.string().min(1),
  address: z.string().min(1),
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
    response: ContactSchema,
    requestFormat: "json",
  })
  .addEndpoint({
    method: "put",
    path: "/profile",
    alias: "update",
    response: ContactSchema,
    parameters: parametersBuilder()
      .addBody(
        ContactSchema.omit({
          created_at: true,
          updated_at: true,
          id: true,
        })
      )
      .build(),
    requestFormat: "json",
  })
  .build();
