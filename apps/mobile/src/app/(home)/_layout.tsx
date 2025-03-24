import { Tabs } from "expo-router";
import { SolarIcon } from "react-native-solar-icons";

export default function Layout() {
  return (
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
            <SolarIcon
              type={focused ? "bold-duotone" : "line-duotone"}
              size={size}
              color={color}
              name="UserCircle"
            />
          ),
        }}
      />
    </Tabs>
  );
}
