import React, { useMemo } from "react";
import { View, FlatList } from "react-native";
import { Text } from "~/components/ui/text";
import { SolarIcon } from "react-native-solar-icons";

// Types for better type safety
type TransactionStatus =
  | "completed"
  | "requested"
  | "rejected"
  | "pending"
  | "request";

interface Transaction {
  id: number;
  date: string;
  status: TransactionStatus;
  payoutAmount?: number;
}

const getStatusColor = (status: TransactionStatus) => {
  switch (status) {
    case "completed":
      return "green";
    case "requested":
      return "orange";
    case "rejected":
      return "red";
    case "pending":
      return "gray";
    case "request":
      return "lightblue";
    default:
      return "gray";
  }
};

const getStatusIcon = (status: TransactionStatus) => {
  switch (status) {
    case "completed":
      return "CheckCircle";
    case "requested":
      return "ArrowRight";
    case "rejected":
      return "CloseCircle";
    case "pending":
      return "ClockCircle";
    case "request":
      return "AddCircle";
    default:
      return "QuestionCircle";
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
      { id: 5, date: "May 10, 2024", status: "pending" },
      { id: 6, date: "Jun 10, 2024", status: "pending" },
      { id: 7, date: "Jul 10, 2024", status: "request" },
      { id: 8, date: "Aug 10, 2024", status: "pending" },
      { id: 9, date: "Sep 10, 2024", status: "pending" },
      { id: 10, date: "Oct 10, 2024", status: "pending" },
    ],
    []
  );

  const renderTransaction = React.useCallback(
    ({ item }: { item: Transaction }) => {
      const statusColor = getStatusColor(item.status);
      const statusIcon = getStatusIcon(item.status);

      return (
        <View className="flex-row items-center justify-between py-3 border-b border-border">
          <Text className="text-base">{item.date}</Text>
          <View className="flex-row items-center space-x-2">
            <Text className={`text-${statusColor}-500 capitalize`}>
              {item.status}
            </Text>
            <SolarIcon
              name={statusIcon}
              size={20}
              color={statusColor}
              type="bold-duotone"
            />
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
    <FlatList
      data={transactions}
      renderItem={renderTransaction}
      keyExtractor={keyExtractor}
      showsVerticalScrollIndicator={false}
      // Performance optimizations
      removeClippedSubviews={true}
      maxToRenderPerBatch={10}
      initialNumToRender={10}
      windowSize={21}
    />
  );
}
