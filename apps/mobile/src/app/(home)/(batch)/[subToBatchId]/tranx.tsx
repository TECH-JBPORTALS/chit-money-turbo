import React, { useMemo } from "react";
import { View } from "react-native";
import { Card, CardHeader, CardTitle } from "~/components/ui/card";
import { Text } from "~/components/ui/text";
import { Large, Muted, Small } from "~/components/ui/typography";
import { PayoutStatusBadge } from "~/lib/payout-badge";
import { cn } from "~/lib/utils";
import { ArrowDownLeft } from "~/lib/icons/ArrowDownLeft";
import { ArrowUpRight } from "~/lib/icons/ArrowUpRight";
import { FlashList } from "@shopify/flash-list";
import { useInfiniteQuery } from "@tanstack/react-query";
import { trpc } from "~/utils/api";
import { SpinnerView } from "~/components/spinner-view";
import Spinner from "~/components/ui/spinner";
import { format } from "date-fns";
import { useLocalSearchParams } from "expo-router";
import Animated, { FadeInDown } from "react-native-reanimated";
import { ArrowLeftRight } from "~/lib/icons/ArrowLeftRight";
import {
  RetryView,
  RetryViewButton,
  RetryViewDescription,
  RetryViewIcon,
  RetryViewTitle,
} from "~/components/retry-view";

// Types for transaction
type TransactionType = "payment" | "payout";
type TransactionStatus = "requested" | "completed";

interface Transaction {
  id: number;
  type: TransactionType;
  date: string;
  amount: number;
  status?: TransactionStatus;
  monthNumber?: number;
  totalMonth?: number;
  credit_score_affected?: number;
}

export default function Tranx() {
  const { subToBatchId } = useLocalSearchParams<{ subToBatchId: string }>();

  const {
    data: transactions,
    isLoading,
    refetch,
    isError,
    isRefetching,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery(
    trpc.transactions.getInfinitiyOfSubscriber.infiniteQueryOptions(
      { subToBatchId },
      {
        initialCursor: undefined,
        getNextPageParam: ({ nextCursor }) => nextCursor,
      }
    )
  );

  const transactionItems = isLoading
    ? []
    : transactions?.pages.flatMap((t) => t.items);

  if (isLoading || isRefetching) return <SpinnerView />;

  if (isError)
    return (
      <RetryView>
        <RetryViewIcon />
        <RetryViewTitle />
        <RetryViewDescription>
          Our application got crashed, try again sometimes later.
        </RetryViewDescription>
        <RetryViewButton onPress={() => refetch()}>
          <Text>Retry</Text>
        </RetryViewButton>
      </RetryView>
    );

  return (
    <View className="flex-1 h-svh mt-5">
      <FlashList
        data={transactionItems}
        renderItem={({ item }) => (
          <Card className=" my-1">
            <CardHeader className="gap-3">
              <View className="gap-2 flex-row justify-between items-center">
                <CardTitle className="text-base">
                  {item.type === "payment" ? "Payment " : "Payout "}
                  {item.month ? format(item.month, "MMM yyyy") : null}
                </CardTitle>

                <View className="flex-row items-center gap-1">
                  <Small className="font-bold">
                    {item.totalAmount.toLocaleString("en-IN", {
                      currency: "INR",
                      currencyDisplay: "narrowSymbol",
                      currencySign: "standard",
                      style: "currency",
                      maximumFractionDigits: 0,
                    })}
                  </Small>
                  {item.type === "payout" ? (
                    <ArrowDownLeft
                      strokeWidth={1}
                      className="text-foreground size-5"
                    />
                  ) : (
                    <ArrowUpRight
                      strokeWidth={1}
                      className="text-foreground size-5"
                    />
                  )}
                </View>
              </View>

              <View className="flex-row justify-between items-center">
                <Muted className="text-xs">2 hours ago</Muted>

                {item.type === "payment" ? (
                  <Text
                    className={cn(
                      (item.creditScoreAffected ?? 0 > 0)
                        ? "text-primary"
                        : "text-destructive"
                    )}
                  >
                    {item.creditScoreAffected}
                  </Text>
                ) : (
                  <PayoutStatusBadge status={item.payoutStatus ?? ""} />
                )}
              </View>
            </CardHeader>
          </Card>
        )}
        showsVerticalScrollIndicator={false}
        onEndReachedThreshold={1}
        onEndReached={() => hasNextPage && fetchNextPage()}
        ListEmptyComponent={() => (
          <View className="items-center flex-1 py-20 justify-center gap-3.5">
            <Animated.View entering={FadeInDown.duration(360).springify()}>
              <ArrowLeftRight
                size={48}
                strokeWidth={1.25}
                className="text-muted-foreground"
              />
            </Animated.View>
            <Large>No Transactions, Yet</Large>
            <Muted className="text-center px-16">
              No transactions within this chit, If you have any transactions
              done you can see here
            </Muted>
          </View>
        )}
        estimatedItemSize={100}
        keyExtractor={(t) => t.transactionId}
        ListFooterComponent={() =>
          isFetchingNextPage ? (
            <View className="justify-center items-center pb-3">
              <Spinner size={28} />
            </View>
          ) : null
        }
      />
    </View>
  );
}
