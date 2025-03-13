import { StatusBar } from "expo-status-bar";
import { Text, View } from "react-native";

export default function Welcome() {
  return (
    <View className="flex-1 bg-background items-center justify-center">
      <Text className="text-4xl text-foreground text-center font-bold">
        Open up App.tsx to start working on your app!
      </Text>
      <Text className="text-muted-foreground text-2xl font-bold">
        Hello world
      </Text>
      <StatusBar style="auto" />
    </View>
  );
}
