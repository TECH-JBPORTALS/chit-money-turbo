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
import { Pressable } from "react-native-gesture-handler";
import { useQuery } from "@tanstack/react-query";
import { trpc } from "~/utils/api";
import { format } from "date-fns";
import { Skeleton } from "~/components/ui/skeleton";

export default function BatchDetailsLayout() {
  const { subToBatchId } = useLocalSearchParams<{ subToBatchId: string }>();
  const router = useRouter();
  const pathname = usePathname();

  const { data: chit, isLoading } = useQuery(
    trpc.chits.getById.queryOptions({ subToBatchId })
  );

  // Memoized active tab calculation
  const activeTab = React.useMemo(() => {
    // Logic to determine active tab based on current route
    return pathname === `/${subToBatchId}` ? "runway" : "transactions";
  }, [pathname]);

  // Navigation handlers
  const handleRunwayPress = React.useCallback(() => {
    router.replace(`/${subToBatchId}`);
  }, [subToBatchId]);

  const handleTransactionsPress = React.useCallback(() => {
    router.replace(`/${subToBatchId}/tranx`);
  }, [subToBatchId]);

  // Render status component based on batch status
  const renderStatusComponent = () => {
    switch (chit?.batch.batchStatus) {
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
              Active{" "}
            </Small>
            <SolarIcon
              name="Record"
              size={14}
              color="yellow"
              type="bold-duotone"
            />
          </View>
        );
    }
  };

  return (
    <View className="px-4 gap-6 flex-1">
      <Stack.Screen
        options={{
          title: "",
          headerRight: () => (
            <Lead>
              {0}/{chit?.batch.scheme} Months
            </Lead>
          ),
        }}
      />

      {isLoading || !chit ? (
        <BatchCard className="border-0">
          <BatchCardHeader className="px-0 pt-0 pb-3 justify-between">
            <Skeleton className={"h-2 w-9"} />
            <Skeleton className={"h-2 w-9"} />
          </BatchCardHeader>

          <BatchCardContent className="px-0 gap-3">
            <Skeleton className={"h-5 w-40"} />

            <BatchCardBadgeRow>
              <Skeleton className={"h-6 w-20"} />
              <Skeleton className={"h-6 w-20"} />
              <Skeleton className={"h-6 w-20"} />
              <Skeleton className={"h-6 w-20"} />
            </BatchCardBadgeRow>
          </BatchCardContent>

          <BatchCardFooter className="px-0 pb-0">
            <Link asChild href={`/cfh/2`}>
              <Pressable>
                <View className="flex-row items-center gap-2">
                  <Skeleton className={"size-5 rounded-full"} />
                  <Skeleton className={"h-2 w-28"} />
                </View>
              </Pressable>
            </Link>
          </BatchCardFooter>
        </BatchCard>
      ) : (
        <BatchCard className="border-0">
          <BatchCardHeader className="px-0 pt-0 pb-3 justify-between">
            <Muted className="text-xs">
              Started on {format(chit?.batch.startsOn, "MMM yyyy")}
            </Muted>
            {renderStatusComponent()}
          </BatchCardHeader>

          <BatchCardContent className="px-0 gap-3">
            <BatchCardTitle className="text-xl">
              {chit?.batch.name}
            </BatchCardTitle>

            <BatchCardBadgeRow>
              <BatchCardBadge>
                <Text className="font-semibold text-sm capitalize">
                  {chit?.chitId}
                </Text>
              </BatchCardBadge>
              <BatchCardBadge>
                <Text className="font-semibold text-sm">
                  {chit.batch.fundAmount.toLocaleString("en-IN", {
                    style: "currency",
                    currency: "INR",
                    maximumFractionDigits: 0,
                  })}
                </Text>
              </BatchCardBadge>
              <BatchCardBadge>
                <Text className="font-semibold text-sm capitalize">
                  {chit?.batch.batchType}
                </Text>
              </BatchCardBadge>
              <BatchCardBadge>
                <Text className="font-semibold text-sm">
                  {(chit?.batch.fundAmount / chit?.batch.scheme).toLocaleString(
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
                    <AvatarImage source={{ uri: "" }} />
                    <AvatarFallback>
                      <Text className="text-[8px]">
                        {chit?.batch.collector?.orgName.charAt(0).toUpperCase()}
                      </Text>
                    </AvatarFallback>
                  </Avatar>
                  <Small className="text-xs">
                    {chit?.batch.collector?.orgName}
                  </Small>
                </View>
              </Pressable>
            </Link>
          </BatchCardFooter>
        </BatchCard>
      )}

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
