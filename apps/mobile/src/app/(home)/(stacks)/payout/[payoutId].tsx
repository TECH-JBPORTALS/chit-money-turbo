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

import { PayoutStatusBadge } from "~/lib/payout-badge";
import { format } from "date-fns";
import {
  RetryView,
  RetryViewButton,
  RetryViewDescription,
  RetryViewIcon,
  RetryViewTitle,
} from "~/components/retry-view";

export default function TransactionDetails() {
  const searchParams = useSearchParams();
  const payoutId = searchParams.get("payoutId") as string;

  const { data, isError, isRefetching, refetch, isLoading } = useQuery(
    trpc.payouts.getById.queryOptions({ payoutId })
  );

  if (isLoading || isRefetching) return <SpinnerView />;

  if (!data || isError)
    return (
      <RetryView>
        <RetryViewIcon />
        <RetryViewTitle />
        <RetryViewDescription className="text-center">
          {`May be poyout details doesn't exits, or may be our code broke. Try again sometime later`}
        </RetryViewDescription>
        <RetryViewButton onPress={() => refetch()}>
          <Text>Try again</Text>
        </RetryViewButton>
      </RetryView>
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
                <Code className="font-fira-bold">
                  {format(data.month, "MMM yyyy")}
                </Code>
              </View>
              <View className="justify-between flex-row">
                <Muted>Requested Date</Muted>
                <Code className="font-fira-bold">
                  {data.requestedAt
                    ? format(data.requestedAt, "dd MMM, yyyy")
                    : "Not Specified"}
                </Code>
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
                <Code className="font-fira-bold">
                  {format(data.month, "MMM yyyy")}
                </Code>
              </View>
              <View className="justify-between flex-row">
                <Muted>Requested Date</Muted>
                <Code className="font-fira-bold">
                  {data.requestedAt
                    ? format(data.requestedAt, "dd MMM, yyyy")
                    : "Not Specified"}
                </Code>
              </View>
              <View className="justify-between flex-row">
                <Muted>Rejected Date</Muted>
                <Code className="font-fira-bold">
                  {data.rejectedAt
                    ? format(data.rejectedAt, "dd MMM, yyyy")
                    : "Not Specified"}
                </Code>
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
                <Code className="font-fira-bold">
                  {format(data.month, "MMM yyyy")}
                </Code>
              </View>
              <View className="justify-between flex-row">
                <Muted>Requested Date</Muted>
                <Code className="font-fira-bold">
                  {data.requestedAt
                    ? format(data.requestedAt, "dd MMM, yyyy")
                    : "Not Specified"}
                </Code>
              </View>
              <View className="justify-between flex-row">
                <Muted>Cancelled Date</Muted>
                <Code className="font-fira-bold">
                  {data.cancelledAt
                    ? format(data.cancelledAt, "dd MMM, yyyy")
                    : "Not Specified"}
                </Code>
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
                <Code className="font-fira-bold">
                  {format(data.month, "MMM yyyy")}
                </Code>
              </View>
              <View className="justify-between flex-row">
                <Muted>Requested Date</Muted>

                <Code className="font-fira-bold">
                  {data.requestedAt
                    ? format(data.requestedAt, "dd MMM, yyyy")
                    : "Not Specified"}
                </Code>
              </View>
              <View className="justify-between flex-row">
                <Muted>Approved Date</Muted>
                <Code className="font-fira-bold">
                  {data.approvedAt
                    ? format(data.approvedAt, "dd MMM, yyyy")
                    : "Not Specified"}
                </Code>
              </View>
            </View>

            <Small className="font-bold">Summary</Small>

            <View className="gap-3">
              <View className="justify-between flex-row">
                <Muted>Payout Amount</Muted>
                <Code className="font-fira-bold">
                  {data.amount.toLocaleString("en-IN", {
                    style: "currency",
                    currency: "INR",
                    maximumFractionDigits: 0,
                  })}
                </Code>
              </View>
              <View className="justify-between flex-row">
                <Muted>
                  Collector Cut - {"( "}
                  <Text className="font-bold text-xs text-primary">
                    {data.appliedCommissionRate}%
                  </Text>
                  {" )"}
                </Muted>
                <Code className="font-fira-bold text-destructive">
                  -{" "}
                  {data.deductions.toLocaleString("en-IN", {
                    style: "currency",
                    currency: "INR",
                    maximumFractionDigits: 0,
                  })}
                </Code>
              </View>

              <Separator />
              <View className="justify-between flex-row">
                <Muted>You will recieve</Muted>
                <Code className="font-fira-bold">
                  {data.totalAmount.toLocaleString("en-IN", {
                    style: "currency",
                    currency: "INR",
                    maximumFractionDigits: 0,
                  })}
                </Code>
              </View>
            </View>
          </>
        );

      case "disbursed":
        return (
          <>
            <Small className="font-bold">Payment Details</Small>

            <View className="gap-3">
              <View className="justify-between items-center flex-row">
                <Muted>Payout ID</Muted>
                <Code className="font-fira-bold">{data.id}</Code>
              </View>
              <View className="justify-between flex-row">
                <Muted>Requested Payout Month</Muted>
                <Code className="font-fira-bold">
                  {format(data.month, "MMM yyyy")}
                </Code>
              </View>
              <View className="justify-between flex-row">
                <Muted>Requested Date</Muted>
                <Code className="font-fira-bold">
                  {data.requestedAt
                    ? format(data.requestedAt, "dd MMM, yyyy")
                    : "Not Specified"}
                </Code>
              </View>
              <View className="justify-between flex-row">
                <Muted>Approved Date</Muted>
                <Code className="font-fira-bold">
                  {data.approvedAt
                    ? format(data.approvedAt, "dd MMM, yyyy")
                    : "Not Specified"}
                </Code>
              </View>
              <View className="justify-between flex-row">
                <Muted>Payment Mode</Muted>
                <Code className="font-fira-bold capitalize">
                  {data.paymentMode}
                </Code>
              </View>
              <View className="justify-between flex-row">
                <Muted>Disbursed Date</Muted>
                <Code className="font-fira-bold">
                  {data.disbursedAt
                    ? format(data.disbursedAt, "dd MMM, yyyy")
                    : "Not Specified"}
                </Code>
              </View>
            </View>

            <Small className="font-bold">Summary</Small>

            <View className="gap-3">
              <View className="justify-between flex-row">
                <Muted>Payout Amount</Muted>
                <Code className="font-fira-bold">
                  {data.amount.toLocaleString("en-IN", {
                    style: "currency",
                    currency: "INR",
                    maximumFractionDigits: 0,
                  })}
                </Code>
              </View>
              <View className="justify-between flex-row">
                <Muted>
                  Collector Cut - {"( "}
                  <Text className="font-bold text-xs text-primary">
                    {data.appliedCommissionRate}%
                  </Text>
                  {" )"}
                </Muted>
                <Code className="font-fira-bold text-destructive">
                  -{" "}
                  {data.deductions.toLocaleString("en-IN", {
                    style: "currency",
                    currency: "INR",
                    maximumFractionDigits: 0,
                  })}
                </Code>
              </View>

              <Separator />
              <View className="justify-between flex-row">
                <Muted>You will recieve</Muted>
                <Code className="font-fira-bold">
                  {data.totalAmount.toLocaleString("en-IN", {
                    style: "currency",
                    currency: "INR",
                    maximumFractionDigits: 0,
                  })}
                </Code>
              </View>
            </View>
          </>
        );

      default:
        return null;
    }
  };

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

              <PayoutStatusBadge status={data.payoutStatus} />
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
