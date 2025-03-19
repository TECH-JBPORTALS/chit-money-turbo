import { mergeApis, Zodios } from "@zodios/core";
import { batchRouter } from "./routers/batches";

const appRouter = mergeApis({
  "/": batchRouter,
});

export const api = new Zodios(appRouter, {
  axiosConfig: {
    baseURL: "https://api.nexusserp.com/api/chit_money/collector",
  },
});
