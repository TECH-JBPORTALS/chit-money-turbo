"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import PaymentCard from "../payment-card";
import { useTRPC } from "@/trpc/react";
import { useParams } from "next/navigation";
import { Skeleton } from "@cmt/ui/components/skeleton";
import { isEmpty } from "lodash";
import { Button } from "@cmt/ui/components/button";

export function CreditHistoryList() {
  const trpc = useTRPC();
  const { subscriberId } = useParams<{ subscriberId: string }>();
  const {
    data,
    isLoading,
    isError,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery(
    trpc.payments.getCreditScoreHistory.infiniteQueryOptions(
      { subscriberId },
      {
        getNextPageParam: ({ nextCursor }) => nextCursor,
      }
    )
  );

  const credtScoreHistoryItems = data?.pages.flatMap((p) => p.items);

  if (isLoading)
    return Array.from({ length: 15 }).map((_, i) => (
      <Skeleton key={i} className="h-20 w-full" />
    ));

  if (isError)
    return (
      <div className="w-full py-10 space-y-3">
        <h3 className="text-center font-semibold text-xl">
          Couldn't able to fetch credit history, Try again later
        </h3>
        <p className="text-center text-sm text-muted-foreground">
          May be network issue at your side, or else our application crashed.
          Try again sometimes later or report
        </p>
      </div>
    );

  if (isEmpty(credtScoreHistoryItems))
    return (
      <div className="w-full py-10 space-y-3">
        <h3 className="text-center font-semibold text-xl">
          No history yet for this subscriber
        </h3>
        <p className="text-center text-sm text-muted-foreground">
          If he make any payments towards any batch subscriptions, those history
          will shown here
        </p>
      </div>
    );

  return (
    <>
      {credtScoreHistoryItems?.map((item) => (
        <PaymentCard {...item} key={item.id} />
      ))}

      {hasNextPage && (
        <Button
          variant={"outline"}
          size={"sm"}
          isLoading={isFetchingNextPage}
          onClick={() => fetchNextPage()}
        >
          Load more
        </Button>
      )}
    </>
  );
}
