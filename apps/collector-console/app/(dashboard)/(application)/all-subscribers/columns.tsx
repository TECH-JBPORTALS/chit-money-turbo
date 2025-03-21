"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@cmt/ui/components/avatar";
import { Button } from "@cmt/ui/components/button";
import { ColumnDef } from "@tanstack/react-table";
import { formatDistanceToNowStrict } from "date-fns";
import { MoreHorizontal } from "lucide-react";
import Link from "next/link";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Subscriber = {
  id: string;
  full_name: string;
  credit_score: string;
  email: string;
  joined_on: Date;
};

export const columns: ColumnDef<Subscriber>[] = [
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
            <p className="text-muted-foreground text-sm">{row.email}</p>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "credit_score",
    header(props) {
      return <div className="text-right">Credit Score</div>;
    },
    cell(props) {
      return (
        <div className="text-right font-bold">
          {props.row.original.credit_score}
        </div>
      );
    },
  },
  {
    accessorKey: "joined_on",
    header(props) {
      return <div className="text-right">Joined On</div>;
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
          <Button size={"icon"} variant={"ghost"}>
            <MoreHorizontal />
          </Button>
        </div>
      );
    },
  },
];
