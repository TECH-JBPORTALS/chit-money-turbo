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

  if (batches.length === 0)
    return (
      <div className="flex flex-col items-center justify-between px-6 py-2.5">
        <p className="text-sm">No Batches</p>
        <p className="text-xs text-muted-foreground text-center">
          If you have any active or upcoming batches you can see here or create
          one.
        </p>
      </div>
    );

  return (
    <React.Fragment>
      {batches?.map((batch) => (
        <AppSidebarMenuButtonWithSubMenu {...batch} key={batch.id} />
      ))}
    </React.Fragment>
  );
}
