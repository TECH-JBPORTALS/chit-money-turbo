import { PlusCircleIcon } from "lucide-react";
import { Button } from "@cmt/ui/components/button";
import AddSubscribersDialog from "@/components/dialogs/add-subscribers-dialog";
import { DataTableClient } from "./datatable-client";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";
import { Suspense } from "react";
import { SpinnerPage } from "@/components/spinner-page";

export default async function Page({
  params,
}: {
  params: Promise<{ batchId: string }>;
}) {
  const { batchId } = await params;
  prefetch(trpc.batches.getSubscribersOfBatch.queryOptions({ batchId }));

  return (
    <div className="flex flex-col gap-8 text-2xl h-svh">
      <div className="inline-flex justify-between items-center">
        <div>
          <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
            Subscribers
          </h3>
          <p className="text-sm text-muted-foreground">
            All subscribers for this batch
          </p>
        </div>
        <AddSubscribersDialog>
          <Button>
            <PlusCircleIcon />
            Add Subscribers
          </Button>
        </AddSubscribersDialog>
      </div>
      <HydrateClient>
        <Suspense fallback={<SpinnerPage />}>
          <DataTableClient />
        </Suspense>
      </HydrateClient>
    </div>
  );
}
