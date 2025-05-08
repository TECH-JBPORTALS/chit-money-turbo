import { Stack } from "expo-router";

export const unstable_settings = {
  initialRouteName: "index",
};

export default function AuthRoutesLayout() {
  return (
    <Stack
      screenOptions={{
        headerTitleAlign: "center",
        headerTitleStyle: {
          fontFamily: "Urbanist_400Regular",
        },
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen name="index" options={{ title: "" }} />
      <Stack.Screen name="sign-up" options={{ title: "Create Account" }} />
      <Stack.Screen name="sign-in" options={{ title: "Sign In" }} />
    </Stack>
  );
}
