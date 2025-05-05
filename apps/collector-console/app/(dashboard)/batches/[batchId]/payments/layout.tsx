import { createQueryClient } from "@/trpc/query-client";
import { trpc } from "@/trpc/server";
import { ScrollArea } from "@cmt/ui/components/scroll-area";
import { SearchParams } from "nuqs/server";
import { RunwayList } from "./runway-list";

export default async function Layout({
  children,
  params,
  searchParams,
}: {
  children: React.ReactNode;
  params: Promise<{ batchId: string }>;
  searchParams: Promise<SearchParams>;
}) {
  const queryClient = createQueryClient();
  const { batchId } = await params;
  const runway = await queryClient.fetchQuery(
    trpc.payments.getRunway.queryOptions({ batchId })
  );

  return (
    <section className="w-full flex h-svh overflow-hidden">
      <ScrollArea className="flex-1">
        <div className="flex-1 pr-4 py-8">{children}</div>
      </ScrollArea>
      <ScrollArea className="h-full w-[250px] max-h-svh border-l">
        <aside className=" w-full flex flex-col gap-4 py-8">
          <div className="px-4">
            <p className="text-xl">Months</p>
            <p className="text-sm text-muted-foreground">
              Runway of months for your current batch
            </p>
          </div>

          <RunwayList runway={runway} />
        </aside>
      </ScrollArea>
    </section>
  );
}
