"use client";

import SearchInput from "@/components/search-input";
import React from "react";
import { columns } from "./columns";
import { useTRPC } from "@/trpc/react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { DataTable } from "@/components/data-table";
import { SpinnerPage } from "@/components/spinner-page";

export function DataTableClient() {
  const trpc = useTRPC();
  const { batchId } = useParams<{ batchId: string }>();
  const { data, isLoading } = useSuspenseQuery(
    trpc.batches.getSubscribersOfBatch.queryOptions({ batchId })
  );

  if (isLoading) return <SpinnerPage />;

  return (
    <React.Fragment>
      <SearchInput placeholder="Search..." className="w-[600px]" />
      <DataTable columns={columns} data={data} />
    </React.Fragment>
  );
}
