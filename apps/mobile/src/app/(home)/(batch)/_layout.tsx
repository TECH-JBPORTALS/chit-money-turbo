import React from "react";
import {
  Stack,
  useLocalSearchParams,
  useRouter,
  usePathname,
  Link,
} from "expo-router";
import { View } from "react-native";
import { SolarIcon } from "react-native-solar-icons";

import {
  BatchCard,
  BatchCardHeader,
  BatchCardContent,
  BatchCardTitle,
  BatchCardBadge,
  BatchCardBadgeRow,
  BatchCardFooter,
} from "~/components/batch-card";
import { Avatar, AvatarImage, AvatarFallback } from "~/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Text } from "~/components/ui/text";
import { Lead, Muted, Small } from "~/components/ui/typography";
import { Pressable, TouchableOpacity } from "react-native-gesture-handler";
import { useQuery } from "@tanstack/react-query";
import { trpc } from "~/utils/api";
import { SpinnerView } from "~/components/spinner-view";
import { SafeAreaView } from "~/components/safe-area-view";

// Types
interface BatchDetails {
  id: string;
  name: string;
  targetAmount: number;
  type: string;
  subscriptionAmount: number;
  chit_fund_name: string;
  chit_fund_image: string;
  startDate: string;
  numberOfMonths: number;
  completedMonths: number;
  status: "ongoing" | "completed" | "upcoming";
}

export default function BatchDetailsLayout() {
  // Simulated batch data - replace with actual data fetching
  const batchDetails: BatchDetails = {
    id: "batch-123",
    name: "Vayu Samuha 2025",
    targetAmount: 200000,
    type: "Interest Chit",
    subscriptionAmount: 5000,
    chit_fund_name: "Surya Chit Fund",
    chit_fund_image: "https://github.com/x-sss-x.png",
    startDate: "2024-01-02",
    numberOfMonths: 20,
    completedMonths: 2,
    status: "ongoing",
  };

  const { batchId } = useLocalSearchParams<{ batchId: string }>();
  const router = useRouter();
  const pathname = usePathname();

  const { data: batch, isLoading } = useQuery(
    trpc.batches.getById.queryOptions({ batchId })
  );

  // Memoized active tab calculation
  const activeTab = React.useMemo(() => {
    // Logic to determine active tab based on current route
    return pathname === `/${batchId}` ? "runway" : "transactions";
  }, [pathname]);

  // Navigation handlers
  const handleRunwayPress = React.useCallback(() => {
    router.replace(`/${batchId}`);
  }, [batchId]);

  const handleTransactionsPress = React.useCallback(() => {
    router.replace(`/${batchId}/tranx`);
  }, [batchId]);

  // Render status component based on batch status
  const renderStatusComponent = () => {
    switch (batch?.batchStatus) {
      case "completed":
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
      case "active":
        return (
          <View className="flex-row items-center">
            <Small className="text-xs inline-flex flex-row items-center">
              Upcoming{" "}
            </Small>
            <SolarIcon
              name="Record"
              size={14}
              color="gray"
              type="bold-duotone"
            />
          </View>
        );
    }
  };

  if (isLoading) return <SpinnerView />;
  if (!batch) return null;

  return (
    <View className="px-4 gap-6 flex-1">
      <Stack.Screen
        options={{
          title: "",
          headerRight: () => (
            <Lead>
              {0}/{batch.scheme} Months
            </Lead>
          ),
        }}
      />

      <BatchCard className="border-0">
        <BatchCardHeader className="px-0 pt-0 pb-3 justify-between">
          <Muted className="text-xs">
            Started on {new Date(batch.startsOn).toLocaleDateString()}
          </Muted>
          {renderStatusComponent()}
        </BatchCardHeader>

        <BatchCardContent className="px-0 gap-3">
          <BatchCardTitle className="text-xl">{batch.name}</BatchCardTitle>

          <BatchCardBadgeRow>
            <BatchCardBadge>
              <Text className="font-semibold text-sm">
                {parseInt(batch.fundAmount).toLocaleString("en-IN", {
                  style: "currency",
                  currency: "INR",
                  maximumFractionDigits: 0,
                })}
              </Text>
            </BatchCardBadge>
            <BatchCardBadge>
              <Text className="font-semibold text-sm capitalize">
                {batch.batchType}
              </Text>
            </BatchCardBadge>
            <BatchCardBadge>
              <Text className="font-semibold text-sm">
                {(parseInt(batch.fundAmount) / batch.scheme).toLocaleString(
                  "en-IN",
                  {
                    style: "currency",
                    currency: "INR",
                    maximumFractionDigits: 0,
                  }
                )}
                /m
              </Text>
            </BatchCardBadge>
          </BatchCardBadgeRow>
        </BatchCardContent>

        <BatchCardFooter className="px-0 pb-0">
          <Link asChild href={`/cfh/2`}>
            <Pressable>
              <View className="flex-row items-center gap-2">
                <Avatar
                  alt="ChitFund Image"
                  className="size-5 border border-border"
                >
                  <AvatarImage
                    source={{ uri: batch.collector?.orgCertificateKey }}
                  />
                  <AvatarFallback>
                    <Text className="text-[8px]">
                      {batch.collector?.orgName.charAt(0).toUpperCase()}
                    </Text>
                  </AvatarFallback>
                </Avatar>
                <Small className="text-xs">{batch.collector?.orgName}</Small>
              </View>
            </Pressable>
          </Link>
        </BatchCardFooter>
      </BatchCard>

      <View className="flex-1">
        <Tabs value={activeTab} onValueChange={() => {}}>
          <TabsList className="flex-row gap-1 w-full">
            <TabsTrigger
              value="runway"
              className="flex-1"
              onPress={handleRunwayPress}
            >
              <Text>Runway</Text>
            </TabsTrigger>
            <TabsTrigger
              value="transactions"
              className="flex-1"
              onPress={handleTransactionsPress}
            >
              <Text>Transactions</Text>
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <Stack
          screenOptions={{
            headerShown: false,
            animation: "fade_from_bottom",
          }}
        />
      </View>
    </View>
  );
}
