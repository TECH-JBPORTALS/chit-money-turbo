"use client";
import { AddPayoutDialog } from "@/components/dialogs/add-payout-dialog";
import { ViewPayoutDialog } from "@/components/dialogs/view-payout-dialog";
import { RouterOutputs } from "@cmt/api";
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
import { format, formatDate } from "date-fns";
import {
  ArrowUpRightIcon,
  MoreHorizontal,
  PercentIcon,
  ScrollTextIcon,
  Trash2Icon,
} from "lucide-react";
import Link from "next/link";

export const columns: ColumnDef<
  RouterOutputs["payouts"]["ofBatch"]["items"][number]
>[] = [
  {
    accessorKey: "id",
    header: "Subscriber",
    cell(props) {
      const row = props.row.original;
      return (
        <div className="inline-flex gap-2 h-12">
          <Avatar>
            <AvatarImage src={row.subscriber.imageUrl} />
            <AvatarFallback>
              {row.subscriber.firstName?.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div>
            <Link className="hover:underline" href={`/s/${row.id}`}>
              <span>
                {row.subscriber.firstName} {row.subscriber.lastName}
              </span>
            </Link>
            <p className="text-muted-foreground text-sm">
              {row.subscribersToBatches.chitId}
            </p>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "payout_month",
    header: "Payout Month",
    cell(props) {
      return (
        <div className="font-bold">
          {formatDate(props.row.original.month, "MMMM yyyy")}
        </div>
      );
    },
  },
  {
    accessorKey: "amount",
    header: () => <div className="text-right">Payout Amount</div>,
    cell(props) {
      return (
        <div className="font-bold text-right">₹{props.row.original.amount}</div>
      );
    },
  },
  {
    accessorKey: "status",
    header: () => <div className="text-right">Status</div>,
    cell(props) {
      const row = props.row.original;

      if (row.payoutStatus === "disbursed")
        return (
          <div className="text-right">
            <Badge>Disbursed</Badge>
          </div>
        );
      else if (row.payoutStatus === "approved")
        return (
          <div className="text-right">
            <Badge variant={"secondary"}>Approved</Badge>
          </div>
        );
    },
  },
  {
    accessorKey: "joined_on",
    header(props) {
      return <div className="text-right font-bold">Created At</div>;
    },
    cell(props) {
      return (
        <div className="text-right">
          <time className="text-sm text-muted-foreground">
            {format(props.row.original.createdAt, "dd MMM, yyyy")}
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
              <ViewPayoutDialog payoutId={props.row.original.id}>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                  <ScrollTextIcon /> View Details
                </DropdownMenuItem>
              </ViewPayoutDialog>

              {props.row.original.payoutStatus === "approved" && (
                <AddPayoutDialog data={props.row.original}>
                  <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                    <ArrowUpRightIcon />
                    Make Payout
                  </DropdownMenuItem>
                </AddPayoutDialog>
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
