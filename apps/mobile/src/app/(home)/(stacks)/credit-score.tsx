import { ScrollView, View } from "react-native";
import { H1, Muted, P, Small } from "~/components/ui/typography";
import { cn } from "~/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { trpc } from "~/utils/api";
import { format } from "date-fns";
import { SpinnerView } from "~/components/spinner-view";
import {
  RetryView,
  RetryViewButton,
  RetryViewDescription,
  RetryViewIcon,
  RetryViewTitle,
} from "~/components/retry-view";
import { Text } from "~/components/ui/text";
import Animated from "react-native-reanimated";

export default function CreditScore() {
  const { data, isLoading, isRefetching, refetch } = useQuery(
    trpc.payments.getCreditScoreHistory.queryOptions()
  );

  const items = data?.items;

  if (isLoading || isRefetching) return <SpinnerView />;

  if (!data)
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

  const total =
    data.prePaymentsCount + data.onTimePaymentsCount + data.latePaymentsCount;

  const preRatio = data.prePaymentsCount / total || 0.01;
  const onTimeRatio = data.onTimePaymentsCount / total || 0.01;
  const lateRatio = data.latePaymentsCount / total || 0.01;

  return (
    <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
      <View className="gap-6 flex-1 px-4 py-6">
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
        )}

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

        {/** History List */}
        <View>
          {items?.map((item, index) => (
            <View
              key={index}
              className="flex-row py-2 items-center justify-between"
            >
              {item.paidOn ? (
                <Muted>{format(item.paidOn, "dd MMM, yyyy")}</Muted>
              ) : null}
              <Small
                className={cn(
                  "text-base",
                  item.creditScoreAffected > 0
                    ? "text-primary"
                    : "text-destructive"
                )}
              >
                {item.creditScoreAffected.toLocaleString("en-IN", {
                  signDisplay: "exceptZero",
                })}
              </Small>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}
