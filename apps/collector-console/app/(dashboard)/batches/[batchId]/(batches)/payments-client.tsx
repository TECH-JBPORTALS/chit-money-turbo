"use client";

import { AddPaymentDialog } from "@/components/dialogs/add-payemnt-dialog";
import EmptyState from "@/components/empty-state";
import { SpinnerPage } from "@/components/spinner-page";
import { useTRPC } from "@/trpc/react";
import { Avatar, AvatarFallback, AvatarImage } from "@cmt/ui/components/avatar";
import { Badge } from "@cmt/ui/components/badge";
import { Button } from "@cmt/ui/components/button";
import { ScrollArea } from "@cmt/ui/components/scroll-area";
import { useInfiniteQuery } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { PlusIcon } from "lucide-react";
import { useSearchParams } from "next/navigation";

export function ThisMonthPayouts({ batchId }: { batchId: string }) {
  const trpc = useTRPC();
  const searchParams = useSearchParams();
  const query = searchParams.get("q") ?? "";
  const { data, isLoading, fetchNextPage, isFetchingNextPage, hasNextPage } =
    useInfiniteQuery(
      trpc.payments.ofBatchThisMonth.infiniteQueryOptions(
        {
          batchId,
          query,
        },
        {
          getNextPageParam: ({ nextCursor }) => nextCursor,
        }
      )
    );

  const items = data?.pages.flatMap((p) => p.items);

  if (isLoading) return <SpinnerPage className="min-h-full" />;

  if (!data)
    return (
      <EmptyState
        title="Can't Get Payments"
        description="Couldn't able to fetch payments at this time"
      />
    );

  return (
    <ScrollArea className="h-full pr-4 ">
      {items?.map((s) => (
        <div key={s.id} className="flex items-center justify-between py-2">
          <div className="flex items-center gap-2">
            <Avatar className="border-3 border-card size-10">
              <AvatarImage src={s.subscriber.imageUrl} alt="@shadcn" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div>
              <b>
                {s.subscriber.firstName} {s.subscriber.lastName}
              </b>
              <p className="text-sm text-muted-foreground">{s.chitId}</p>
            </div>
          </div>
          <div className="flex-1 flex justify-end px-8">
            <Badge variant={"secondary"}>
              {s.payment.subscriptionAmount.toLocaleString("en-IN", {
                style: "currency",
                currency: "INR",
                maximumFractionDigits: 0,
              })}
            </Badge>
          </div>
          <div className="w-32 text-right">
            {s.payment.status === "not paid" ? (
              <AddPaymentDialog
                data={{
                  payment: s.payment,
                  subscriber: s.subscriber,
                  chitId: s.chitId,
                  id: s.id,
                }}
              >
                <Button variant={"secondary"}>
                  <PlusIcon /> Collect
                </Button>
              </AddPaymentDialog>
            ) : (
              <p className="text-xs text-muted-foreground text-right">
                Updated{" "}
                {formatDistanceToNow(s.payment.updatedAt!, { addSuffix: true })}
              </p>
            )}
          </div>
        </div>
      ))}
      {hasNextPage && (
        <div className="flex items-center justify-center">
          <Button
            onClick={() => fetchNextPage()}
            variant={"outline"}
            isLoading={isFetchingNextPage}
            size={"sm"}
          >
            Load more
          </Button>
        </div>
      )}
    </ScrollArea>
  );
}
