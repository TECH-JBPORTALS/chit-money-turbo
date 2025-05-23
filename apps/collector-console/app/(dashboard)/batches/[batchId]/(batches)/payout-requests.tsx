"use client";
import { ScrollArea } from "@cmt/ui/components/scroll-area";
import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/react";
import { useParams } from "next/navigation";
import { SpinnerPage } from "@/components/spinner-page";
import { PayoutRequestCard } from "@/components/payout-request-card";
import EmptyState from "@/components/empty-state";

export function PayoutRequests() {
  const trpc = useTRPC();
  const { batchId } = useParams<{ batchId: string }>();
  const { data: payoutRequests, isLoading } = useQuery(
    trpc.payouts.getRequests.queryOptions({ batchId })
  );

  if (isLoading) return <SpinnerPage />;

  if (payoutRequests?.length === 0)
    <div className="h-full flex items-center justify-center">
      <EmptyState
        title="No Requests"
        description="Any request for payouts can be seen here"
      />
    </div>;

  return (
    <ScrollArea className="w-full h-full px-8 pb-4">
      {payoutRequests?.map((payoutRequest) => (
        <PayoutRequestCard
          payoutRequest={payoutRequest}
          key={payoutRequest.id}
        />
      ))}
    </ScrollArea>
  );
}
