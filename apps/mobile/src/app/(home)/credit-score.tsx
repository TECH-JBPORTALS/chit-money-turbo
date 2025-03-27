import { ScrollView, View } from "react-native";
import { H1, Muted, P, Small } from "~/components/ui/typography";
import { cn } from "~/lib/utils";

const data = [
  {
    date: "12 Jun, 2025",
    value: -10,
  },
  {
    date: "10 May, 2025",
    value: 10,
  },
  {
    date: "11 Apr, 2025",
    value: -20,
  },
  {
    date: "25 Feb, 2025",
    value: 10,
  },
  {
    date: "12 Jun, 2025",
    value: 10,
  },
  {
    date: "12 Jun, 2025",
    value: 10,
  },
  {
    date: "12 Jun, 2025",
    value: 10,
  },
  {
    date: "12 Jun, 2025",
    value: 10,
  },
  {
    date: "12 Jun, 2025",
    value: 10,
  },
  {
    date: "12 Jun, 2025",
    value: 10,
  },
  {
    date: "12 Jun, 2025",
    value: 10,
  },
  {
    date: "12 Jun, 2025",
    value: 10,
  },
  {
    date: "12 Jun, 2025",
    value: 10,
  },
  {
    date: "12 Jun, 2025",
    value: 10,
  },
  {
    date: "12 Jun, 2025",
    value: 10,
  },
  {
    date: "12 Jun, 2025",
    value: 10,
  },
  {
    date: "12 Jun, 2025",
    value: 10,
  },
  {
    date: "12 Jun, 2025",
    value: 10,
  },
];

export default function CreditScore() {
  return (
    <ScrollView showsVerticalScrollIndicator={false} className="flex-1  ">
      <View className="gap-6 flex-1 px-4 py-6">
        <View className="flex-row justify-center items-center gap-3 ">
          <H1 className="text-6xl">764</H1>
          <P className="text-destructive">-20</P>
        </View>

        {/** Overview Bar */}
        <View className="flex-row gap-0.5 w-full h-9">
          <View className="w-full flex-1 h-full bg-primary opacity-50 rounded-sm" />
          <View className="w-full flex-1 h-full bg-primary rounded-sm" />
          <View className="w-full flex-1 h-full bg-destructive rounded-sm" />
        </View>

        <View className="flex-row justify-between">
          <View className="flex-row items-center gap-1">
            <View className="size-1 rounded-full opacity-50 bg-primary" />
            <Small className="text-xs">2 Pre-Payments</Small>
          </View>
          <View className="flex-row items-center gap-1">
            <View className="size-1 rounded-full  bg-primary" />
            <Small className="text-xs">24 On-time Payments</Small>
          </View>
          <View className="flex-row items-center gap-1">
            <View className="size-1 rounded-full opacity-50 bg-destructive" />
            <Small className="text-xs">24 Late Payments</Small>
          </View>
        </View>

        {/** History List */}
        <View>
          {data.map((item, index) => (
            <View
              key={index}
              className="flex-row py-2 items-center justify-between"
            >
              <Muted>{item.date}</Muted>
              <Small
                className={cn(
                  "text-base",
                  item.value > 0 ? "text-primary" : "text-destructive"
                )}
              >
                {item.value > 0 ? `+${item.value}` : item.value}
              </Small>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}
