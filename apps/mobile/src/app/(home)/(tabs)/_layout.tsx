import { useUser } from "@clerk/clerk-expo";
import { Stack, Tabs } from "expo-router";
import React from "react";
import { SolarIcon } from "react-native-solar-icons";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";

export default function TabsLayout() {
  const { user } = useUser();
  return (
    <React.Fragment>
      <Stack.Screen options={{ headerShown: false }} />
      <Tabs
        screenOptions={{
          headerTitleStyle: {
            fontFamily: "Urbanist_600SemiBold",
            fontSize: 30,
          },
          headerTransparent: true,
          tabBarStyle: {
            height: 64,
          },
          tabBarLabelStyle: {
            fontSize: 8,
            fontFamily: "Urbanist_500Medium",
          },
          tabBarPosition: "bottom",
          headerShown: false,
          animation: "fade",
          tabBarHideOnKeyboard: true,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Home",
            tabBarIcon: ({ color, focused, size }) => (
              <SolarIcon
                name="HomeSmile"
                size={size}
                type={focused ? "bold-duotone" : "line-duotone"}
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="batches"
          options={{
            title: "Batches",
            headerTitle: "All Batches",
            tabBarIcon: ({ color, focused, size }) => (
              <SolarIcon
                type={focused ? "bold-duotone" : "line-duotone"}
                name="Layers"
                size={size}
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="transactions"
          options={{
            title: "Transactions",
            headerTitle: "Transactions",
            tabBarIcon: ({ color, focused, size }) => (
              <SolarIcon
                type={focused ? "bold-duotone" : "line-duotone"}
                size={size}
                color={color}
                name="RoundTransferHorizontal"
              />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: "Profile",
            headerTitle: "Your Profile",
            tabBarIcon: ({ color, focused, size }) => (
              <Avatar
                className="size-6"
                alt={`user-${user?.firstName?.charAt(0)}`}
              >
                <AvatarImage source={{ uri: user?.imageUrl }} />
                <AvatarFallback>{user?.firstName?.charAt(0)}</AvatarFallback>
              </Avatar>
            ),
          }}
        />
      </Tabs>
    </React.Fragment>
  );
}
