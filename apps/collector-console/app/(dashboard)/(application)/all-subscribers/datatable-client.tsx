"use client";

import { columns } from "./columns";
import { useTRPC } from "@/trpc/react";
import { useQuery } from "@tanstack/react-query";
import { useParams, useSearchParams } from "next/navigation";
import { DataTable } from "@/components/data-table";
import { SpinnerPage } from "@/components/spinner-page";

export function DataTableClient() {
  const trpc = useTRPC();
  const searchParams = useSearchParams();
  const query = searchParams.get("q") ?? "";
  const pageSize = searchParams.get("pageSize") ?? "10";
  const pageIndex = searchParams.get("pageIndex") ?? "0";

  const { batchId } = useParams<{ batchId: string }>();
  const { data, isLoading } = useQuery(
    trpc.subscribers.getOfCollector.queryOptions({
      pageIndex: parseInt(pageIndex),
      pageSize: parseInt(pageSize),
      query,
    })
  );

  if (isLoading) return <SpinnerPage />;

  return (
    <DataTable
      columns={columns}
      pageIndex={data?.pageIndex}
      total={data?.total}
      data={data?.items ?? []}
    />
  );
}
