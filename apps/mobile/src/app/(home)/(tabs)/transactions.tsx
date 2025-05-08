import { Search } from "lucide-react-native";
import {
  RefreshControl,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";
import { LinearBlurView } from "~/components/linear-blurview";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import { Card, CardFooter, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Text } from "~/components/ui/text";
import { H2, Large, Muted, Small } from "~/components/ui/typography";
import { cn } from "~/lib/utils";
import { ArrowDownLeft } from "~/lib/icons/ArrowDownLeft";
import { ArrowUpRight } from "~/lib/icons/ArrowUpRight";
import { PayoutStatusBadge } from "~/lib/payout-badge";
import { Link } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { trpc } from "~/utils/api";
import { SpinnerView } from "~/components/spinner-view";

// const data = [
//   {
//     id: "s987t654-u321v098-w765x432",
//     name: "Freelancers Collective",
//     amount: 5000,
//     type: "payment",
//     subscription_amount: 8500,
//     credit_score_affected: -10,
//     chit_fund_name: "Independent Professionals Fund",
//     chit_fund_image: "https://source.unsplash.com/random/400x400?freelancers,8",
//     status: undefined,
//     created_at: new Date(2024, 4, 20),
//   },
//   {
//     id: "a123b456-c789d012-e345f678",
//     name: "Tech Innovators Club",
//     amount: 7500,
//     type: "payout",
//     subscription_amount: 12000,
//     credit_score_affected: -15,
//     chit_fund_name: "Future Leaders Fund",
//     chit_fund_image: "https://source.unsplash.com/random/400x400?technology,5",
//     status: "approved",
//     created_at: new Date(2024, 5, 15),
//   },
//   {
//     id: "g987h654-i321j098-k765l432",
//     name: "Women Entrepreneurs Circle",
//     amount: 6500,
//     type: "payout",
//     subscription_amount: 10000,
//     credit_score_affected: -18,
//     chit_fund_name: "Empowerment Growth Fund",
//     chit_fund_image: "https://source.unsplash.com/random/400x400?women,6",
//     status: "requested",
//     created_at: new Date(2024, 7, 10),
//   },
//   {
//     id: "m123n456-o789p012-q345r678",
//     name: "Startup Founders Hub",
//     amount: 8200,
//     type: "payout",
//     subscription_amount: 13000,
//     credit_score_affected: -22,
//     chit_fund_name: "NextGen Founders Fund",
//     chit_fund_image: "https://source.unsplash.com/random/400x400?startup,7",
//     status: "disbursed",
//     created_at: new Date(2024, 6, 5),
//   },
//   {
//     id: "y123z456-a789b012-c345d678",
//     name: "Small Business Owners Club",
//     amount: 9700,
//     type: "payout",
//     subscription_amount: 15000,
//     credit_score_affected: -25,
//     chit_fund_name: "Growth Accelerator Fund",
//     chit_fund_image: "https://source.unsplash.com/random/400x400?business,9",
//     status: "cancelled",
//     created_at: new Date(2024, 3, 8),
//   },
//   {
//     id: "s987t654-u321v098-w765x432",
//     name: "Freelancers Collective",
//     amount: 5400,
//     type: "payment",
//     subscription_amount: 8500,
//     credit_score_affected: 10,
//     chit_fund_name: "Independent Professionals Fund",
//     chit_fund_image: "https://source.unsplash.com/random/400x400?freelancers,8",
//     status: undefined,
//     created_at: new Date(2024, 4, 20),
//   },
//   {
//     id: "y123z456-a789b012-c345d678",
//     name: "Small Business Owners Club",
//     amount: 9700,
//     type: "payout",
//     subscription_amount: 15000,
//     credit_score_affected: -25,
//     chit_fund_name: "Growth Accelerator Fund",
//     chit_fund_image: "https://source.unsplash.com/random/400x400?business,9",
//     status: "rejected",
//     created_at: new Date(2024, 3, 8),
//   },
// ];

export default function Transactions() {
  const { data, isLoading, refetch, isRefetching } = useQuery(
    trpc.transactions.getInfinitiyOfSubscriber.queryOptions()
  );

  if (isLoading) return <SpinnerView />;

  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={isRefetching} onRefresh={() => refetch()} />
      }
      showsVerticalScrollIndicator={false}
      className="flex-1"
    >
      <LinearBlurView>
        <H2>Transactions</H2>

        {/** Search Bar */}
        <View className="relative flex-row items-center">
          <Search className="absolute z-30 ml-2.5 mr-2.5 size-4 text-muted-foreground" />
          <Input
            placeholder="Search..."
            placeholderClassName="text-sm"
            className="ps-8 w-full h-11"
          />
        </View>

        {/** Filters */}
        <View className="flex-row gap-2">
          <Button className="border-dashed" variant={"outline"} size={"sm"}>
            <Text>Payouts</Text>
          </Button>
        </View>

        {/** Transaction List */}
        <View className="gap-2">
          {data?.map((t, i) => (
            <Link key={i} asChild href={`/transaction/${t.transactionId}`}>
              <TouchableOpacity>
                <Card>
                  <CardHeader className="gap-3">
                    <View className="gap-2 flex-row justify-between items-center">
                      <CardTitle className="text-base">
                        {t.batch?.name}
                      </CardTitle>

                      <View className="flex-row items-center gap-1">
                        <Large>
                          {t.totalAmount.toLocaleString("en-IN", {
                            currency: "INR",
                            currencyDisplay: "narrowSymbol",
                            currencySign: "standard",
                            style: "currency",
                            maximumFractionDigits: 0,
                          })}
                        </Large>
                        {t.type === "payout" ? (
                          <ArrowDownLeft
                            strokeWidth={1}
                            className="text-foreground size-6"
                          />
                        ) : (
                          <ArrowUpRight
                            strokeWidth={1}
                            className="text-foreground size-6"
                          />
                        )}
                      </View>
                    </View>

                    <View className="flex-row justify-between items-center">
                      <View className="flex-row items-center gap-2">
                        <Avatar className="size-5" alt={""}>
                          <AvatarImage source={{ uri: "" }} />
                          <AvatarFallback>
                            <Text className="text-[8px]">
                              {t.collector?.orgName.charAt(0).toUpperCase()}
                            </Text>
                          </AvatarFallback>
                        </Avatar>
                        <Small className="text-xs">
                          {t.collector?.orgName}
                        </Small>
                      </View>

                      {t.type === "payment" ? (
                        <Text
                          className={cn(
                            t.creditScoreAffected > 0
                              ? "text-primary"
                              : "text-destructive"
                          )}
                        >
                          {t.creditScoreAffected}
                        </Text>
                      ) : (
                        <PayoutStatusBadge status={t.payoutStatus ?? ""} />
                      )}
                    </View>
                  </CardHeader>
                  <CardFooter>
                    <Muted className="text-xs">2 hours ago</Muted>
                  </CardFooter>
                </Card>
              </TouchableOpacity>
            </Link>
          ))}
        </View>
      </LinearBlurView>
    </ScrollView>
  );
}
