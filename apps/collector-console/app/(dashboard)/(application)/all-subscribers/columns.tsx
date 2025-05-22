"use client";

import { RouterOutputs } from "@cmt/api";
import { Avatar, AvatarFallback, AvatarImage } from "@cmt/ui/components/avatar";
import { Button } from "@cmt/ui/components/button";
import { cn } from "@cmt/ui/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import { formatDistanceToNowStrict } from "date-fns";
import { MoreHorizontal } from "lucide-react";
import Link from "next/link";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Subscriber =
  RouterOutputs["subscribers"]["getOfCollector"]["items"][number];

export const columns: ColumnDef<Subscriber>[] = [
  {
    accessorKey: "id",
    header: "Subscriber",
    cell(props) {
      const row = props.row.original;
      return (
        <div className="inline-flex gap-2">
          <Avatar>
            <AvatarImage src={row.imageUrl} />
            <AvatarFallback>S</AvatarFallback>
          </Avatar>
          <div>
            <Link className="hover:underline" href={`/s/${row.id}`}>
              <span>
                {row.firstName} {row.lastName}
              </span>
            </Link>
            <p className="text-muted-foreground text-sm">
              {row.primaryEmailAddress?.emailAddress}
            </p>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "totalCreditScore",
    header() {
      return <div className="text-center">Credit Score</div>;
    },
    cell(props) {
      const totalCreditScore = props.row.original.totalCreditScore;
      return (
        <div
          className={cn(
            "text-center font-bold",
            totalCreditScore < 0 ? "text-destructive" : "text-foreground"
          )}
        >
          {totalCreditScore}
        </div>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header(props) {
      return <div className="text-right">Joined Chit.Money</div>;
    },
    cell(props) {
      return (
        <div className="text-right">
          <time className="text-sm text-muted-foreground">
            {formatDistanceToNowStrict(props.row.original.createdAt, {
              addSuffix: true,
            })}
          </time>
        </div>
      );
    },
  },
  // {
  //   id: "more-actions",
  //   cell(props) {
  //     return (
  //       <div className="text-right px-4">
  //         <Button size={"icon"} variant={"ghost"}>
  //           <MoreHorizontal />
  //         </Button>
  //       </div>
  //     );
  //   },
  // },
];
