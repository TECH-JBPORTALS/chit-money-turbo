import React from "react";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import { View } from "react-native";
import { cn } from "~/lib/utils";

export function LinearBlurView({
  children,
  className,
  ...props
}: React.ComponentProps<typeof SafeAreaView>) {
  const gradient = [`rgba(5,148,103,0.15)`, "transparent"] as const;
  return (
    <View className="flex-1">
      <StatusBar animated translucent backgroundColor="transparent" />
      <LinearGradient
        locations={[0, 0.25]}
        colors={gradient}
        className="flex-1"
      >
        <SafeAreaView
          className={cn("flex-1 px-4 py-6 gap-6", className)}
          {...props}
        >
          {children}
        </SafeAreaView>
      </LinearGradient>
    </View>
  );
}
