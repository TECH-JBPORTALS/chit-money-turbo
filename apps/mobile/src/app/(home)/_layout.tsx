import { useAuth } from "@clerk/clerk-expo";
import { Redirect, Stack } from "expo-router";

export default function HomeLayout() {
  const { isSignedIn } = useAuth();

  if (!isSignedIn) {
    return <Redirect href={"/(auth)"} />;
  }

  return (
    <Stack
      screenOptions={{
        headerTitleStyle: {
          fontFamily: "Urbanist_400Regular",
        },
        headerShadowVisible: false,
      }}
      initialRouteName="(tabs)"
    >
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="(batch)" options={{ title: "" }} />
      <Stack.Screen name="cfh/[id]" options={{ title: "" }} />
      <Stack.Screen name="transaction/[id]" options={{ title: "" }} />
      <Stack.Screen
        name="credit-score"
        options={{ title: "Credit Score History" }}
      />
      <Stack.Screen
        name="profile/pn-details"
        options={{ title: "Profile & Nominee Details" }}
      />
      <Stack.Screen
        name="profile/contact-details"
        options={{ title: "Contact Details" }}
      />
      <Stack.Screen name="profile/documents" options={{ title: "Documents" }} />
      <Stack.Screen
        name="profile/bank-details"
        options={{ title: "Bank Details" }}
      />
    </Stack>
  );
}
