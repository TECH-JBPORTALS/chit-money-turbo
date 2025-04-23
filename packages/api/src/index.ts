import { mergeApis } from "@zodios/core";
import { organizationApi } from "./routers/collectors/organization";

export const appRouter = mergeApis({
  "/collectors/organization": organizationApi,
});
