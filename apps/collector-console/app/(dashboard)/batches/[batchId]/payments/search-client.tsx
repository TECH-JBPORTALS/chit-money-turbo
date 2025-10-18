"use client";
import SearchInput from "@/components/search-input";
import { parseAsString, useQueryState } from "nuqs";
import React from "react";
import { Button } from "@cmt/ui/components/button";
import { PlusCircleIcon } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "@cmt/ui/components/command";
import { Checkbox } from "@cmt/ui/components/checkbox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@cmt/ui/components/popover";
import { Tabs, TabsList, TabsTrigger } from "@cmt/ui/components/tabs";

export default function SearchClient() {
  const [query, setQuery] = useQueryState(
    "q",
    parseAsString.withOptions({ clearOnDefault: true }).withDefault("")
  );
  const [paymentStatus, setPaymentStatus] = useQueryState(
    "stat",
    parseAsString.withOptions({ clearOnDefault: true }).withDefault("all")
  );

  return (
    <React.Fragment>
      <SearchInput
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search..."
        className="w-[600px]"
        value={query}
      />

      <Tabs value={paymentStatus} onValueChange={(v) => setPaymentStatus(v)}>
        <TabsList>
          <TabsTrigger value="all">All Payments</TabsTrigger>
          <TabsTrigger value="not-paid">Not Paid</TabsTrigger>
        </TabsList>
      </Tabs>
    </React.Fragment>
  );
}
