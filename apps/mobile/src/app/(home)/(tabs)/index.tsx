import { ScrollView, View } from "react-native";
import { LinearBlurView } from "~/components/linear-blurview";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { ArrowRight } from "~/lib/icons/ArrowRight";
import { H1, H2, Lead, Muted, P, Small } from "~/components/ui/typography";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Image } from "expo-image";
import { Link } from "expo-router";
import { useQueries, useQuery } from "@tanstack/react-query";
import { trpc } from "~/utils/api";
import { SpinnerView } from "~/components/spinner-view";
import { cn } from "~/lib/utils";
const GITHUB_AVATAR_URI = "https://github.com/mrzachnugent.png";

export default function Page() {
  const [personalInfo, creditScore] = useQueries({
    queries: [
      trpc.subscribers.getPersonalDetails.queryOptions(),
      trpc.payments.getCreditScoreMeta.queryOptions(),
    ],
  });

  if (personalInfo.isLoading || creditScore.isLoading) return <SpinnerView />;

  return (
    <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
      <LinearBlurView>
        <H2>Hey, {personalInfo.data?.firstName} 🙏</H2>

        {/** Credit Score */}
        <View className="gap-4">
          <Lead>Your Credit Score</Lead>
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center gap-3 ">
              <H1 className="text-6xl">{creditScore.data?.totalCreditScore}</H1>
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
                <CardTitle className="text-3xl">2</CardTitle>
              </CardHeader>
            </Card>
            <Card className="flex-1">
              <CardHeader className="gap-3">
                <CardDescription>Payments Made</CardDescription>
                <CardTitle className="text-3xl">12</CardTitle>
              </CardHeader>
            </Card>
          </View>
          <View className="flex-row w-full gap-4">
            <Card className="flex-1">
              <CardHeader className="gap-3">
                <CardDescription>Missed Payments</CardDescription>
                <CardTitle className="text-3xl">4</CardTitle>
              </CardHeader>
            </Card>
            <Card className="flex-1">
              <CardHeader className="gap-3">
                <CardDescription>Late Payments</CardDescription>
                <CardTitle className="text-3xl">4</CardTitle>
              </CardHeader>
            </Card>
          </View>
        </View>

        {/** Upcoming Payments */}
        <View className="gap-4">
          <Lead>Upcoming Payments</Lead>
          <View className="gap-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <Card key={i}>
                <CardHeader className="flex-row justify-between">
                  <View className="gap-2">
                    <CardTitle className="text-lg">January 2024</CardTitle>
                    <CardDescription>Due on 15th Jan</CardDescription>
                  </View>
                  <View className="gap-3">
                    <CardTitle className="text-xl text-right">
                      ₹ 5,000
                    </CardTitle>
                    <CardDescription className="text-right">
                      <Muted className="text-xs">Payment No.</Muted>{" "}
                      <Small className="text-muted-foreground">2/10</Small>
                    </CardDescription>
                  </View>
                </CardHeader>
                <CardFooter>
                  <View className="flex-row items-center gap-2">
                    <Image
                      source={{ uri: GITHUB_AVATAR_URI }}
                      alt="Shadcn"
                      style={{ height: 20, width: 20, borderRadius: 9999 }}
                    />
                    <Small className="text-xs">Lakshmi Chit Fund</Small>
                  </View>
                </CardFooter>
              </Card>
            ))}
          </View>
        </View>
      </LinearBlurView>
    </ScrollView>
  );
}
