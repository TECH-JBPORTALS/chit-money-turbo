import React from "react";
import { View } from "react-native";
import Spinner from "./ui/spinner";
import { useColorScheme } from "~/lib/useColorScheme";

export function SpinnerView() {
  const { isDarkColorScheme } = useColorScheme();
  return (
    <View className="flex items-center py-5 justify-center">
      <Spinner size={42} color={!isDarkColorScheme ? "black" : "white"} />
    </View>
  );
}
