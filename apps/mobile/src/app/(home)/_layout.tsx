import { Stack } from "expo-router";

export default function HomeLayout() {
  return (
    <Stack
      screenOptions={{
        headerTitleStyle: {
          fontFamily: "Urbanist_400Regular",
        },
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen name="cfh/[id]" options={{ title: "" }} />
      <Stack.Screen name="transaction/[id]" options={{ title: "" }} />
      <Stack.Screen
        name="credit-score"
        options={{ title: "Credit Score History" }}
      />
    </Stack>
  );
}
