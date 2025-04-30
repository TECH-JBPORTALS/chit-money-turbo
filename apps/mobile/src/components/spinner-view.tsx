import React from "react";
import Spinner from "./ui/spinner";
import { useColorScheme } from "~/lib/useColorScheme";
import { View } from "react-native";

export function SpinnerView() {
  const { isDarkColorScheme } = useColorScheme();
  return (
    <View className="flex h-screen items-center justify-center">
      <Spinner size={48} color={!isDarkColorScheme ? "black" : "white"} />
    </View>
  );
}
