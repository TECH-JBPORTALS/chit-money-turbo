import { Stack } from "expo-router";

export const unstable_settings = {
  initialRouteName: "(tabs)",
};

export default function Layout() {
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
