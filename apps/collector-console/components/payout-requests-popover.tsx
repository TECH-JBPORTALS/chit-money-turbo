"use client";
import { Button } from "@cmt/ui/components/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@cmt/ui/components/popover";
import { BellIcon } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@cmt/ui/components/tooltip";
import { ScrollArea } from "@cmt/ui/components/scroll-area";
import { PayoutRequestCard } from "./payout-request-card";
import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/react";
import { useParams } from "next/navigation";
import { SpinnerPage } from "./spinner-page";
import { useState } from "react";
import { cn } from "@cmt/ui/lib/utils";

export function PayoutRequestsButton() {
  const [open, setOpen] = useState(false);
  const trpc = useTRPC();
  const { batchId } = useParams<{ batchId: string }>();
  const { data: payoutRequests, isLoading } = useQuery(
    trpc.payouts.getRequests.queryOptions({ batchId }, { enabled: open })
  );

  const { data: totalRequestCount, isLoading: isTotalRequestCountLoading } =
    useQuery(trpc.payouts.getTotalRequestsCount.queryOptions({ batchId }));

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <Tooltip>
        <TooltipTrigger asChild>
          <PopoverTrigger asChild>
            <Button
              className={cn(
                !isTotalRequestCountLoading && totalRequestCount
                  ? `after:content-['${totalRequestCount}'] animate-in after:size-4 after:rounded-full after:text-xs after:flex after:items-center after:justify-center after:absolute after:-top-1.5 after:-right-1.5 after:z-50 after:bg-foreground after:font-semibold after:text-background relative`
                  : "after:hidden"
              )}
              variant={"outline"}
            >
              <BellIcon />
            </Button>
          </PopoverTrigger>
        </TooltipTrigger>
        <TooltipContent>Payout Requests</TooltipContent>
      </Tooltip>
      <PopoverContent className="min-w-[420px] h-[520px] overflow-hidden">
        <div>
          <div className="text-lg font-semibold">Payout Requests</div>
        </div>
        {isLoading ? (
          <SpinnerPage />
        ) : (
          <ScrollArea className="w-full h-full pr-4 pb-4">
            {payoutRequests?.map((payoutRequest) => (
              <PayoutRequestCard
                payoutRequest={payoutRequest}
                key={payoutRequest.id}
              />
            ))}
          </ScrollArea>
        )}
      </PopoverContent>
    </Popover>
  );
}
