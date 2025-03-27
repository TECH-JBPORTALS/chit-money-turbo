import { Stack } from "expo-router";
import { ScrollView, View } from "react-native";
import { SolarIcon } from "react-native-solar-icons";
import {
  BatchCard,
  BatchCardBadge,
  BatchCardBadgeRow,
  BatchCardContent,
  BatchCardFooter,
  BatchCardHeader,
  BatchCardTitle,
} from "~/components/batch-card";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Progress } from "~/components/ui/progress";
import { Text } from "~/components/ui/text";
import { Lead, Muted, Small } from "~/components/ui/typography";

const batch = {
  id: "r234s567-t890u123-v456w789",
  name: "Young Entrepreneurs Network",
  target_amount: 55000,
  type: "Dividend Chit",
  subscription_amount: 9000,
  chit_fund_name: "Emerging Talent Fund",
  chit_fund_image: "https://github.com/x-sss-x.png",
  is_completed: false,
  number_of_months: 14,
  completed_months: 8,
  is_upcoming: true,
};

export default function BatchDetails() {
  return (
    <ScrollView showsVerticalScrollIndicator={false} className="flex-1  ">
      <Stack.Screen
        options={{ title: "", headerRight: () => <Lead>2/30 Months</Lead> }}
      />
      <View className="gap-6 flex-1 px-4 py-6">
        <BatchCard className="border-0">
          <BatchCardHeader className="px-0 pt-0 pb-3 justify-between">
            <Muted className="text-xs">Started on 2 Jan, 2024</Muted>
            {batch.is_completed ? (
              <View className="flex-row items-center">
                <Small className="text-xs inline-flex flex-row items-center">
                  Completed{" "}
                </Small>
                <SolarIcon
                  name="CheckCircle"
                  size={14}
                  color="green"
                  type="bold-duotone"
                />
              </View>
            ) : batch.is_upcoming ? (
              <View className="flex-row items-center">
                <Small className="text-xs inline-flex flex-row items-center">
                  Upcoming{" "}
                </Small>
                <SolarIcon
                  name="Record"
                  size={14}
                  color="gray"
                  type="bold-duotone"
                />
              </View>
            ) : (
              <View className="flex-row gap-1 flex-1 items-center">
                <Progress
                  className="h-1 flex-1"
                  value={
                    (batch.completed_months / batch.number_of_months) * 100
                  }
                />
                <Muted className="text-sm">
                  {batch.completed_months}/{batch.number_of_months} Months
                </Muted>
              </View>
            )}
          </BatchCardHeader>
          <BatchCardContent className="px-0 gap-3">
            <BatchCardTitle className="text-xl">{batch.name}</BatchCardTitle>
            <BatchCardBadgeRow>
              <BatchCardBadge>
                <Text>
                  {batch.target_amount.toLocaleString("en-IN", {
                    currencyDisplay: "symbol",
                    style: "currency",
                    currency: "INR",
                    maximumFractionDigits: 0,
                  })}
                </Text>
              </BatchCardBadge>
              <BatchCardBadge>
                <Text>{batch.type}</Text>
              </BatchCardBadge>
              <BatchCardBadge>
                <Text>
                  {batch.subscription_amount.toLocaleString("en-IN", {
                    currencyDisplay: "symbol",
                    style: "currency",
                    currency: "INR",
                    maximumFractionDigits: 0,
                  })}
                  /m
                </Text>
              </BatchCardBadge>
            </BatchCardBadgeRow>
          </BatchCardContent>
          <BatchCardFooter className="px-0 pb-0">
            <View className="flex-row items-center gap-2">
              <Avatar className="size-5" alt={batch.chit_fund_name}>
                <AvatarImage source={{ uri: batch.chit_fund_image }} />
                <AvatarFallback>
                  <Text className="text-[8px]">
                    {batch.chit_fund_name.charAt(0).toUpperCase()}
                  </Text>
                </AvatarFallback>
              </Avatar>
              <Small className="text-xs">{batch.chit_fund_name}</Small>
            </View>
          </BatchCardFooter>
        </BatchCard>
      </View>
    </ScrollView>
  );
}
