import { DataTableClient } from "./datatable-client";
import SearchClient from "./search-client";

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

      <div className="inline-flex justify-between w-full gap-2 items-center">
        <SearchClient />
      </div>
      <DataTableClient />
    </div>
  );
}
