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
  // Memoized transaction data
  const transactions = useMemo<Transaction[]>(
    () => [
      {
        id: 1,
        type: "payment",
        date: "24 Jan, 2025",
        amount: 5000,
        monthNumber: 2,
        credit_score_affected: 5,
      },
      {
        id: 2,
        type: "payment",
        date: "24 Jan, 2025",
        amount: 5000,
        monthNumber: 1,
        credit_score_affected: -20,
      },
      {
        id: 3,
        type: "payout",
        date: "24 Jan, 2025",
        amount: 200000,
        status: "requested",
        monthNumber: 3,
      },
    ],
    []
  );

  const renderTransaction = React.useCallback(
    ({ item }: { item: Transaction }) => {
      const isPayment = item.type === "payment";
      const isPayout = item.type === "payout";

      return (
        <Card key={item.id} className=" my-1">
          <CardHeader className="gap-3">
            <View className="gap-2 flex-row justify-between items-center">
              <CardTitle className="text-base">
                {isPayment ? "Payment " : "Payout of month "}
                {item.monthNumber}
              </CardTitle>

              <View className="flex-row items-center gap-1">
                <Small className="font-bold">
                  {item.amount.toLocaleString("en-IN", {
                    currency: "INR",
                    currencyDisplay: "narrowSymbol",
                    currencySign: "standard",
                    style: "currency",
                    maximumFractionDigits: 0,
                  })}
                </Small>
                {isPayout ? (
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

              {isPayment ? (
                <Text
                  className={cn(
                    (item.credit_score_affected ?? 0 > 0)
                      ? "text-primary"
                      : "text-destructive"
                  )}
                >
                  {item.credit_score_affected}
                </Text>
              ) : (
                <PayoutStatusBadge status={item.status ?? ""} />
              )}
            </View>
          </CardHeader>
        </Card>
      );
    },
    []
  );

  const keyExtractor = React.useCallback(
    (item: Transaction) => item.id.toString(),
    []
  );

  return (
    <View className="flex-1 mt-5">
      <FlashList
        data={transactions}
        renderItem={renderTransaction}
        keyExtractor={keyExtractor}
        showsVerticalScrollIndicator={false}
        estimatedItemSize={50}
      />
    </View>
  );
}
