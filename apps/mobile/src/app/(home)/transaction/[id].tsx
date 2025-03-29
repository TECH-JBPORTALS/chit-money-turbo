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
import { PayoutStatusBadge } from "~/lib/payout-badge";
import { Separator } from "~/components/ui/separator";
import { Button } from "~/components/ui/button";
import { ScrollView } from "react-native-gesture-handler";

const t = {
  id: "s987t654-u321v098-w765x432",
  name: "Freelancers Collective",
  amount: 5000,
  type: "payout",
  subscription_amount: 8500,
  credit_score_affected: -10,
  chit_fund_name: "Surya Chit fund",
  chit_fund_image: "https://github.com/x-sss-x.png",
  status: "cancelled",
  created_at: new Date(2024, 4, 20),
};

function PaymentDetails() {
  return (
    <>
      <Small className="font-bold">Payment Details</Small>

      <View className="gap-3">
        <View className="justify-between flex-row">
          <Muted>Payment ID</Muted>
          <Code className="font-fira-bold">#123ADU839KID</Code>
        </View>
        <View className="justify-between flex-row">
          <Muted>Credit Score Affected</Muted>
          <Code className="font-fira-bold text-primary">+5</Code>
        </View>
        <View className="justify-between flex-row">
          <Muted>Payment Date</Muted>
          <Code className="font-fira-bold">23 Jan, 2025</Code>
        </View>
        <View className="justify-between flex-row">
          <Muted>Payment Mode</Muted>
          <Code className="font-fira-bold">Online</Code>
        </View>
        <View className="justify-between flex-row">
          <Muted>Online Transaction ID</Muted>
          <Code className="font-fira-bold">AB8393NJKDIE92392</Code>
        </View>
      </View>

      <Small className="font-bold">Summary</Small>

      <View className="gap-3">
        <View className="justify-between flex-row">
          <Muted>{"Subscription Amount (#CHIT001)"}</Muted>
          <Code className="font-fira-bold">₹4,000</Code>
        </View>
        <View className="justify-between flex-row">
          <Muted>Total Interest</Muted>
          <Code className="font-fira-bold text-primary">₹1,000</Code>
        </View>
        <View className="justify-between flex-row">
          <Muted>Penalty Charges</Muted>
          <Code className="font-fira-bold">None</Code>
        </View>

        <Separator />

        <View className="justify-between flex-row">
          <Muted>Total Payment Amount</Muted>
          <Code className="font-fira-bold">₹5,000</Code>
        </View>
      </View>
    </>
  );
}

function PayoutDetails({ status }: { status: string }) {
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
              <Code className="font-fira-bold text-destructive">- ₹4,000</Code>
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
              <Code className="font-fira-bold text-destructive">- ₹4,000</Code>
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
}

export default function TransactionDetails() {
  return (
    <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
      <View className="flex-1 items-center py-6 px-4 justify-between">
        <View className="flex-1 w-full gap-6">
          {/** Transaction Top Card */}
          <View className="gap-3">
            <View className="flex-row justify-between items-center">
              <Lead className="text-foreground">JNANA 2024</Lead>
              <View className="flex-row items-center gap-1">
                <Large className="font-bold">
                  {t.amount.toLocaleString("en-IN", {
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
                <Avatar className="size-5" alt={t.chit_fund_name}>
                  <AvatarImage source={{ uri: t.chit_fund_image }} />
                  <AvatarFallback>
                    <Text className="text-[8px]">
                      {t.chit_fund_name.charAt(0).toUpperCase()}
                    </Text>
                  </AvatarFallback>
                </Avatar>
                <Small className="text-xs">{t.chit_fund_name}</Small>
              </View>
              {t.type === "payout" && (
                <PayoutStatusBadge status={t.status ?? ""} />
              )}
            </View>
          </View>

          {/** Content */}
          {t.type === "payment" ? (
            <PaymentDetails />
          ) : (
            <PayoutDetails status={t.status ?? ""} />
          )}
        </View>
        <H3 className="text-muted-foreground">Chit.Money</H3>
      </View>
    </ScrollView>
  );
}
