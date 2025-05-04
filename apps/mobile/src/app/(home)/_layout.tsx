import { useAuth } from "@clerk/clerk-expo";
import { Redirect, Stack } from "expo-router";
import React from "react";

export default function Layout() {
  const { isSignedIn } = useAuth();

  if (!isSignedIn) {
    return <Redirect href={"/(auth)"} />;
  }

  return (
    <Stack
      screenOptions={{
        headerShadowVisible: false,
        headerTitleStyle: {
          fontFamily: "Urbanist_600SemiBold",
          fontSize: 30,
        },
      }}
    >
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="(batch)" options={{ title: "" }} />
    </Stack>
  );
}
