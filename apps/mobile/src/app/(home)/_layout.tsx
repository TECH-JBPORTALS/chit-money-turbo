import { Stack } from "expo-router";

export default function HomeLayout() {
  return (
    <Stack
      initialRouteName="(tabs)"
      screenOptions={{
        headerTitleStyle: {
          fontFamily: "Urbanist_400Regular",
        },
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen
        name="credit-score"
        options={{ title: "Credit Score History" }}
      />
    </Stack>
  );
}
