import { View } from "react-native";
import React from "react";
import { ArrowDownLeft } from "~/lib/icons/ArrowDownLeft";
import { ArrowUpRight } from "~/lib/icons/ArrowUpRight";
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
import { ScrollView } from "react-native-gesture-handler";
import { useQuery } from "@tanstack/react-query";
import { trpc } from "~/utils/api";
import { useSearchParams } from "expo-router/build/hooks";
import { SpinnerView } from "~/components/spinner-view";
import { cn } from "~/lib/utils";

export default function PaymentDetails() {
  const searchParams = useSearchParams();
  const paymentId = searchParams.get("paymentId") as string;

  const { data, isLoading, isError } = useQuery(
    trpc.payments.getById.queryOptions({ paymentId })
  );

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

                <ArrowUpRight
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
          <Small className="font-bold">Payment Details</Small>

          <View className="gap-3">
            <View className="justify-between items-center flex-row">
              <Muted>Payment ID</Muted>
              <Code className="font-fira-bold w-2/4 text-right">
                {data?.id}
              </Code>
            </View>
            <View className="justify-between flex-row">
              <Muted>Credit Score Affected</Muted>
              <Code className="font-fira-bold text-primary">
                {data?.creditScoreAffected}
              </Code>
            </View>
            <View className="justify-between flex-row">
              <Muted>Payment Date</Muted>
              <Code className="font-fira-bold">
                {data?.paidOn?.toDateString()}
              </Code>
            </View>
            <View className="justify-between flex-row">
              <Muted>Payment Mode</Muted>
              <Code className="font-fira-bold uppercase">
                {data?.paymentMode}
              </Code>
            </View>
            {data.paymentMode === "upi/bank" && (
              <View className="justify-between flex-row">
                <Muted>Online Transaction ID</Muted>
                <Code className="font-fira-bold">{data?.transactionId}</Code>
              </View>
            )}
          </View>

          <Small className="font-bold">Summary</Small>

          {/** @todo */}
          <View className="gap-3">
            <View className="justify-between flex-row">
              <Muted>{`Subscription Amount (${data?.subscribersToBatches.chitId})`}</Muted>
              <Code className="font-fira-bold">
                {data?.subscriptionAmount.toLocaleString("en-IN", {
                  style: "currency",
                  currency: "INR",
                })}
              </Code>
            </View>
            {/* <View className="justify-between flex-row">
                <Muted>Total Interest</Muted>
                <Code className="font-fira-bold text-primary">
                  ₹{data?.penalty}
                </Code>
              </View> */}
            <View className="justify-between flex-row">
              <Muted>Penalty Charges</Muted>
              <Code
                className={cn(
                  "font-fira-bold text-destructive",
                  data?.penalty === 0
                    ? "text-muted-foreground"
                    : "text-destructive"
                )}
              >
                -
                {data?.penalty === 0
                  ? "NONE"
                  : data?.penalty.toLocaleString("en-IN", {
                      style: "currency",
                      currency: "INR",
                    })}
              </Code>
            </View>

            <Separator />

            <View className="justify-between flex-row">
              <Muted>Total Payment Amount</Muted>
              <Code className="font-fira-bold">
                {data?.totalAmount.toLocaleString("en-IN", {
                  style: "currency",
                  currency: "INR",
                })}
              </Code>
            </View>
          </View>
        </View>
        <H3 className="mt-20 text-muted-foreground">Chit.Money</H3>
      </View>
    </ScrollView>
  );
}
