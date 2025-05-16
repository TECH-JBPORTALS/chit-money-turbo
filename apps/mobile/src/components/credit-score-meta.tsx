import { View, Text } from "react-native";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { trpc } from "~/utils/api";
import { H1, P, Small } from "./ui/typography";
import Animated from "react-native-reanimated";
import { cn } from "~/lib/utils";

export function CreditScoreMeta() {
  const { data } = useQuery(trpc.payments.getCreditScoreMeta.queryOptions());

  if (!data || data.totalCreditScore === 0) return null;

  const total =
    data.prePaymentsCount + data.onTimePaymentsCount + data.latePaymentsCount;

  const preRatio = data.prePaymentsCount / total || 0.01;
  const onTimeRatio = data.onTimePaymentsCount / total || 0.01;
  const lateRatio = data.latePaymentsCount / total || 0.01;

  return (
    <View className="gap-6 px-4 py-6">
      <View className="flex-row justify-center items-center gap-3 ">
        <H1
          className={cn(
            "text-6xl",
            (data?.totalCreditScore ?? 0) >= 0
              ? "text-foreground"
              : "text-destructive"
          )}
        >
          {data?.totalCreditScore}
        </H1>
        <Animated.View>
          <P
            className={cn(
              data.lastUpdatedCreditScore && data.lastUpdatedCreditScore < 0
                ? "text-destructive"
                : "text-primary"
            )}
          >
            {data.lastUpdatedCreditScore?.toLocaleString("en-IN", {
              signDisplay: "exceptZero",
            })}
          </P>
        </Animated.View>
      </View>

      {/** Overview Bar */}

      {data.totalCreditScore !== 0 && (
        <React.Fragment>
          <View className="flex-row gap-0.5 w-full h-9">
            <View
              style={{ flex: preRatio }}
              className="w-full h-full bg-primary opacity-50 rounded-sm"
            />
            <View
              style={{ flex: onTimeRatio }}
              className="w-full h-full bg-primary rounded-sm"
            />
            <View
              style={{ flex: lateRatio }}
              className="w-full h-full bg-destructive rounded-sm"
            />
          </View>
          <View className="flex-row justify-between">
            <View className="flex-row items-center gap-1">
              <View className="size-1 rounded-full opacity-50 bg-primary" />
              <Small className="text-xs">
                {data?.prePaymentsCount} Pre-Payments
              </Small>
            </View>
            <View className="flex-row items-center gap-1">
              <View className="size-1 rounded-full  bg-primary" />
              <Small className="text-xs">
                {data?.onTimePaymentsCount} On-time Payments
              </Small>
            </View>
            <View className="flex-row items-center gap-1">
              <View className="size-1 rounded-full opacity-50 bg-destructive" />
              <Small className="text-xs">
                {data?.latePaymentsCount} Late Payments
              </Small>
            </View>
          </View>
        </React.Fragment>
      )}
    </View>
  );
}
