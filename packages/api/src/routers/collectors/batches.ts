import { apiBuilder, makeErrors, parametersBuilder } from "@zodios/core";
import { z } from "zod";

export const batch = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  organization_id: z.string(),
  batch_type: z.enum(["auction", "interest"]),
  starts_on: z.string(),
  ends_on: z.string(),
  due_date: z.number(),
  scheme: z.number(),
  fund_amount: z.string(),
  batch_status: z.enum(["upcoming", "active", "completed"]),
  commission_rate: z.number(),
  created_at: z.string(),
  updated_at: z.string(),
});

const errors = makeErrors([
  {
    status: "default",
    schema: z.object({
      code: z.string(),
      message: z.string(),
    }),
    description: "Default error statement",
  },
]);

export const batchApi = apiBuilder()
  .addEndpoint({
    method: "get",
    path: "/batch/:batchId",
    alias: "getBatches",
    response: z.array(batch),
    errors,
  })
  .addEndpoint({
    method: "put",
    path: "/batch/:batchId",
    alias: "update",
    response: batch,
    parameters: parametersBuilder()
      .addBody(
        batch.omit({
          created_at: true,
          updated_at: true,
          id: true,
        })
      )
      .build(),
    errors,
  })
  .build();
