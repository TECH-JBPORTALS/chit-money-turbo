"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@cmt/ui/components/avatar";
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
  ArrowUpRightIcon,
  DeleteIcon,
  MoreHorizontal,
  PercentIcon,
} from "lucide-react";
import Link from "next/link";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Subscriber = {
  id: string;
  chit_id: string;
  full_name: string;
  commision_rate: string;
  email: string;
  joined_on: Date;
};

export const columns: ColumnDef<Subscriber>[] = [
  {
    accessorKey: "chit_id",
    header: "Chit ID",
    cell(props) {
      return (
        <div className="text-sm text-muted-foreground">
          {props.row.original.chit_id}
        </div>
      );
    },
  },
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
            <Link className="hover:underline" href={`/s/${row.id}`}>
              <span>{row.full_name}</span>
            </Link>
            <p className="text-muted-foreground text-sm">{row.email}</p>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "commision_rate",
    header(props) {
      return <div className="text-right">Commision Rate</div>;
    },
    cell(props) {
      return (
        <div className="text-right font-bold">
          {props.row.original.commision_rate}
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
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size={"icon"} variant={"ghost"}>
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <ArrowUpRightIcon /> Payment History
              </DropdownMenuItem>
              <DropdownMenuItem>
                <PercentIcon />
                Edit Commision
              </DropdownMenuItem>
              <DropdownMenuItem variant="destructive">
                <DeleteIcon />
                Remove
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];
