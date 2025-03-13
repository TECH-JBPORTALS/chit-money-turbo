import { StatusBar } from "expo-status-bar";
import { Text, View } from "react-native";

export default function Welcome() {
  return (
    <View className="flex-1 bg-primary items-center justify-center">
      <Text className="text-4xl text-primary-foreground text-center font-bold">
        Open up App.tsx to start working on your app!
      </Text>
      <Text>Hello world</Text>
      <StatusBar style="auto" />
    </View>
  );
}
