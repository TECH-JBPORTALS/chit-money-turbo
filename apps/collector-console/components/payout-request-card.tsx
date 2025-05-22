"use client";

import React from "react";
import { RouterOutputs } from "@cmt/api";
import { Avatar, AvatarFallback, AvatarImage } from "@cmt/ui/components/avatar";
import { Button } from "@cmt/ui/components/button";
import { Textarea } from "@cmt/ui/components/textarea";
import { format, formatDistanceToNowStrict } from "date-fns";
import { CheckCircle2, XCircleIcon } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/react";
import { toast } from "sonner";

export type PayoutRequest = RouterOutputs["payouts"]["getRequests"][number];

function PayoutRequestCardFooterActoin({ payoutId }: { payoutId: string }) {
  const [isCancelMode, setIsCancelMode] = React.useState(false);
  const [rejectionReason, setRejectionReason] = React.useState("");
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const { mutate: rejectRequest, isPending: isRejectingRequest } = useMutation(
    trpc.payouts.reject.mutationOptions({
      async onSettled() {
        await queryClient.invalidateQueries(trpc.payouts.pathFilter());
      },
      onError(error) {
        toast.error(error.message);
      },
    })
  );

  const { mutate: approveRequest, isPending: isApprovingRequest } = useMutation(
    trpc.payouts.approve.mutationOptions({
      async onSettled() {
        await queryClient.invalidateQueries(trpc.payouts.pathFilter());
      },
      onError(error) {
        toast.error(error.message);
      },
    })
  );

  if (isCancelMode)
    return (
      <div className="space-y-4 px-2">
        <Textarea
          value={rejectionReason}
          onChange={(e) => setRejectionReason(e.target.value)}
          rows={4}
          placeholder="Type your rejection reason here..."
          className="resize-none"
        />
        <footer className="flex gap-2 w-full justify-end">
          <Button
            onClick={() => setIsCancelMode(false)}
            size={"sm"}
            variant={"outline"}
          >
            Cancel
          </Button>
          <Button
            size={"sm"}
            isLoading={isRejectingRequest}
            onClick={() => rejectRequest({ payoutId, rejectionReason })}
            variant={"destructive"}
          >
            Reject
          </Button>
        </footer>
      </div>
    );

  return (
    <footer className="flex  gap-2 w-full justify-end">
      <Button
        onClick={() => setIsCancelMode(true)}
        size={"sm"}
        variant={"outline"}
      >
        Reject
      </Button>
      <Button
        onClick={() => approveRequest({ payoutId })}
        isLoading={isApprovingRequest}
        size={"sm"}
        variant={"secondary"}
      >
        Approve
      </Button>
    </footer>
  );
}

export function PayoutRequestCard({
  payoutRequest,
}: {
  payoutRequest: PayoutRequest;
}) {
  return (
    <div className="py-4 flex w-full flex-col gap-4">
      <header className="flex justify-between">
        <div className="flex gap-2 items-center">
          <Avatar className="border-2">
            <AvatarImage src={payoutRequest.subscriber.imageUrl} />
            <AvatarFallback>T</AvatarFallback>
          </Avatar>
          <div>
            <small className="text-sm font-medium leading-none">
              {payoutRequest.subscriber.firstName}{" "}
              {payoutRequest.subscriber.lastName}
            </small>
            <p className="text-sm text-muted-foreground">
              {payoutRequest.subscriber.primaryEmailAddress?.emailAddress}
            </p>
          </div>
        </div>
        <p className="text-xs text-muted-foreground text-right">
          {formatDistanceToNowStrict(payoutRequest.requestedAt!, {
            addSuffix: true,
          })}
        </p>
      </header>
      <main className="text-sm text-muted-foreground">
        Requested for{" "}
        <b aria-label="Requested Month">
          {format(payoutRequest.month, "MMMM yyyy")}
        </b>{" "}
        payout regarding chit ID of {payoutRequest.subscriberToBatch.chitId}
      </main>
      {payoutRequest.payoutStatus === "rejected" && (
        <div className="text-xs text-muted-foreground text-right">
          <span className="inline-flex items-center gap-1">
            <XCircleIcon className="size-4" /> Rejected on{" "}
            {format(payoutRequest.rejectedAt!, "dd MMM, yyyy")}
          </span>
        </div>
      )}
      {payoutRequest.payoutStatus === "approved" && (
        <div className="text-xs text-right text-primary">
          <span className="inline-flex items-center gap-1">
            <CheckCircle2 className="size-4" /> Approved on{" "}
            {format(payoutRequest.approvedAt!, "dd MMM, yyyy")}
          </span>
        </div>
      )}
      {payoutRequest.payoutStatus === "requested" && (
        <PayoutRequestCardFooterActoin payoutId={payoutRequest.id} />
      )}
    </div>
  );
}
