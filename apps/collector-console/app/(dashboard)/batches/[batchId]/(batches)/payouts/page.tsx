import SearchInput from "@/components/search-input";
import { Button } from "@cmt/ui/components/button";
import { BellIcon, PlusCircleIcon } from "lucide-react";

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
    </div>
  );
}
