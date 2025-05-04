import React from "react";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import { View } from "react-native";
import { cn } from "~/lib/utils";
import { StyleSheet } from "react-native";

export function LinearBlurView({
  children,
  className,
  ...props
}: React.ComponentProps<typeof View>) {
  const gradient = [`rgba(5,148,103,0.15)`, "transparent"] as const;
  return (
    <View className="flex-1">
      <StatusBar animated translucent backgroundColor="transparent" />
      <LinearGradient
        locations={[0, 0.25]}
        style={StyleSheet.absoluteFill}
        colors={gradient}
        className="h-64"
      />
      <View className={cn("flex-1 px-4 py-1 gap-6", className)} {...props}>
        {children}
      </View>
    </View>
  );
}
