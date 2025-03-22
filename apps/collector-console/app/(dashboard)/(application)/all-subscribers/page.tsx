import EmptyState from "@/components/empty-state";
import { columns, Subscriber } from "./columns";
import { DataTable } from "../../../../components/data-table";
import { Input } from "@cmt/ui/components/input";
import { SearchIcon } from "lucide-react";
import SearchInput from "@/components/search-input";

const data: Subscriber[] = [
  {
    id: "1",
    email: "jhon@gmail.com",
    full_name: "Jhon Abraham",
    credit_score: "23",
    joined_on: new Date(2024, 2, 12),
  },
  {
    id: "1",
    email: "jhon@gmail.com",
    full_name: "Jhon Abraham",
    credit_score: "23",
    joined_on: new Date(2024, 2, 12),
  },
  {
    id: "1",
    email: "jhon@gmail.com",
    full_name: "Jhon Abraham",
    credit_score: "23",
    joined_on: new Date(2024, 2, 12),
  },
];

export default function Page() {
  return (
    <div className="flex flex-col py-8 gap-6 h-full min-h-full">
      {/* Chit Fund Title */}
      <div>
        <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
          All Subscribers
        </h3>
        <p className="text-sm text-muted-foreground">
          All subscribers in this chit fund house
        </p>
      </div>

      {/** Content */}
      {/* <EmptyState
        title="No Subscribers"
        description="As soon as subscribers start participating in on of your batches they will appear over here"
      /> */}
      <SearchInput placeholder="Search..." className="w-[600px]" />
      <DataTable columns={columns} data={data} />
    </div>
  );
}
