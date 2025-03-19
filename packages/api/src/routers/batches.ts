import { apiBuilder, parametersBuilder } from "@zodios/core";
import { z } from "zod";

export const BatchSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  created_at: z.date(),
  updated_at: z.date(),
});

export const batchRouter = apiBuilder()
  .addEndpoint({
    method: "post",
    path: "22display_batch_list.php",
    alias: "getAllBatches",
    response: z.array(BatchSchema),
    parameters: parametersBuilder()
      .addBody(z.object({ collecter_id: z.string() }))
      .build(),
    requestFormat: "form-data",
  })
  .build();
