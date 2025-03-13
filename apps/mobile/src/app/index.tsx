import { StatusBar } from "expo-status-bar";
import { Text, View } from "react-native";

export default function Welcome() {
  return (
    <View className="flex-1 bg-background p-6 items-center gap-12 justify-end">
      <StatusBar style="auto" backgroundColor="transparent" />
      <View className="gap-4 items-center w-full">
        <Text className="text-4xl font-extrabold text-foreground text-center">
          Manage all your chit funds
        </Text>
        <Text className="text-muted-foreground text-sm font-normal text-center w-5/6">
          Get due dates, payment history, credit score all in one place
        </Text>
      </View>
    </View>
  );
}
