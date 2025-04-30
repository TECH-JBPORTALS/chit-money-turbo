import { createQueryClient } from "@/trpc/query-client";
import { trpc } from "@/trpc/server";
import { Button } from "@cmt/ui/components/button";
import { ArrowRight } from "lucide-react";

export default async function Page({
  params,
}: {
  params: Promise<{ subscriberId: string }>;
}) {
  const queryClient = createQueryClient();
  const { subscriberId } = await params;
  const batches = await queryClient.fetchQuery(
    trpc.batches.getBatchesBySubscriber.queryOptions({ subscriberId })
  );

  const activeBatches = batches.filter((b) => b.batchStatus === "active");
  const completedBatches = batches.filter((b) => b.batchStatus === "completed");

  return (
    <>
      <div className="flex gap-2 flex-col">
        <p className="text-sm text-muted-foreground">Ongoing</p>

        {activeBatches.map((b) => (
          <Button key={b.id} variant={"ghost"} className="justify-between">
            {b.name} <ArrowRight />
          </Button>
        ))}
      </div>

      <div className="flex gap-2 flex-col">
        <p className="text-sm text-muted-foreground">Completed</p>
        {completedBatches.map((b) => (
          <Button key={b.id} variant={"ghost"} className="justify-between">
            {b.name} <ArrowRight />
          </Button>
        ))}
      </div>
    </>
  );
}
