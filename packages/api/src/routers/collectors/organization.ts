import { makeResponse } from "@/src/helpers/defaults";
import { apiBuilder, makeErrors, parametersBuilder } from "@zodios/core";
import { z } from "zod";
import { batch } from "./batches";

export const organization = z.object({
  id: z.string().min(1),
  collector_id: z.string(),
  name: z.string().min(1),
  address: z.string().min(1),
  city: z.string().min(1),
  state: z.string().min(1),
  pincode: z.string().min(1),
  registration_certificate_key: z.string().min(1),
  created_at: z.date(),
  updated_at: z.date(),
});

const errors = makeErrors([
  {
    status: "default",
    schema: z.object({
      status: z.string(),
      data: z.null(),
      errorr: z.object({ code: z.string(), message: z.string() }),
    }),
    description: "Default error statement",
  },
]);

export const organizationApi = apiBuilder()
  .addEndpoint({
    method: "get",
    path: "/",
    alias: "getOrganization",
    response: makeResponse(organization),
    errors,
  })
  .addEndpoint({
    method: "get",
    path: "/:orgId/batches",
    alias: "getBatches",
    response: z.array(batch),
    errors,
    requestFormat: "json",
    status: 200,
  })
  .addEndpoint({
    method: "put",
    path: "/",
    alias: "updateOrganization",
    response: makeResponse(organization),
    parameters: parametersBuilder()
      .addBody(
        organization.omit({
          created_at: true,
          updated_at: true,
          id: true,
        })
      )
      .build(),
    errors,
  })
  .build();
