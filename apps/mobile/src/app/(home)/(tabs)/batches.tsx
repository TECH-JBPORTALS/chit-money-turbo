import React, { memo, useCallback, useState } from "react";
import { View, TouchableOpacity, RefreshControl } from "react-native";
import { useRouter } from "expo-router";
import { FlashList } from "@shopify/flash-list";

// Components
import { LinearBlurView } from "~/components/linear-blurview";
import { H2, Large, Muted, Small } from "~/components/ui/typography";
import { SearchX } from "~/lib/icons/SearchX";
import { Layers } from "~/lib/icons/Layers";
import { Text } from "~/components/ui/text";
import { SolarIcon } from "react-native-solar-icons";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import {
  BatchCard,
  BatchCardBadge,
  BatchCardBadgeRow,
  BatchCardContent,
  BatchCardFooter,
  BatchCardHeader,
  BatchCardTitle,
} from "~/components/batch-card";
import { useInfiniteQuery } from "@tanstack/react-query";
import { RouterOutputs, trpc } from "~/utils/api";
import Spinner from "~/components/ui/spinner";
import { SpinnerView } from "~/components/spinner-view";
import { useDebounce } from "@uidotdev/usehooks";
import { Badge } from "~/components/ui/badge";
import SearchInput from "~/components/search-input";
import Animated, { FadeInDown } from "react-native-reanimated";

type Chit = RouterOutputs["chits"]["ofSubscriber"]["items"][number];

export default function Batches() {
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilterType, setFilterType] = useState<
    "active" | "upcoming" | "completed" | "all"
  >("all");

  const debouncedQuery = useDebounce(searchQuery, 800);

  const {
    data: chits,
    isLoading,
    refetch,
    isRefetching,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery(
    trpc.chits.ofSubscriber.infiniteQueryOptions(
      {
        query: debouncedQuery,
        batchStatus: selectedFilterType,
      },
      {
        initialCursor: undefined,
        getNextPageParam: ({ nextCursor }) => nextCursor,
      }
    )
  );

  const batchPageItems = isLoading ? [] : chits?.pages.flatMap((p) => p.items);

  // Render batch status
  const renderBatchStatus = useCallback((chit: Chit) => {
    if (chit.batch.batchStatus === "completed") {
      return (
        <View className="flex-row items-center">
          <Small className="text-xs inline-flex flex-row items-center">
            Completed{" "}
          </Small>
          <SolarIcon
            name="CheckCircle"
            size={14}
            color="green"
            type="bold-duotone"
          />
        </View>
      );
    }

    if (new Date(chit.batch.startsOn).getUTCSeconds() > Date.now()) {
      return (
        <View className="flex-row items-center">
          <Small className="text-xs inline-flex flex-row items-center">
            Upcoming{" "}
          </Small>
          <SolarIcon name="Record" size={14} color="gray" type="bold-duotone" />
        </View>
      );
    }

    return (
      <View className="flex-row justify-end gap-1 flex-1 items-center">
        <Muted className="text-sm">
          {0}/{chit.batch.scheme} Months
        </Muted>
      </View>
    );
  }, []);

  const Filters = () => (
    <View className="flex-row gap-2">
      {(["all", "active", "completed", "upcoming"] as const).map(
        (filterType) => (
          <TouchableOpacity
            onPress={() => {
              setFilterType(filterType);
            }}
            key={filterType}
          >
            <Badge
              className="px-3.5 py-1.5"
              variant={
                selectedFilterType === filterType ? "default" : "outline"
              }
            >
              <Text className="text-sm">
                {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
              </Text>
            </Badge>
          </TouchableOpacity>
        )
      )}
    </View>
  );

  const MemoizedFilters = memo(Filters);

  return (
    <LinearBlurView className="flex-1">
      {/** Batches List */}
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
            <H2>All Batches</H2>

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
        data={batchPageItems}
        onEndReachedThreshold={0.5}
        onEndReached={() => hasNextPage && fetchNextPage()}
        ListEmptyComponent={() => (
          <View className="h-full gap-3.5 items-center justify-center">
            {isLoading ? (
              <SpinnerView />
            ) : !debouncedQuery && selectedFilterType === "all" ? (
              <View className="items-center flex-1 justify-center gap-3.5">
                <Animated.View entering={FadeInDown.duration(360).springify()}>
                  <Layers
                    size={48}
                    strokeWidth={1.25}
                    className="text-muted-foreground"
                  />
                </Animated.View>
                <Large>Your not in any batches, yet</Large>
                <Muted className="text-center px-16">
                  As soon as you join any batches with any associated chit fund
                  those batches will appear over here
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
        keyExtractor={(b) => b.id}
        ListFooterComponent={() =>
          isFetchingNextPage ? (
            <View className="justify-center items-center pb-3">
              <Spinner size={28} />
            </View>
          ) : null
        }
        renderItem={({ item: chit }) => (
          <TouchableOpacity
            onPress={() => router.push(`/(batch)/${chit.id}`)}
            style={{
              opacity: chit.batch.batchStatus === "completed" ? 0.6 : 1,
              marginBottom: 8,
            }}
          >
            <BatchCard className="mb-2">
              <BatchCardHeader className="justify-between">
                <Muted className="text-xs">Started on 2 Jan, 2024</Muted>
                {renderBatchStatus(chit)}
              </BatchCardHeader>
              <BatchCardContent>
                <BatchCardTitle>{chit.batch.name}</BatchCardTitle>
                <BatchCardBadgeRow>
                  <BatchCardBadge>
                    <Text className="capitalize">{chit.chitId}</Text>
                  </BatchCardBadge>
                  <BatchCardBadge>
                    <Text>
                      {parseInt(chit.batch.fundAmount).toLocaleString("en-IN", {
                        style: "currency",
                        currency: "INR",
                        maximumFractionDigits: 0,
                      })}
                    </Text>
                  </BatchCardBadge>
                  <BatchCardBadge>
                    <Text className="capitalize">{chit.batch.batchType}</Text>
                  </BatchCardBadge>
                  <BatchCardBadge>
                    <Text>
                      {(
                        parseInt(chit.batch.fundAmount) / chit.batch.scheme
                      ).toLocaleString("en-IN", {
                        style: "currency",
                        currency: "INR",
                        maximumFractionDigits: 0,
                      })}
                      /m
                    </Text>
                  </BatchCardBadge>
                </BatchCardBadgeRow>
              </BatchCardContent>
              <BatchCardFooter>
                <View className="flex-row items-center gap-2">
                  <Avatar
                    className="size-6"
                    alt={chit.collector?.orgName ?? ""}
                  >
                    <AvatarImage source={{ uri: undefined }} />
                    <AvatarFallback>
                      <Text className="text-[8px]">
                        {chit.collector?.orgName.charAt(0).toUpperCase()}
                      </Text>
                    </AvatarFallback>
                  </Avatar>
                  <Small className="text-xs">{chit.collector?.orgName}</Small>
                </View>
              </BatchCardFooter>
            </BatchCard>
          </TouchableOpacity>
        )}
      />
    </LinearBlurView>
  );
}
