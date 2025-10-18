"use client";

import DeletePaymentAlertDialog from "@/components/alert-dialogs/delete-payment-alertdialog";
import { AddPaymentDialog } from "@/components/dialogs/add-payemnt-dialog";
import { ViewPaymentDialog } from "@/components/dialogs/view-payment-dialog";
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
import { formatDistanceToNowStrict } from "date-fns";
import {
  DeleteIcon,
  MoreHorizontal,
  PlusIcon,
  ScrollTextIcon,
} from "lucide-react";
import Link from "next/link";

export const columns: ColumnDef<
  RouterOutputs["payments"]["ofBatchSelectedRunway"]["items"][number]
>[] = [
  {
    accessorKey: "id",
    header: "Subscriber",
    cell(props) {
      const row = props.row.original;
      return (
        <div className="inline-flex gap-2">
          <Avatar>
            <AvatarImage src={row.subscriber.imageUrl} />
            <AvatarFallback>
              {row.subscriber.firstName?.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div>
            <Link className="hover:underline" href={`/s/${row.subscriberId}`}>
              <span>
                {row.subscriber.firstName} {row.subscriber.lastName}
              </span>
            </Link>
            <p className="text-muted-foreground text-sm">{row.chitId}</p>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "subscription_amount",
    header: "Subscription Amount",
    cell(props) {
      return (
        <div className="font-bold">
          {props.row.original.payment.subscriptionAmount.toLocaleString(
            "en-IN",
            {
              currencyDisplay: "symbol",
              currency: "INR",
              maximumFractionDigits: 0,
              style: "currency",
            }
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: () => <div className="text-center">Status</div>,
    cell(props) {
      const row = props.row.original;

      return (
        <div className="text-center">
          {row.payment.status === "paid" ? (
            <Badge>Paid</Badge>
          ) : (
            <Badge variant={"outline"}>Not Paid</Badge>
          )}
        </div>
      );
    },
  },
  {
    id: "key",
    cell(props) {
      const original = props.row.original;
      return (
        <div className="text-right">
          {original.payment.status === "not-paid" ? (
            <AddPaymentDialog
              data={{
                payment: original.payment,
                runwayDate: original.payment.runwayDate,
                chitId: original.chitId,
                subscriberToBatchId: original.id,
                subscriber: original.subscriber,
              }}
            >
              <Button variant={"secondary"}>
                <PlusIcon /> Collect
              </Button>
            </AddPaymentDialog>
          ) : (
            <time className="text-sm text-muted-foreground">
              {formatDistanceToNowStrict(
                props.row.original!.payment!.createdAt!,
                {
                  addSuffix: true,
                }
              )}
            </time>
          )}
        </div>
      );
    },
  },
  {
    id: "more-actions",
    header(props) {
      return <div className="w-[60px]" />;
    },
    cell(props) {
      if (props.row.original.payment.id)
        return (
          <div className="text-right px-4">
            <DropdownMenu key={"payment-dropdown"}>
              <DropdownMenuTrigger asChild>
                <Button size={"icon"} variant={"ghost"}>
                  <MoreHorizontal />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <ViewPaymentDialog paymentId={props.row.original.payment.id}>
                  <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                    <ScrollTextIcon /> View Details
                  </DropdownMenuItem>
                </ViewPaymentDialog>
                <DeletePaymentAlertDialog
                  paymentId={props.row.original.payment.id}
                >
                  <DropdownMenuItem
                    onSelect={(e) => e.preventDefault()}
                    variant="destructive"
                  >
                    <DeleteIcon />
                    Remove
                  </DropdownMenuItem>
                </DeletePaymentAlertDialog>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
    },
  },
];
