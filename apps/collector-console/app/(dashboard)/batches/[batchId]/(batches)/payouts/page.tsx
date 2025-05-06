import SearchInput from "@/components/search-input";
import { Button } from "@cmt/ui/components/button";
import { PlusCircleIcon } from "lucide-react";
import { PayoutRequestsButton } from "@/components/payout-requests-popover";
import { SelectPayoutPersonDialog } from "@/components/dialogs/add-payout-dialog";
import { DataTableClient } from "./datatable-client";
import SearchClient from "./search-client";

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
          <SelectPayoutPersonDialog>
            <Button>
              <PlusCircleIcon />
              Add Payout
            </Button>
          </SelectPayoutPersonDialog>
          <PayoutRequestsButton />
        </div>
      </div>

      <SearchClient />

      <DataTableClient />
    </div>
  );
}
