import { View } from "react-native";
import React from "react";
import { ArrowDownLeft } from "~/lib/icons/ArrowDownLeft";
import {
  Code,
  H3,
  Large,
  Lead,
  Muted,
  Small,
} from "~/components/ui/typography";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Text } from "~/components/ui/text";
import { Separator } from "~/components/ui/separator";
import { Button } from "~/components/ui/button";
import { ScrollView } from "react-native-gesture-handler";
import { useQuery } from "@tanstack/react-query";
import { trpc } from "~/utils/api";
import { useSearchParams } from "expo-router/build/hooks";
import { SpinnerView } from "~/components/spinner-view";

export default function TransactionDetails() {
  const searchParams = useSearchParams();
  const transactionId = searchParams.get("payoutId") as string;

  const { data, isError, isLoading } = useQuery(
    trpc.payouts.getById.queryOptions({ payoutId: transactionId })
  );

  const renderPayoutDetailsView = ({ status }: { status: string }) => {
    switch (status) {
      case "requested":
        return (
          <>
            <Small className="font-bold">Payment Details</Small>

            <View className="gap-3">
              <View className="justify-between flex-row">
                <Muted>Requested Payout Month</Muted>
                <Code className="font-fira-bold">Month 2</Code>
              </View>
              <View className="justify-between flex-row">
                <Muted>Requested Date</Muted>
                <Code className="font-fira-bold">28 Jan, 2025</Code>
              </View>
            </View>

            <Button variant={"outline"}>
              <Text>Cancel Request</Text>
            </Button>
          </>
        );

      case "rejected":
        return (
          <>
            <Small className="font-bold">Payment Details</Small>

            <View className="gap-3">
              <View className="justify-between flex-row">
                <Muted>Requested Payout Month</Muted>
                <Code className="font-fira-bold">Month 2</Code>
              </View>
              <View className="justify-between flex-row">
                <Muted>Requested Date</Muted>
                <Code className="font-fira-bold">28 Jan, 2025</Code>
              </View>
              <View className="justify-between flex-row">
                <Muted>Rejected Date</Muted>
                <Code className="font-fira-bold">30 Jan, 2025</Code>
              </View>
            </View>

            <View className="gap-3">
              <Small className="font-bold">Reason for Rejection</Small>
              <Muted>Sorry, Alloted to some other person</Muted>
            </View>
          </>
        );

      case "cancelled":
        return (
          <>
            <Small className="font-bold">Payment Details</Small>

            <View className="gap-3">
              <View className="justify-between flex-row">
                <Muted>Requested Payout Month</Muted>
                <Code className="font-fira-bold">Month 2</Code>
              </View>
              <View className="justify-between flex-row">
                <Muted>Requested Date</Muted>
                <Code className="font-fira-bold">28 Jan, 2025</Code>
              </View>
              <View className="justify-between flex-row">
                <Muted>Cancelled Date</Muted>
                <Code className="font-fira-bold">30 Jan, 2025</Code>
              </View>
            </View>
          </>
        );

      case "approved":
        return (
          <>
            <Small className="font-bold">Payment Details</Small>

            <View className="gap-3">
              <View className="justify-between flex-row">
                <Muted>Requested Payout Month</Muted>
                <Code className="font-fira-bold">Month 2</Code>
              </View>
              <View className="justify-between flex-row">
                <Muted>Requested Date</Muted>
                <Code className="font-fira-bold">28 Jan, 2025</Code>
              </View>
              <View className="justify-between flex-row">
                <Muted>Approved Date</Muted>
                <Code className="font-fira-bold">30 Jan, 2025</Code>
              </View>
            </View>

            <Small className="font-bold">Summary</Small>

            <View className="gap-3">
              <View className="justify-between flex-row">
                <Muted>Payout Amount</Muted>
                <Code className="font-fira-bold">₹2,00,000</Code>
              </View>
              <View className="justify-between flex-row">
                <Muted>Collector Cut - 2%</Muted>
                <Code className="font-fira-bold text-destructive">
                  - ₹4,000
                </Code>
              </View>
              <View className="justify-between flex-row">
                <Muted>Penalty Charges</Muted>
                <Code className="font-fira-bold">None</Code>
              </View>

              <Separator />
              <View className="justify-between flex-row">
                <Muted>You will recieve</Muted>
                <Code className="font-fira-bold">₹1,96,000</Code>
              </View>
            </View>
          </>
        );

      case "disbursed":
        return (
          <>
            <Small className="font-bold">Payment Details</Small>

            <View className="gap-3">
              <View className="justify-between flex-row">
                <Muted>Payout ID</Muted>
                <Code className="font-fira-bold">#JD829KD9220392</Code>
              </View>
              <View className="justify-between flex-row">
                <Muted>Requested Payout Month</Muted>
                <Code className="font-fira-bold">Month 2</Code>
              </View>
              <View className="justify-between flex-row">
                <Muted>Requested Date</Muted>
                <Code className="font-fira-bold">28 Jan, 2025</Code>
              </View>
              <View className="justify-between flex-row">
                <Muted>Approved Date</Muted>
                <Code className="font-fira-bold">30 Jan, 2025</Code>
              </View>
              <View className="justify-between flex-row">
                <Muted>Payment Mode</Muted>
                <Code className="font-fira-bold">Online</Code>
              </View>
              <View className="justify-between flex-row">
                <Muted>Disbursed Date</Muted>
                <Code className="font-fira-bold">10 Feb, 2025</Code>
              </View>
            </View>

            <Small className="font-bold">Summary</Small>

            <View className="gap-3">
              <View className="justify-between flex-row">
                <Muted>Payout Amount</Muted>
                <Code className="font-fira-bold">₹2,00,000</Code>
              </View>
              <View className="justify-between flex-row">
                <Muted>Collector Cut - 2%</Muted>
                <Code className="font-fira-bold text-destructive">
                  - ₹4,000
                </Code>
              </View>
              <View className="justify-between flex-row">
                <Muted>Penalty Charges</Muted>
                <Code className="font-fira-bold">None</Code>
              </View>

              <Separator />
              <View className="justify-between flex-row">
                <Muted>Final Amount Disbursed</Muted>
                <Code className="font-fira-bold">₹1,96,000</Code>
              </View>
            </View>
          </>
        );

      default:
        return null;
    }
  };

  if (isLoading) return <SpinnerView />;

  if (!data || isError)
    return (
      <View className="flex-1">
        <Large>Something went wrong!</Large>
        <Muted>
          Payout details not exits, or may be our code breaks. Try again
          sometime later
        </Muted>
      </View>
    );

  return (
    <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
      <View className="flex-1 items-center pb-6 px-4 justify-between">
        <View className="flex-1 w-full gap-6">
          {/** Transaction Top Card */}
          <View className="gap-3 py-3">
            <View className="flex-row justify-between items-center">
              <Lead className="text-foreground">
                {data?.subscribersToBatches.batch.name}
              </Lead>
              <View className="flex-row items-center gap-1">
                <Large className="font-bold">
                  {data?.totalAmount.toLocaleString("en-IN", {
                    currency: "INR",
                    currencyDisplay: "narrowSymbol",
                    currencySign: "standard",
                    style: "currency",
                    maximumFractionDigits: 0,
                  })}
                </Large>
                <ArrowDownLeft
                  strokeWidth={1}
                  className="text-foreground size-6"
                />
              </View>
            </View>
            <View className="flex-row justify-between items-center">
              <View className="flex-row items-center gap-2">
                <Avatar
                  className="size-5"
                  alt={
                    data?.subscribersToBatches.batch.collector?.orgName ?? ""
                  }
                >
                  <AvatarImage source={{ uri: "" }} />
                  <AvatarFallback>
                    <Text className="text-[8px]">
                      {data?.subscribersToBatches.batch.collector?.orgName
                        .charAt(0)
                        .toUpperCase()}
                    </Text>
                  </AvatarFallback>
                </Avatar>
                <Small className="text-xs">
                  {data?.subscribersToBatches.batch.collector?.orgName}
                </Small>
              </View>
            </View>
          </View>

          {/** Content */}
          {renderPayoutDetailsView({ status: data.payoutStatus })}
        </View>
        <H3 className="mt-20 text-muted-foreground">Chit.Money</H3>
      </View>
    </ScrollView>
  );
}
