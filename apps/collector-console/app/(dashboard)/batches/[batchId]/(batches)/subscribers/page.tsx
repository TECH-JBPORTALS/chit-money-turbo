import { PlusCircleIcon } from "lucide-react";
import { Button } from "@cmt/ui/components/button";
import AddSubscribersDialog from "@/components/dialogs/add-subscribers-dialog";
import { DataTableClient } from "./datatable-client";
import SearchClient from "./search-client";

export default function Page() {
  return (
    <div className="flex flex-col gap-8 text-2xl h-full">
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
      <SearchClient />
      <DataTableClient />
    </div>
  );
}
