import React, { useMemo } from "react";
import { View } from "react-native";
import { Text } from "~/components/ui/text";
import { SolarIcon } from "react-native-solar-icons";
import { H3 } from "~/components/ui/typography";
import { FlashList } from "@shopify/flash-list";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { ArrowRight } from "~/lib/icons/ArrowRight";

// Types for better type safety
type PayoutStatus =
  | "completed"
  | "requested"
  | "rejected"
  | "approved"
  | undefined
  | "request";

interface Transaction {
  id: number;
  date: string;
  status: PayoutStatus;
  payoutAmount?: number;
}

const getStatusElement = (status: PayoutStatus) => {
  switch (status) {
    case "completed":
      return <SolarIcon size={16} name="CheckCircle" color="green" />;
    case "requested":
      return (
        <Badge className="bg-orange-500 flex-row gap-1">
          <Text>Requested</Text>
          <ArrowRight size={14} className="text-primary-foreground" />
        </Badge>
      );
    case "rejected":
      return (
        <Badge variant={"destructive"} className="flex-row gap-1">
          <Text>Rejected</Text>
          <ArrowRight size={14} className="text-primary-foreground" />
        </Badge>
      );
    case "approved":
      return (
        <Badge className="bg-indigo-500 flex-row gap-1">
          <Text>Approved</Text>
          <ArrowRight size={14} className="text-primary-foreground" />
        </Badge>
      );
    case "request":
      return (
        <Button size="sm" className="bg-foreground dark:bg-foreground">
          <Text className="text-background dark:text-background">Request</Text>
        </Button>
      );
    default:
      return null;
  }
};

export default function BatchRunwayScreen() {
  // Memoized transaction data to prevent unnecessary re-renders
  const transactions = useMemo<Transaction[]>(
    () => [
      { id: 1, date: "Jan 10, 2024", status: "completed" },
      { id: 2, date: "Feb 10, 2024", status: "completed" },
      { id: 3, date: "Mar 10, 2024", status: "requested" },
      { id: 4, date: "Apr 10, 2024", status: "rejected" },
      { id: 5, date: "May 10, 2024", status: undefined },
      { id: 6, date: "Jun 10, 2024", status: undefined },
      { id: 7, date: "Jul 10, 2024", status: "request" },
      { id: 8, date: "Aug 10, 2024", status: undefined },
      { id: 9, date: "Sep 10, 2024", status: "approved" },
      { id: 10, date: "Oct 10, 2024", status: undefined },
      { id: 11, date: "Oct 10, 2024", status: undefined },
      { id: 12, date: "Oct 10, 2024", status: undefined },
      { id: 13, date: "Oct 10, 2024", status: undefined },
      { id: 14, date: "Oct 10, 2024", status: undefined },
      { id: 15, date: "Oct 10, 2024", status: undefined },
      { id: 16, date: "Oct 10, 2024", status: undefined },
      { id: 17, date: "Oct 10, 2024", status: undefined },
      { id: 18, date: "Oct 10, 2024", status: undefined },
      { id: 19, date: "Oct 10, 2024", status: undefined },
      { id: 20, date: "Oct 10, 2024", status: undefined },
    ],
    []
  );

  const renderTransaction = React.useCallback(
    ({ item }: { item: Transaction }) => {
      const StatusElement = getStatusElement(item.status);

      return (
        <View className="flex-row items-center justify-between py-3">
          <View className="flex-row items-center gap-3">
            <H3>{item.id}.</H3>
            <Text className="text-base">{item.date}</Text>
          </View>
          <View className="flex-row items-center space-x-2">
            {StatusElement}
          </View>
        </View>
      );
    },
    []
  );

  const keyExtractor = React.useCallback(
    (item: Transaction) => item.id.toString(),
    []
  );

  return (
    <View className="flex-1">
      <FlashList
        data={transactions}
        renderItem={renderTransaction}
        keyExtractor={keyExtractor}
        showsVerticalScrollIndicator={false}
        estimatedItemSize={50}
        contentContainerStyle={{}}
      />
    </View>
  );
}
