import SearchInput from "@/components/search-input";
import { Button } from "@cmt/ui/components/button";
import { BellIcon, PlusCircleIcon } from "lucide-react";
import { columns, Payout } from "./columns";
import { DataTable } from "@/components/data-table";

const data: Payout[] = [
  {
    id: "hellowiiddkejkeje",
    amount: "20000",
    chit_id: "#28273892",
    email: "huno@gmail.com",
    status: "Disbursed",
    payout_month: "1. March 2024",
    full_name: "Hunaid",
    joined_on: new Date(2025, 3, 10),
  },
  {
    id: "hellowiiddkejkeje",
    amount: "20000",
    chit_id: "#28273892",
    email: "huno@gmail.com",
    status: "Disbursed",
    payout_month: "1. March 2024",
    full_name: "Hunaid",
    joined_on: new Date(2024, 3, 1),
  },
  {
    id: "hellowiiddkejkeje",
    amount: "20000",
    chit_id: "#28273892",
    email: "huno@gmail.com",
    status: "Approved",
    payout_month: "1. March 2024",
    full_name: "Hunaid",
    joined_on: new Date(2025, 2, 1),
  },
  {
    id: "hellowiiddkejkeje",
    amount: "20000",
    chit_id: "#28273892",
    email: "huno@gmail.com",
    status: "Disbursed",
    payout_month: "1. March 2024",
    full_name: "Hunaid",
    joined_on: new Date(2024, 3, 1),
  },
  {
    id: "hellowiiddkejkeje",
    amount: "20000",
    chit_id: "#28273892",
    email: "huno@gmail.com",
    status: "Approved",
    payout_month: "1. March 2024",
    full_name: "Hunaid",
    joined_on: new Date(2024, 3, 1),
  },
  {
    id: "hellowiiddkejkeje",
    amount: "20000",
    chit_id: "#28273892",
    email: "huno@gmail.com",
    status: "Disbursed",
    payout_month: "1. March 2024",
    full_name: "Hunaid",
    joined_on: new Date(2024, 3, 1),
  },
];
export default function Page() {
  return (
    <div className="flex flex-col gap-8 text-2xl">
      {/* Chit Fund Title */}
      <div className="flex justify-between">
        <div>
          <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
            Payouts
          </h3>
          <p className="text-sm text-muted-foreground">
            All payouts done or approved in this batch
          </p>
        </div>

        <div className="space-x-2">
          <Button>
            <PlusCircleIcon />
            Add Payout
          </Button>
          <Button size={"icon"} className="size-9.5" variant={"outline"}>
            <BellIcon />
          </Button>
        </div>
      </div>

      <SearchInput placeholder="Search..." className="w-[600px]" />

      <DataTable columns={columns} data={data} />
    </div>
  );
}
