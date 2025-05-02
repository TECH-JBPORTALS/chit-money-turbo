import React from "react";
import Spinner from "./ui/spinner";
import { useColorScheme } from "~/lib/useColorScheme";
import { View } from "react-native";

export function SpinnerView() {
  const { isDarkColorScheme } = useColorScheme();
  return (
    <View className="pt-36 h-full flex-1 items-center justify-center">
      <Spinner size={38} color={!isDarkColorScheme ? "black" : "white"} />
    </View>
  );
}
