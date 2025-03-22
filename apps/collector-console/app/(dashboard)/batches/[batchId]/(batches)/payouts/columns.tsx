"use client";

import EditCommisionsDialog from "@/components/dialogs/edit-commission-dialog";
import PaymentHistoryDialog from "@/components/dialogs/payment-history-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@cmt/ui/components/avatar";
import { Badge } from "@cmt/ui/components/badge";
import { Button } from "@cmt/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@cmt/ui/components/dropdown-menu";
import { ColumnDef } from "@tanstack/react-table";
import { formatDistanceToNowStrict } from "date-fns";
import {
  MoreHorizontal,
  PercentIcon,
  ScrollTextIcon,
  Trash2Icon,
} from "lucide-react";
import Link from "next/link";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Payout = {
  id: string;
  chit_id: string;
  full_name: string;
  payout_month: string;
  amount: string;
  status: "Disbursed" | "Approved";
  email: string;
  joined_on: Date;
};

export const columns: ColumnDef<Payout>[] = [
  {
    accessorKey: "id",
    header: "Subscriber",
    cell(props) {
      const row = props.row.original;
      return (
        <div className="inline-flex gap-2">
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>S</AvatarFallback>
          </Avatar>
          <div>
            <Link
              className="hover:underline"
              href={`/all-subscribers/s/${row.id}`}
            >
              <span>{row.full_name}</span>
            </Link>
            <p className="text-muted-foreground text-sm">{row.chit_id}</p>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "payout_month",
    header: "Payout Amount",
    cell(props) {
      return (
        <div className="font-bold">₹{props.row.original.payout_month}</div>
      );
    },
  },
  {
    accessorKey: "amount",
    header: "Subscription Amount",
    cell(props) {
      return <div className="font-bold">₹{props.row.original.amount}</div>;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell(props) {
      const row = props.row.original;

      if (row.status === "Disbursed") return <Badge>Disbursed</Badge>;
      else if (row.status === "Approved")
        return <Badge variant={"secondary"}>Approved</Badge>;
    },
  },
  {
    accessorKey: "joined_on",
    header(props) {
      return <div className="text-right font-bold">Joined On</div>;
    },
    cell(props) {
      return (
        <div className="text-right">
          <time className="text-sm text-muted-foreground">
            {formatDistanceToNowStrict(props.row.original.joined_on, {
              addSuffix: true,
            })}
          </time>
        </div>
      );
    },
  },
  {
    id: "more-actions",
    cell(props) {
      return (
        <div className="text-right px-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size={"icon"} variant={"ghost"}>
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <PaymentHistoryDialog>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                  <ScrollTextIcon /> View Details
                </DropdownMenuItem>
              </PaymentHistoryDialog>

              {props.row.original.status === "Approved" && (
                <EditCommisionsDialog>
                  <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                    <PercentIcon />
                    Make Payout
                  </DropdownMenuItem>
                </EditCommisionsDialog>
              )}

              <DropdownMenuItem variant="destructive">
                <Trash2Icon />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];
