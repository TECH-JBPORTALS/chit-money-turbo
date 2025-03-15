import { Stack } from "expo-router/stack";

export default function Layout() {
  return (
    <Stack
      screenOptions={{
        headerTitleStyle: {
          fontFamily: "Urbanist_400Regular",
        },
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: "Chit.Money",
          headerTitleStyle: {
            fontFamily: "Urbanist_600SemiBold",
          },
        }}
      />
    </Stack>
  );
}
