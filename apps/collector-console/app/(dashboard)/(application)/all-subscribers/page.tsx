import { DataTableClient } from "./datatable-client";
import SearchClient from "./search-client";

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
      <SearchClient />
      <DataTableClient />
    </div>
  );
}
