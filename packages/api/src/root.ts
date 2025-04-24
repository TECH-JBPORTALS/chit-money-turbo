import { batchesRouter } from "./routers/batches";
import { helloRotuer } from "./routers/hello";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  hello: helloRotuer,
  batches: batchesRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
