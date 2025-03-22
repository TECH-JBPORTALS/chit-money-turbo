import { DataTable } from "@/components/data-table";
import { columns, Payment } from "./columns";
import SearchInput from "@/components/search-input";

const data: Payment[] = [
  {
    id: "1",
    chit_id: "#738392J",
    email: "jhon@gmail.com",
    full_name: "Jhon Abraham",
    subscription_amount: "3000",
    status: "Paid",
    joined_on: new Date(2024, 2, 12),
  },
  {
    id: "1",
    chit_id: "#738392J",
    email: "jhon@gmail.com",
    full_name: "Jhon Abraham",
    subscription_amount: "2000",
    status: "Not Paid",
    joined_on: new Date(2024, 2, 12),
  },
  {
    id: "1",
    chit_id: "#738392J",
    email: "jhon@gmail.com",
    full_name: "Jhon Abraham",
    subscription_amount: "4000",
    status: "Paid",
    joined_on: new Date(2024, 2, 12),
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

      <SearchInput placeholder="Search..." className="ml-0.5 w-[600px]" />
      <DataTable columns={columns} data={data} />
    </div>
  );
}
