import { Circle } from "lucide-react";
import { ScrollArea } from "@cmt/ui/components/scroll-area";
import { CreditHistoryList } from "./credit-history-list";
import { createQueryClient } from "@/trpc/query-client";
import { trpc } from "@/trpc/server";
import { cn } from "@cmt/ui/lib/utils";

export default async function Page({
  params,
}: {
  params: Promise<{ subscriberId: string }>;
}) {
  const queryClient = createQueryClient();
  const { subscriberId } = await params;
  const csMeta = await queryClient.fetchQuery(
    trpc.payments.getCreditScoreMeta.queryOptions({ subscriberId })
  );

  const total =
    csMeta.prePaymentsCount +
    csMeta.onTimePaymentsCount +
    csMeta.latePaymentsCount;

  const preRatio = csMeta.prePaymentsCount / total || 0.01;
  const onTimeRatio = csMeta.onTimePaymentsCount / total || 0.01;
  const lateRatio = csMeta.latePaymentsCount / total || 0.01;

  return (
    <ScrollArea className="w-[384px] max-h-svh border-l  ">
      <aside className="h-full px-4 py-8 flex flex-col gap-3">
        <div>
          <p className="text-xl ">Credit Score</p>
          <p className="text-sm text-muted-foreground">
            Current credit score for this subscriber and history
          </p>
        </div>

        <h1 className="scroll-m-20 text-center text-4xl font-extrabold tracking-tight lg:text-5xl">
          {csMeta.totalCreditScore}
        </h1>
        <div className="flex gap-0.5">
          <div
            style={{ flex: preRatio }}
            className={cn("w-full rounded-sm bg-primary/20 h-8")}
          />
          <div
            style={{ flex: onTimeRatio }}
            className={cn("w-full rounded-sm bg-primary h-8")}
          />
          <div
            style={{ flex: lateRatio }}
            className={cn("w-full rounded-sm bg-destructive h-8")}
          />
        </div>
        <div className="text-center space-x-2">
          <p className="inline-flex items-center gap-1 text-xs text-muted-foreground">
            <span>
              <Circle className="fill-primary/20 size-2 text-transparent" />
            </span>
            {csMeta.prePaymentsCount} Pre Payments
          </p>

          <p className="inline-flex items-center gap-1 text-xs text-muted-foreground">
            <span>
              <Circle className="fill-primary size-2 text-transparent" />
            </span>
            {csMeta.onTimePaymentsCount} On-Time Payments
          </p>

          <p className="inline-flex items-center gap-1 text-xs text-muted-foreground">
            <span>
              <Circle className="fill-destructive size-2 text-transparent" />
            </span>
            {csMeta.latePaymentsCount} Late Payments
          </p>
        </div>

        <CreditHistoryList />
      </aside>
    </ScrollArea>
  );
}
