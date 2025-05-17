import { RefreshControl, View } from "react-native";
import { Large, Muted, Small } from "~/components/ui/typography";
import { cn } from "~/lib/utils";
import { useInfiniteQuery } from "@tanstack/react-query";
import { trpc } from "~/utils/api";
import { format } from "date-fns";
import { SpinnerView } from "~/components/spinner-view";
import {
  RetryView,
  RetryViewButton,
  RetryViewDescription,
  RetryViewIcon,
  RetryViewTitle,
} from "~/components/retry-view";
import { Text } from "~/components/ui/text";
import Animated, { FadeInDown } from "react-native-reanimated";
import React from "react";
import { CircleDivide } from "~/lib/icons/CircleDivide";
import { FlashList } from "@shopify/flash-list";
import { CreditScoreMeta } from "~/components/credit-score-meta";
import Spinner from "~/components/ui/spinner";

export default function CreditScore() {
  const {
    data,
    isLoading,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    isError,
    isRefetching,
    refetch,
  } = useInfiniteQuery(
    trpc.payments.getCreditScoreHistory.infiniteQueryOptions(
      { limit: 20 },
      {
        getNextPageParam: ({ nextCursor }) => nextCursor,
      }
    )
  );

  const items = data?.pages.flatMap((p) => p.items);

  if (isLoading || isRefetching) return <SpinnerView />;

  if (isError)
    return (
      <RetryView>
        <RetryViewIcon />
        <RetryViewTitle />
        <RetryViewDescription className="text-center">
          {`May be poyout details doesn't exits, or may be our code broke. Try again sometime later`}
        </RetryViewDescription>
        <RetryViewButton onPress={() => refetch()}>
          <Text>Try again</Text>
        </RetryViewButton>
      </RetryView>
    );

  return (
    <View className="flex-1">
      <FlashList
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={() => refetch()}
          />
        }
        progressViewOffset={12}
        showsVerticalScrollIndicator={false}
        centerContent
        ListHeaderComponent={<CreditScoreMeta />}
        estimatedItemSize={80}
        data={items}
        onEndReachedThreshold={0.5}
        onEndReached={() => hasNextPage && fetchNextPage()}
        ListEmptyComponent={() => (
          <View className="h-[100vh] pb-20 flex-1 gap-3.5 items-center justify-center">
            {isLoading ? (
              <SpinnerView />
            ) : (
              <View className="items-center flex-1 justify-center gap-3.5">
                <Animated.View entering={FadeInDown.duration(360).springify()}>
                  <CircleDivide
                    size={48}
                    strokeWidth={1.25}
                    className="text-muted-foreground"
                  />
                </Animated.View>
                <Large>No credit score history, yet</Large>
                <Muted className="text-center px-16">
                  If you make any payments towards any chit payment based on
                  that credit score will be defined, either pre, on-time, late.
                  Those affected history will be shown here.
                </Muted>
              </View>
            )}
          </View>
        )}
        keyExtractor={(b) => b.id}
        ListFooterComponent={() =>
          isFetchingNextPage ? (
            <View className="justify-center items-center pb-3">
              <Spinner size={28} />
            </View>
          ) : null
        }
        renderItem={({ item }) => (
          <View className="flex-row py-2 items-center justify-between">
            {item.paidOn ? (
              <Muted>{format(item.paidOn, "dd MMM, yyyy")}</Muted>
            ) : null}
            <Small
              className={cn(
                "text-base",
                item.creditScoreAffected > 0
                  ? "text-primary"
                  : "text-destructive"
              )}
            >
              {item.creditScoreAffected.toLocaleString("en-IN", {
                signDisplay: "exceptZero",
              })}
            </Small>
          </View>
        )}
      />
    </View>
  );
}
