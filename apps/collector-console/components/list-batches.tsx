"use client";

import { useTRPC } from "@/trpc/react";
import { AppSidebarMenuButtonWithSubMenu } from "./app-sidebar-menu-button";
import { useSuspenseQuery } from "@tanstack/react-query";
import React from "react";

export function ListBatches() {
  const trpc = useTRPC();
  const { data: batches } = useSuspenseQuery(
    trpc.batches.getAll.queryOptions()
  );

  return (
    <React.Fragment>
      {batches?.map((batch) => (
        <AppSidebarMenuButtonWithSubMenu {...batch} key={batch.id} />
      ))}
    </React.Fragment>
  );
}
