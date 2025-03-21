import { DataTable } from "@/components/data-table";
import { Input } from "@cmt/ui/components/input";
import { PlusCircleIcon, SearchIcon } from "lucide-react";
import { columns, Subscriber } from "./columns";
import { Button } from "@cmt/ui/components/button";
import AddSubscribersDialog from "@/components/dialogs/add-subscribers-dialog";

const data: Subscriber[] = [
  {
    id: "1",
    chit_id: "#738392J",
    email: "jhon@gmail.com",
    full_name: "Jhon Abraham",
    commision_rate: "2%",
    joined_on: new Date(2024, 2, 12),
  },
  {
    id: "1",
    chit_id: "#738392J",
    email: "jhon@gmail.com",
    full_name: "Jhon Abraham",
    commision_rate: "2%",
    joined_on: new Date(2024, 2, 12),
  },
  {
    id: "1",
    chit_id: "#738392J",
    email: "jhon@gmail.com",
    full_name: "Jhon Abraham",
    commision_rate: "2%",
    joined_on: new Date(2024, 2, 12),
  },
];

export default function Page() {
  return (
    <div className="flex flex-col gap-8 text-2xl h-svh">
      <div className="inline-flex justify-between items-center">
        <div>
          <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
            Subscribers
          </h3>
          <p className="text-sm text-muted-foreground">
            All subscribers for this batch
          </p>
        </div>
        <AddSubscribersDialog>
          <Button>
            <PlusCircleIcon />
            Add Subscribers
          </Button>
        </AddSubscribersDialog>
      </div>

      <div className="relative flex w-[600px] items-center">
        <SearchIcon className="absolute ml-2.5 mr-2.5 size-4 text-muted-foreground" />
        <Input placeholder="Search..." className="h-10 ps-8" />
      </div>
      <DataTable columns={columns} data={data} />
    </div>
  );
}
