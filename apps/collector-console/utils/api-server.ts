import "server-only";

import { Zodios } from "@zodios/core";
import { pluginToken } from "@zodios/plugins";
import { auth } from "@clerk/nextjs/server";
import { appRouter } from "@cmt/api";

export const api = new Zodios(appRouter, {
  axiosConfig: {
    baseURL: "http://localhost:8000/api",
  },
});

api.use(
  pluginToken({
    async getToken() {
      const user = await auth();
      return (await user.getToken({ template: "dev-test" })) ?? undefined;
    },
  })
);
