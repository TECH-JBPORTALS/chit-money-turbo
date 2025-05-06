import { batchesRouter } from "./routers/batches";
import { collectorsRouter } from "./routers/collectors";
import { helloRotuer } from "./routers/hello";
import { paymentsRouter } from "./routers/payments";
import { payoutsRouter } from "./routers/payouts";
import { subscribersRouter } from "./routers/subscribers";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  hello: helloRotuer,
  batches: batchesRouter,
  collectors: collectorsRouter,
  subscribers: subscribersRouter,
  payments: paymentsRouter,
  payouts: payoutsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
