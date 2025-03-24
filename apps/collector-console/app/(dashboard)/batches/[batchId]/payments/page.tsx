import { DataTable } from "@/components/data-table";
import { columns, Payment } from "./columns";
import SearchInput from "@/components/search-input";
import { Button } from "@cmt/ui/components/button";
import { PlusCircleIcon, SquareIcon } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
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

const data: Payment[] = [
  {
    id: "1",
    chit_id: "#738392J",
    email: "jhon@gmail.com",
    full_name: "Jhon Abraham",
    subscription_amount: "3000",
    status: "Paid",
    paid_on: new Date(2024, 2, 12),
  },
  {
    id: "1",
    chit_id: "#738392J",
    email: "jhon@gmail.com",
    full_name: "Jhon Abraham",
    subscription_amount: "2000",
    status: "Not Paid",
    paid_on: new Date(2024, 2, 12),
  },
  {
    id: "1",
    chit_id: "#738392J",
    email: "jhon@gmail.com",
    full_name: "Jhon Abraham",
    subscription_amount: "4000",
    status: "Paid",
    paid_on: new Date(2024, 2, 12),
  },
];

export default function Page() {
  return (
    <div className="flex flex-col gap-8 text-2xl">
      <div>
        <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
          Payments
        </h3>
        <p className="text-sm text-muted-foreground">
          All payments done in this batch and selected month
        </p>
      </div>

      <div className="inline-flex gap-2 items-center">
        <SearchInput placeholder="Search..." className="ml-0.5 w-[600px]" />

        <Popover>
          <PopoverTrigger asChild>
            <Button variant={"outline"} className="border-dashed">
              <PlusCircleIcon />
              Status
            </Button>
          </PopoverTrigger>
          <PopoverContent className="p-0 max-w-[180px]">
            <Command>
              <CommandInput placeholder="Search..." />
              <CommandList className="p-1">
                <CommandEmpty>No Results Found.</CommandEmpty>
                <CommandItem asChild>
                  <Button className="w-full justify-start" variant={"ghost"}>
                    <Checkbox id="paid" /> <label htmlFor="paid">Paid</label>
                  </Button>
                </CommandItem>
                <CommandItem asChild>
                  <Button className="w-full justify-start" variant={"ghost"}>
                    <Checkbox id="not-paid" />{" "}
                    <label htmlFor="not-paid">Not Paid</label>
                  </Button>
                </CommandItem>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
      <DataTable columns={columns} data={data} />
    </div>
  );
}
