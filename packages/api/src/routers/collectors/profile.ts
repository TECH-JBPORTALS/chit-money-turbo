import { apiBuilder, parametersBuilder } from "@zodios/core";
import { z } from "zod";

export const ProfileSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  dob: z.string().min(1),
  aadhar_front_photo_key: z.string().min(1),
  aadhar_back_photo_key: z.string().min(1),
  bank_details_id: z.string().min(1),
  contact_id: z.string().min(1),
  imageUrl: z.string().min(1),
  created_at: z.date(),
  updated_at: z.date(),
});

export const collectorProfileRouter = apiBuilder()
  .addEndpoint({
    method: "get",
    path: "/profile",
    alias: "getProfile",
    response: ProfileSchema,
    requestFormat: "json",
  })
  .addEndpoint({
    method: "put",
    path: "/profile",
    alias: "updateProfile",
    response: ProfileSchema,
    parameters: parametersBuilder()
      .addBody(
        ProfileSchema.omit({
          created_at: true,
          updated_at: true,
          id: true,
        })
      )
      .build(),
    requestFormat: "json",
  })
  .addEndpoint({
    method: "delete",
    path: "/profile",
    alias: "deleteProfile",
    response: ProfileSchema,
    requestFormat: "json",
  })
  .build();
