import { batchesRouter } from "./routers/batches";
import { chitsRouter } from "./routers/chits";
import { collectorsRouter } from "./routers/collectors";
import { metricsRouter } from "./routers/metrics";
import { paymentsRouter } from "./routers/payments";
import { payoutsRouter } from "./routers/payouts";
import { subscribersRouter } from "./routers/subscribers";
import { transactionsRouter } from "./routers/transactions";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  batches: batchesRouter,
  chits: chitsRouter,
  collectors: collectorsRouter,
  subscribers: subscribersRouter,
  payments: paymentsRouter,
  payouts: payoutsRouter,
  transactions: transactionsRouter,
  metrics: metricsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
