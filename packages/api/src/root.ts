import { batchesRouter } from "./routers/batches";
import { collectorsRouter } from "./routers/collectors";
import { helloRotuer } from "./routers/hello";
import { subscribersRouter } from "./routers/subscribers";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  hello: helloRotuer,
  batches: batchesRouter,
  collectors: collectorsRouter,
  subscribers: subscribersRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
