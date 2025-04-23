"use client";
import { Zodios } from "@zodios/core";
import { ZodiosHooks } from "@zodios/react";
import { pluginToken } from "@zodios/plugins";
import { useAuth } from "@clerk/nextjs";
import { appRouter } from "@cmt/api";

export const api = new Zodios(appRouter, {
  axiosConfig: {
    baseURL: "http://localhost:8000/api",
  },
});

api.use(
  pluginToken({
    async getToken() {
      const { getToken } = useAuth();
      return (await getToken({ template: "dev-test" })) ?? undefined;
    },
  })
);

export const apiHooks = new ZodiosHooks("collectors-api", api);
