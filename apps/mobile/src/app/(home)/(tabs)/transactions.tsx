import { RefreshControl, TouchableOpacity, View } from "react-native";
import { LinearBlurView } from "~/components/linear-blurview";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Card, CardFooter, CardHeader, CardTitle } from "~/components/ui/card";
import { Text } from "~/components/ui/text";
import { H2, Large, Muted, Small } from "~/components/ui/typography";
import { cn } from "~/lib/utils";
import { ArrowDownLeft } from "~/lib/icons/ArrowDownLeft";
import { ArrowUpRight } from "~/lib/icons/ArrowUpRight";
import { SearchX } from "~/lib/icons/SearchX";
import { ArrowLeftRight } from "~/lib/icons/ArrowLeftRight";
import { PayoutStatusBadge } from "~/lib/payout-badge";
import { useRouter } from "expo-router";
import { useInfiniteQuery } from "@tanstack/react-query";
import { trpc } from "~/utils/api";
import { SpinnerView } from "~/components/spinner-view";
import { FlashList } from "@shopify/flash-list";
import SearchInput from "~/components/search-input";
import { Badge } from "~/components/ui/badge";
import React, { memo, useState } from "react";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useDebounce } from "@uidotdev/usehooks";
import Spinner from "~/components/ui/spinner";
import { formatDistanceToNowStrict } from "date-fns";

export default function Transactions() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilterType, setFilterType] = useState<"payouts" | "all">(
    "all"
  );

  const debouncedQuery = useDebounce(searchQuery, 800);
  const router = useRouter();

  const {
    data: transactions,
    isLoading,
    refetch,
    isRefetching,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery(
    trpc.transactions.getInfinitiyOfSubscriber.infiniteQueryOptions(
      { type: selectedFilterType },
      {
        initialCursor: undefined,
        getNextPageParam: ({ nextCursor }) => nextCursor,
      }
    )
  );

  const transactionItems = isLoading
    ? []
    : transactions?.pages.flatMap((t) => t.items);

  const Filters = () => (
    <View className="flex-row gap-2">
      {(["all", "payouts"] as const).map((filterType) => (
        <TouchableOpacity
          onPress={() => {
            setFilterType(filterType);
          }}
          key={filterType}
        >
          <Badge
            className="px-3.5 py-1.5"
            variant={selectedFilterType === filterType ? "default" : "outline"}
          >
            <Text className="text-sm">
              {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
            </Text>
          </Badge>
        </TouchableOpacity>
      ))}
    </View>
  );

  const MemoizedFilters = memo(Filters);

  return (
    <LinearBlurView>
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
        ListHeaderComponent={
          <View className="gap-3.5 pb-4">
            <H2>All Transactions</H2>

            {/** Search Bar */}
            <SearchInput
              value={searchQuery}
              onChangeText={(text) => setSearchQuery(text)}
            />

            {/** Filters */}
            <MemoizedFilters />
          </View>
        }
        estimatedItemSize={148}
        data={transactionItems}
        onEndReachedThreshold={1}
        onEndReached={() => hasNextPage && fetchNextPage()}
        ListEmptyComponent={() => (
          <View className="h-full gap-3.5 items-center justify-center">
            {isLoading ? (
              <SpinnerView />
            ) : !debouncedQuery && selectedFilterType === "all" ? (
              <View className="items-center flex-1 justify-center gap-3.5">
                <Animated.View entering={FadeInDown.duration(360).springify()}>
                  <ArrowLeftRight
                    size={48}
                    strokeWidth={1.25}
                    className="text-muted-foreground"
                  />
                </Animated.View>
                <Large>No Transactions, Yet</Large>
                <Muted className="text-center px-16">
                  If you have any transactions done you can see here
                </Muted>
              </View>
            ) : (
              <React.Fragment>
                <SearchX
                  size={48}
                  strokeWidth={1.25}
                  className="text-muted-foreground"
                />
                <Large>No batches to show</Large>
                <Muted className="text-center px-8">
                  Try different keywords for search, or remove filters applied
                </Muted>
              </React.Fragment>
            )}
          </View>
        )}
        keyExtractor={(b) => b.transactionId}
        ListFooterComponent={() =>
          isFetchingNextPage ? (
            <View className="justify-center items-center pb-3">
              <Spinner size={28} />
            </View>
          ) : null
        }
        renderItem={({ item: t }) => (
          <TouchableOpacity
            onPress={() =>
              router.push(
                t.type === "payout"
                  ? `/payout/${t.transactionId}`
                  : `/payment/${t.transactionId}`
              )
            }
            style={{
              marginBottom: 8,
            }}
          >
            <Card>
              <CardHeader className="gap-3">
                <View className="gap-2 flex-row justify-between items-center">
                  <CardTitle className="text-base">{t.batchName}</CardTitle>

                  <View className="flex-row items-center gap-1">
                    <Large>
                      {t.totalAmount.toLocaleString("en-IN", {
                        currency: "INR",
                        currencyDisplay: "narrowSymbol",
                        currencySign: "standard",
                        style: "currency",
                        maximumFractionDigits: 0,
                      })}
                    </Large>
                    {t.type === "payout" ? (
                      <ArrowDownLeft
                        strokeWidth={1}
                        className="text-foreground size-6"
                      />
                    ) : (
                      <ArrowUpRight
                        strokeWidth={1}
                        className="text-foreground size-6"
                      />
                    )}
                  </View>
                </View>

                <View className="flex-row justify-between items-center">
                  <View className="flex-row items-center gap-2">
                    <Avatar className="size-5" alt={""}>
                      <AvatarImage source={{ uri: "" }} />
                      <AvatarFallback>
                        <Text className="text-[8px]">
                          {t.orgName?.charAt(0).toUpperCase()}
                        </Text>
                      </AvatarFallback>
                    </Avatar>
                    <Small className="text-xs">{t?.orgName}</Small>
                  </View>

                  {t.type === "payment" ? (
                    <Text
                      className={cn(
                        t.creditScoreAffected > 0
                          ? "text-primary"
                          : "text-destructive"
                      )}
                    >
                      {t.creditScoreAffected}
                    </Text>
                  ) : (
                    <PayoutStatusBadge status={t.payoutStatus ?? ""} />
                  )}
                </View>
              </CardHeader>
              <CardFooter>
                {t.updatedAt && (
                  <Muted className="text-xs">
                    Updated{" "}
                    {formatDistanceToNowStrict(t.updatedAt, {
                      addSuffix: true,
                    })}
                  </Muted>
                )}
              </CardFooter>
            </Card>
          </TouchableOpacity>
        )}
      />
    </LinearBlurView>
  );
}
