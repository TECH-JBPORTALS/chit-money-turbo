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
import { PayoutRequest, PayoutRequestCard } from "./payout-request-card";

export const fakePayoutRequests: PayoutRequest[] = [
  {
    id: "pr_001",
    chit_id: "chit_101",
    full_name: "Ravi Kumar",
    payout_month: "March 2025",
    email: "ravi.kumar@example.com",
    requested_on: new Date("2025-03-10"),
    is_rejected: false,
    is_approved: true,
    rejected_on: "",
    approved_on: "2025-03-15",
  },
  {
    id: "pr_002",
    chit_id: "chit_102",
    full_name: "Meera Sharma",
    payout_month: "April 2025",
    email: "meera.sharma@example.com",
    requested_on: new Date("2025-03-12"),
    is_rejected: false,
    is_approved: false,
    rejected_on: "",
    approved_on: "",
  },
  {
    id: "pr_003",
    chit_id: "chit_103",
    full_name: "Sandeep Verma",
    payout_month: "February 2025",
    email: "sandeep.verma@example.com",
    requested_on: new Date("2025-02-05"),
    is_rejected: true,
    is_approved: false,
    rejected_on: "2025-02-10",
    approved_on: "",
  },
  {
    id: "pr_004",
    chit_id: "chit_104",
    full_name: "Priya Menon",
    payout_month: "May 2025",
    email: "priya.menon@example.com",
    requested_on: new Date("2025-03-18"),
    is_rejected: false,
    is_approved: false,
    rejected_on: "",
    approved_on: "",
  },
  {
    id: "pr_005",
    chit_id: "chit_105",
    full_name: "Arjun Nair",
    payout_month: "January 2025",
    email: "arjun.nair@example.com",
    requested_on: new Date("2024-12-28"),
    is_rejected: false,
    is_approved: true,
    rejected_on: "",
    approved_on: "2025-01-02",
  },
];

export function PayoutRequestsButton() {
  return (
    <Popover>
      <Tooltip>
        <TooltipTrigger asChild>
          <PopoverTrigger asChild>
            <Button size={"icon"} variant={"outline"}>
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
        <ScrollArea className="w-full h-full pr-4 pb-4">
          {fakePayoutRequests.map((payoutRequest) => (
            <PayoutRequestCard
              payoutRequest={payoutRequest}
              key={payoutRequest.id}
            />
          ))}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
