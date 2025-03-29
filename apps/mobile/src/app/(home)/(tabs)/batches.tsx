import React, { useCallback, useMemo, useState } from "react";
import { ScrollView, View, RefreshControl } from "react-native";
import { useRouter } from "expo-router";
import { TouchableOpacity } from "react-native-gesture-handler";

// Components
import { LinearBlurView } from "~/components/linear-blurview";
import { H2, Muted, Small } from "~/components/ui/typography";
import { Input } from "~/components/ui/input";
import { Search } from "~/lib/icons/Search";
import { Text } from "~/components/ui/text";
import { Button } from "~/components/ui/button";
import { Progress } from "~/components/ui/progress";
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

// Types
interface Batch {
  id: string;
  name: string;
  target_amount: number;
  type: string;
  subscription_amount: number;
  chit_fund_name: string;
  chit_fund_image: string;
  is_completed: boolean;
  number_of_months: number;
  completed_months: number;
  is_upcoming: boolean;
}

export default function Batches() {
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<
    "all" | "ongoing" | "upcoming" | "completed"
  >("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Memoized and filtered data
  const filteredBatches = useMemo(() => {
    return data.filter((batch) => {
      // Filter logic
      const matchesFilter =
        filter === "all" ||
        (filter === "ongoing" && !batch.is_completed && !batch.is_upcoming) ||
        (filter === "upcoming" && batch.is_upcoming) ||
        (filter === "completed" && batch.is_completed);

      // Search logic
      const matchesSearch = batch.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

      return matchesFilter && matchesSearch;
    });
  }, [filter, searchQuery]);

  // Optimized navigation handler
  const navigateToBatch = useCallback((batchId: string) => {}, [router]);

  // Refresh handler
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    // Simulate data refresh
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  // Render batch status
  const renderBatchStatus = useCallback((batch: Batch) => {
    if (batch.is_completed) {
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

    if (batch.is_upcoming) {
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
          {batch.completed_months}/{batch.number_of_months} Months
        </Muted>
      </View>
    );
  }, []);

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      className="flex-1"
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <LinearBlurView>
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
                className={`${filter === filterType ? "border-border" : "border-dashed"}`}
                variant={filter === filterType ? "default" : "outline"}
                size={"sm"}
                onPress={() => setFilter(filterType)}
              >
                <Text>
                  {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
                </Text>
              </Button>
            )
          )}
        </View>

        {/** Batches List */}
        <View className="gap-2">
          {filteredBatches.map((batch) => (
            <TouchableOpacity
              key={batch.id}
              onPress={() => router.push(`/(batch)/${batch.id}`)}
              style={{ opacity: batch.is_completed ? 0.6 : 1 }}
            >
              <BatchCard>
                <BatchCardHeader className="justify-between">
                  <Muted className="text-xs">Started on 2 Jan, 2024</Muted>
                  {renderBatchStatus(batch)}
                </BatchCardHeader>
                <BatchCardContent>
                  <BatchCardTitle>{batch.name}</BatchCardTitle>
                  <BatchCardBadgeRow>
                    <BatchCardBadge>
                      <Text>
                        {batch.target_amount.toLocaleString("en-IN", {
                          style: "currency",
                          currency: "INR",
                          maximumFractionDigits: 0,
                        })}
                      </Text>
                    </BatchCardBadge>
                    <BatchCardBadge>
                      <Text>{batch.type}</Text>
                    </BatchCardBadge>
                    <BatchCardBadge>
                      <Text>
                        {batch.subscription_amount.toLocaleString("en-IN", {
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
                    <Avatar className="size-5" alt={batch.chit_fund_name}>
                      <AvatarImage source={{ uri: batch.chit_fund_image }} />
                      <AvatarFallback>
                        <Text className="text-[8px]">
                          {batch.chit_fund_name.charAt(0).toUpperCase()}
                        </Text>
                      </AvatarFallback>
                    </Avatar>
                    <Small className="text-xs">{batch.chit_fund_name}</Small>
                  </View>
                </BatchCardFooter>
              </BatchCard>
            </TouchableOpacity>
          ))}
        </View>
      </LinearBlurView>
    </ScrollView>
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
