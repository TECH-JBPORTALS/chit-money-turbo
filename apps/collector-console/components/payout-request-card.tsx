"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@cmt/ui/components/avatar";
import { Button } from "@cmt/ui/components/button";
import { Textarea } from "@cmt/ui/components/textarea";
import { formatDistanceToNowStrict } from "date-fns";
import { CheckCircle2, XCircleIcon } from "lucide-react";
import React from "react";

export type PayoutRequest = {
  id: string;
  chit_id: string;
  full_name: string;
  payout_month: string;
  email: string;
  requested_on: Date;
  is_rejected: boolean;
  is_approved: boolean;
  rejected_on: string;
  approved_on: string;
};

function PayoutRequestCardFooterActoin() {
  const [isCancelMode, setIsCancelMode] = React.useState(false);
  if (isCancelMode)
    return (
      <div className="space-y-4 px-2">
        <Textarea
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
          <Button size={"sm"} variant={"destructive"}>
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
      <Button size={"sm"} variant={"secondary"}>
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
            <AvatarImage src="https://github.com/t3dotgg.png" />
            <AvatarFallback>T</AvatarFallback>
          </Avatar>
          <div>
            <small className="text-sm font-medium leading-none">
              {payoutRequest.full_name}
            </small>
            <p className="text-sm text-muted-foreground">
              {payoutRequest.email}
            </p>
          </div>
        </div>
        <p className="text-xs text-muted-foreground text-right">
          {formatDistanceToNowStrict(payoutRequest.requested_on, {
            addSuffix: true,
          })}
        </p>
      </header>
      <main className="text-sm text-muted-foreground">
        Requested for{" "}
        <b aria-label="Requested Month">{payoutRequest.payout_month}</b> payout
        regarding chit ID of {payoutRequest.chit_id}
      </main>
      {payoutRequest.is_rejected && (
        <div className="text-xs text-muted-foreground text-right">
          <span className="inline-flex items-center gap-1">
            <XCircleIcon className="size-4" /> Rejected on{" "}
            {payoutRequest.rejected_on}
          </span>
        </div>
      )}
      {payoutRequest.is_approved && (
        <div className="text-xs text-right text-primary">
          <span className="inline-flex items-center gap-1">
            <CheckCircle2 className="size-4" /> Approved on{" "}
            {payoutRequest.approved_on}
          </span>
        </div>
      )}
      {!payoutRequest.is_rejected && !payoutRequest.is_approved && (
        <PayoutRequestCardFooterActoin />
      )}
    </div>
  );
}
