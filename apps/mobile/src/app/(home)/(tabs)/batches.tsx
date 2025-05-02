import React, { useCallback, useMemo, useState } from "react";
import {
  ScrollView,
  View,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { useRouter } from "expo-router";
import { FlashList } from "@shopify/flash-list";

// Components
import { LinearBlurView } from "~/components/linear-blurview";
import { H2, Muted, Small } from "~/components/ui/typography";
import { Input } from "~/components/ui/input";
import { Search } from "~/lib/icons/Search";
import { Text } from "~/components/ui/text";
import { Button } from "~/components/ui/button";
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
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { RouterOutputs, trpc } from "~/utils/api";
import { SpinnerView } from "~/components/spinner-view";
import Spinner from "~/components/ui/spinner";

type Batch = RouterOutputs["batches"]["ofSubscriber"]["items"][number];

export default function Batches() {
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState("");

  const {
    data: batches,
    isLoading,
    refetch,
    isRefetching,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery(
    trpc.batches.ofSubscriber.infiniteQueryOptions(undefined, {
      initialCursor: undefined,
      getNextPageParam: ({ nextCursor }) => nextCursor,
    })
  );

  // Render batch status
  const renderBatchStatus = useCallback((batch: Batch) => {
    if (batch.batchStatus === "completed") {
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

    if (new Date(batch.startsOn).getUTCSeconds() > Date.now()) {
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
          {0}/{batch.scheme} Months
        </Muted>
      </View>
    );
  }, []);

  if (isLoading) return <SpinnerView />;

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
        showsVerticalScrollIndicator={false}
        centerContent
        ListHeaderComponent={() => (
          <View className="gap-2 pb-4">
            <H2>All Batches</H2>

            {/** Search Bar */}
            <View className="relative flex-row items-center">
              <Search className="absolute z-30 ml-2.5 mr-2.5 size-4 text-muted-foreground" />
              <Input
                placeholder="Search..."
                placeholderClassName="text-sm"
                className="ps-8 w-full h-11"
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>

            {/** Filters */}
            <View className="flex-row gap-2">
              {(["all", "ongoing", "upcoming", "completed"] as const).map(
                (filterType) => (
                  <Button
                    key={filterType}
                    variant={"secondary"}
                    // className={`${filter === filterType ? "border-border" : "border-dashed"}`}
                    // variant={filter === filterType ? "default" : "outline"}
                    size={"sm"}
                  >
                    <Text>
                      {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
                    </Text>
                  </Button>
                )
              )}
            </View>
          </View>
        )}
        estimatedItemSize={148}
        data={batches?.pages.flatMap((p) => p.items)}
        onEndReachedThreshold={1}
        onEndReached={() => hasNextPage && fetchNextPage()}
        ListFooterComponent={() =>
          isFetchingNextPage ? (
            <View className="justify-center items-center pb-3">
              <Spinner size={28} />
            </View>
          ) : (
            <View className="justify-center items-center pb-3">
              <Muted>You have reached 😉</Muted>
            </View>
          )
        }
        overScrollMode="always"
        renderItem={({ item: batch }) => (
          <TouchableOpacity
            key={batch.id}
            onPress={() => router.push(`/(batch)/${batch.id}`)}
            style={{
              opacity: batch.batchStatus === "completed" ? 0.6 : 1,
              marginBottom: 8,
            }}
          >
            <BatchCard className="mb-2">
              <BatchCardHeader className="justify-between">
                <Muted className="text-xs">Started on 2 Jan, 2024</Muted>
                {renderBatchStatus(batch)}
              </BatchCardHeader>
              <BatchCardContent>
                <BatchCardTitle>{batch.name}</BatchCardTitle>
                <BatchCardBadgeRow>
                  <BatchCardBadge>
                    <Text>
                      {parseInt(batch.fundAmount).toLocaleString("en-IN", {
                        style: "currency",
                        currency: "INR",
                        maximumFractionDigits: 0,
                      })}
                    </Text>
                  </BatchCardBadge>
                  <BatchCardBadge>
                    <Text className="capitalize">{batch.batchType}</Text>
                  </BatchCardBadge>
                  <BatchCardBadge>
                    <Text>
                      {(
                        parseInt(batch.fundAmount) / batch.scheme
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
                    alt={batch.collector?.orgName ?? ""}
                  >
                    <AvatarImage source={{ uri: undefined }} />
                    <AvatarFallback>
                      <Text className="text-[8px]">
                        {batch.collector?.orgName.charAt(0).toUpperCase()}
                      </Text>
                    </AvatarFallback>
                  </Avatar>
                  <Small className="text-xs">{batch.collector?.orgName}</Small>
                </View>
              </BatchCardFooter>
            </BatchCard>
          </TouchableOpacity>
        )}
      />
    </LinearBlurView>
  );
}

const data = [
  {
    id: "a123b456-c789d012-e345f678",
    name: "Silver Stallions 2024",
    target_amount: 50000,
    type: "Dividend Chit",
    subscription_amount: 10000,
    chit_fund_name: "Prosperity Chit Fund",
    chit_fund_image: "https://github.com/shadcn.png",
    is_completed: false,
    number_of_months: 12,
    completed_months: 5,
    is_upcoming: false,
  },
  {
    id: "a123b459-c789d012-e345f678",
    name: "New Gen 2024",
    target_amount: 80000,
    type: "Dividend Chit",
    subscription_amount: 15000,
    chit_fund_name: "Prosperity Chit Fund",
    chit_fund_image: "https://github.com/shadcn.png",
    is_completed: false,
    number_of_months: 12,
    completed_months: 0,
    is_upcoming: true,
  },
  {
    id: "g987h654-i321j210-k567l890",
    name: "Rainbow Entrepreneurs",
    target_amount: 100000,
    type: "Fixed Chit",
    subscription_amount: 15000,
    chit_fund_name: "Sunrise Financial Services",
    chit_fund_image: "https://github.com/mrzachnugent.png",
    is_completed: true,
    number_of_months: 24,
    completed_months: 24,
    is_upcoming: false,
  },
  {
    id: "m456n789-o123p456-q789r012",
    name: "Urban Dreamers Club",
    target_amount: 75000,
    type: "Flexible Chit",
    subscription_amount: 7500,
    chit_fund_name: "Harmony Investment Group",
    chit_fund_image: "https://source.unsplash.com/random/400x400?investment,3",
    is_completed: false,
    number_of_months: 18,
    completed_months: 10,
    is_upcoming: false,
  },
  {
    id: "s234t567-u890v123-w456x789",
    name: "Future Innovators",
    target_amount: 40000,
    type: "Interest Chit",
    subscription_amount: 5000,
    chit_fund_name: "Vision Capital",
    chit_fund_image: "https://source.unsplash.com/random/400x400?startup,4",
    is_completed: false,
    number_of_months: 15,
    completed_months: 7,
    is_upcoming: true,
  },
  {
    id: "p987q654-r321s210-t567u890",
    name: "Sunset Achievers",
    target_amount: 60000,
    type: "Dividend Chit",
    subscription_amount: 12000,
    chit_fund_name: "Golden Horizon Fund",
    chit_fund_image: "https://source.unsplash.com/random/400x400?money,5",
    is_completed: false,
    number_of_months: 20,
    completed_months: 12,
    is_upcoming: false,
  },
  {
    id: "x456y789-z123a456-b789c012",
    name: "Tech Titans Group",
    target_amount: 125000,
    type: "Fixed Chit",
    subscription_amount: 20000,
    chit_fund_name: "Innovation Finance",
    chit_fund_image: "https://source.unsplash.com/random/400x400?technology,6",
    is_completed: false,
    number_of_months: 30,
    completed_months: 15,
    is_upcoming: false,
  },
  {
    id: "d234e567-f890g123-h456i789",
    name: "Community Builders",
    target_amount: 85000,
    type: "Interest Chit",
    subscription_amount: 8500,
    chit_fund_name: "Social Impact Fund",
    chit_fund_image: "https://source.unsplash.com/random/400x400?community,7",
    is_completed: true,
    number_of_months: 16,
    completed_months: 16,
    is_upcoming: false,
  },
  {
    id: "j456k789-l123m456-n789o012",
    name: "Green Energy Collective",
    target_amount: 95000,
    type: "Flexible Chit",
    subscription_amount: 11000,
    chit_fund_name: "Sustainable Investments",
    chit_fund_image: "https://source.unsplash.com/random/400x400?energy,8",
    is_completed: false,
    number_of_months: 22,
    completed_months: 14,
    is_upcoming: false,
  },
  {
    id: "r234s567-t890u123-v456w789",
    name: "Young Entrepreneurs Network",
    target_amount: 55000,
    type: "Dividend Chit",
    subscription_amount: 9000,
    chit_fund_name: "Emerging Talent Fund",
    chit_fund_image:
      "https://source.unsplash.com/random/400x400?entrepreneurs,9",
    is_completed: false,
    number_of_months: 14,
    completed_months: 8,
    is_upcoming: true,
  },
];
