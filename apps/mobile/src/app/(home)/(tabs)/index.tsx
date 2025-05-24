import { ScrollView, View } from "react-native";
import { LinearBlurView } from "~/components/linear-blurview";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { ArrowRight } from "~/lib/icons/ArrowRight";
import {
  H1,
  H2,
  Large,
  Lead,
  Muted,
  P,
  Small,
} from "~/components/ui/typography";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Image } from "expo-image";
import { Link } from "expo-router";
import {
  useInfiniteQuery,
  useQueries,
  useQuery,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { trpc } from "~/utils/api";
import { SpinnerView } from "~/components/spinner-view";
import { cn } from "~/lib/utils";
import { ArrowLeftRight } from "~/lib/icons/ArrowLeftRight";
import React, { Suspense } from "react";
import Spinner from "~/components/ui/spinner";
import { FlashList } from "@shopify/flash-list";
import Animated, { FadeInDown } from "react-native-reanimated";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { format } from "date-fns";
const GITHUB_AVATAR_URI = "https://github.com/mrzachnugent.png";

function GetPaymentsDuesCount() {
  const { data } = useSuspenseQuery(
    trpc.metrics.getPaymentsDuesCount.queryOptions()
  );

  return (
    <CardTitle className="text-3xl">
      {data.toLocaleString("en-IN", {
        style: "decimal",
      })}
    </CardTitle>
  );
}

function GetPaymentsMadeCount() {
  const { data } = useSuspenseQuery(
    trpc.metrics.getPaymentsMadeCount.queryOptions()
  );

  return (
    <CardTitle className="text-3xl">
      {data.toLocaleString("en-IN", {
        style: "decimal",
      })}
    </CardTitle>
  );
}

function GetMissedPaymentsCount() {
  const { data } = useSuspenseQuery(
    trpc.metrics.getMissedPaymentsCount.queryOptions()
  );

  return (
    <CardTitle className="text-3xl">
      {data.toLocaleString("en-IN", {
        style: "decimal",
      })}
    </CardTitle>
  );
}

function GetLatePaymentsCount() {
  const { data } = useSuspenseQuery(
    trpc.metrics.getLatePaymentsCount.queryOptions()
  );

  return (
    <CardTitle className="text-3xl">
      {data.toLocaleString("en-IN", {
        style: "decimal",
      })}
    </CardTitle>
  );
}

export default function Page() {
  const [personalInfo, creditScore] = useQueries({
    queries: [
      trpc.subscribers.getPersonalDetails.queryOptions(),
      trpc.payments.getCreditScoreMeta.queryOptions(),
    ],
  });

  const { data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage } =
    useInfiniteQuery(
      trpc.payments.getUpcomingDues.infiniteQueryOptions(
        { limit: 5 },
        {
          getNextPageParam: ({ nextCursor }) => nextCursor,
        }
      )
    );

  const dues = data?.pages.flatMap((p) => p.items) ?? [];

  if (personalInfo.isLoading || creditScore.isLoading) return <SpinnerView />;

  return (
    <LinearBlurView>
      <FlashList
        ListHeaderComponent={
          <View className="gap-4">
            <H2>Hey, {personalInfo.data?.firstName} 🙏</H2>

            {/** Credit Score */}
            <View className="gap-4">
              <Lead>Your Credit Score</Lead>
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center gap-3 ">
                  <H1
                    className={cn(
                      "text-6xl",
                      creditScore.data?.totalCreditScore &&
                        creditScore.data?.totalCreditScore < 0
                        ? "text-destructive"
                        : "text-foreground"
                    )}
                  >
                    {creditScore.data?.totalCreditScore}
                  </H1>
                  <P
                    className={cn(
                      creditScore.data?.lastUpdatedCreditScore &&
                        creditScore.data?.lastUpdatedCreditScore < 0
                        ? "text-destructive"
                        : "text-primary"
                    )}
                  >
                    {creditScore.data?.lastUpdatedCreditScore?.toLocaleString(
                      "en-IN",
                      {
                        signDisplay: "exceptZero",
                      }
                    )}
                  </P>
                </View>

                <Link href={"/credit-score"} asChild>
                  <Button variant={"outline"}>
                    <Text>History</Text>
                    <ArrowRight className="text-foreground size-4" />
                  </Button>
                </Link>
              </View>
            </View>

            {/** Overall Stat Cards */}
            <View className="gap-4">
              <Lead>Overall</Lead>
              <View className="flex-row w-full gap-4">
                <Card className="flex-1">
                  <CardHeader className="gap-3">
                    <CardDescription>Payments Dues</CardDescription>
                    <Suspense fallback={<Spinner />}>
                      <GetPaymentsDuesCount />
                    </Suspense>
                  </CardHeader>
                </Card>
                <Card className="flex-1">
                  <CardHeader className="gap-3">
                    <CardDescription>Payments Made</CardDescription>
                    <Suspense fallback={<Spinner />}>
                      <GetPaymentsMadeCount />
                    </Suspense>
                  </CardHeader>
                </Card>
              </View>
              <View className="flex-row w-full gap-4">
                <Card className="flex-1">
                  <CardHeader className="gap-3">
                    <CardDescription>Missed Payments</CardDescription>
                    <Suspense fallback={<Spinner />}>
                      <GetMissedPaymentsCount />
                    </Suspense>
                  </CardHeader>
                </Card>
                <Card className="flex-1">
                  <CardHeader className="gap-3">
                    <CardDescription>Late Payments</CardDescription>
                    <Suspense fallback={<Spinner />}>
                      <GetLatePaymentsCount />
                    </Suspense>
                  </CardHeader>
                </Card>
              </View>
            </View>

            <Lead>Upcoming Payments</Lead>
          </View>
        }
        data={dues}
        ListEmptyComponent={
          <View className="h-full gap-3.5 items-center justify-center">
            {isLoading ? (
              <SpinnerView />
            ) : (
              <View className="items-center flex-1 justify-center gap-3.5">
                <Animated.View entering={FadeInDown.duration(360).springify()}>
                  <ArrowLeftRight
                    size={48}
                    strokeWidth={1.25}
                    className="text-muted-foreground"
                  />
                </Animated.View>
                <Large>You don't have any dues</Large>
                <Muted className="text-center px-16">
                  If any upcoming dues are there, those will be shown here
                </Muted>
              </View>
            )}
          </View>
        }
        estimatedItemSize={148}
        onEndReachedThreshold={0.5}
        onEndReached={() => hasNextPage && fetchNextPage()}
        keyExtractor={(d) => d.id}
        ListFooterComponent={() =>
          isFetchingNextPage ? (
            <View className="justify-center items-center py-3">
              <Spinner size={28} />
            </View>
          ) : null
        }
        contentContainerClassName="pb-5"
        renderItem={({ item: due }) => (
          <Card className="mt-4">
            <CardHeader className="flex-row justify-between">
              <View className="gap-2">
                <CardTitle className="text-lg">{due.batchName}</CardTitle>
                <CardDescription>
                  Due on {format(due.batchDueOn, "do MMM")}
                </CardDescription>
              </View>
              <View className="gap-3">
                <CardTitle className="text-xl text-right">
                  {due.totalAmount.toLocaleString("en-IN", {
                    style: "currency",
                    currency: "INR",
                    maximumFractionDigits: 0,
                  })}
                </CardTitle>
                <CardDescription className="text-right">
                  <Muted className="text-xs">Payment No.</Muted>{" "}
                  <Small className="text-muted-foreground">
                    {due.fundProgress.completedMonths}/
                    {due.fundProgress.totalMonths}
                  </Small>
                </CardDescription>
              </View>
            </CardHeader>
            <CardFooter>
              <View className="flex-row items-center gap-2">
                <Avatar className="size-6" alt={due.orgName ?? ""}>
                  <AvatarImage source={{ uri: undefined }} />
                  <AvatarFallback>
                    <Text className="text-[8px]">
                      {due.orgName.charAt(0).toUpperCase()}
                    </Text>
                  </AvatarFallback>
                </Avatar>
                <Small className="text-xs">{due.orgName}</Small>
              </View>
            </CardFooter>
          </Card>
        )}
      />
    </LinearBlurView>
  );
}
