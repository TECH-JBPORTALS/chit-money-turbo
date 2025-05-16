import { Stack } from "expo-router";
import React from "react";

export default function HomeLayout() {
  return (
    <React.Fragment>
      <Stack.Screen options={{ headerShown: false }} />
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
        <Stack.Screen name="payment/[paymentId]" options={{ title: "" }} />
        <Stack.Screen name="payout/[payoutId]" options={{ title: "" }} />
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
        <Stack.Screen
          name="profile/documents"
          options={{ title: "Documents" }}
        />
        <Stack.Screen
          name="profile/bank-details"
          options={{ title: "Bank Details" }}
        />
      </Stack>
    </React.Fragment>
  );
}
