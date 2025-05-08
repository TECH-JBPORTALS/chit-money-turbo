import "../globals.css";
import { Stack, useFocusEffect, useRouter, useSegments } from "expo-router";
import { tokenCache } from "~/lib/cache";
import {
  useFonts,
  Urbanist_800ExtraBold,
  Urbanist_100Thin,
  Urbanist_200ExtraLight,
  Urbanist_300Light,
  Urbanist_400Regular,
  Urbanist_500Medium,
  Urbanist_600SemiBold,
  Urbanist_700Bold,
  Urbanist_900Black,
} from "@expo-google-fonts/urbanist";
import {
  FiraCode_400Regular,
  FiraCode_700Bold,
} from "@expo-google-fonts/fira-code";
import * as SplashScreen from "expo-splash-screen";
import { ClerkProvider, useUser } from "@clerk/clerk-expo";
import {
  Theme,
  ThemeProvider,
  DefaultTheme,
  DarkTheme,
} from "@react-navigation/native";
import React, { useCallback, useEffect } from "react";
import { NAV_THEME } from "~/lib/constants";
import { useColorScheme } from "~/lib/useColorScheme";
import { StatusBar } from "expo-status-bar";
import { setAndroidNavigationBar } from "~/lib/android-navigation-bar";
import { View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { PortalHost } from "@rn-primitives/portal";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "~/utils/api";
import { Toaster } from "sonner-native";

const LIGHT_THEME: Theme = {
  ...DefaultTheme,
  colors: NAV_THEME.light,
};
const DARK_THEME: Theme = {
  ...DarkTheme,
  colors: NAV_THEME.dark,
};

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

SplashScreen.preventAutoHideAsync();

//Entry Layout
export default function RootLayout() {
  const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

  if (!publishableKey) {
    throw new Error("Add EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY to your .env file");
  }

  return (
    <ClerkProvider tokenCache={tokenCache} publishableKey={publishableKey}>
      <QueryClientProvider client={queryClient}>
        <GestureHandlerRootView>
          <Outlet />
          <PortalHost />
          <Toaster />
        </GestureHandlerRootView>
      </QueryClientProvider>
    </ClerkProvider>
  );
}

function ThemeWrapper({ children }: { children: React.ReactNode }) {
  const { isDarkColorScheme } = useColorScheme();

  return (
    <ThemeProvider value={isDarkColorScheme ? DARK_THEME : LIGHT_THEME}>
      <View
        style={{
          flex: 1,
          backgroundColor: isDarkColorScheme
            ? NAV_THEME.dark.background
            : NAV_THEME.light.background,
        }}
      >
        <StatusBar
          style={isDarkColorScheme ? "light" : "dark"}
          backgroundColor="transparent"
        />
        {children}
      </View>
    </ThemeProvider>
  );
}

export const unstable_settings = {
  initialRouteName: "(home)",
};

//Setting things app before loading the app
function Outlet() {
  const [fontsLoaded, error] = useFonts({
    Urbanist_100Thin,
    Urbanist_200ExtraLight,
    Urbanist_300Light,
    Urbanist_400Regular,
    Urbanist_500Medium,
    Urbanist_600SemiBold,
    Urbanist_700Bold,
    Urbanist_800ExtraBold,
    Urbanist_900Black,
    FiraCode_400Regular,
    FiraCode_700Bold,
  });
  const { colorScheme, setColorScheme } = useColorScheme();
  const [isColorSchemeLoaded, setIsColorSchemeLoaded] = React.useState(false);
  const { isSignedIn, isLoaded, user } = useUser();
  const segments = useSegments();
  const router = useRouter();
  const onboardingComplete = user?.publicMetadata.onboardingComplete as boolean;

  useEffect(() => {
    (async () => {
      const theme = await AsyncStorage.getItem("theme");

      if (!theme) {
        setAndroidNavigationBar(colorScheme);
        AsyncStorage.setItem("theme", colorScheme);
        setIsColorSchemeLoaded(true);
        return;
      }
      const colorTheme = theme === "dark" ? "dark" : "light";
      setAndroidNavigationBar(colorScheme);

      if (colorTheme !== colorScheme) {
        setColorScheme(colorTheme);
        setIsColorSchemeLoaded(true);
        return;
      }

      setIsColorSchemeLoaded(true);
    })();
  }, [isColorSchemeLoaded]);

  useFocusEffect(
    useCallback(() => {
      if (!isLoaded || !isColorSchemeLoaded || !fontsLoaded) {
        return;
      }
      SplashScreen.hideAsync();
    }, [
      isLoaded,
      isSignedIn,
      onboardingComplete,
      isColorSchemeLoaded,
      fontsLoaded,
      segments,
      router,
    ])
  );

  if (error) console.log("font error", error);

  return (
    <ThemeWrapper>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Protected guard={isSignedIn! && onboardingComplete}>
          <Stack.Screen name="(home)" />
        </Stack.Protected>
        <Stack.Protected guard={!isSignedIn}>
          <Stack.Screen name="(auth)" />
        </Stack.Protected>
        <Stack.Protected guard={isSignedIn! && !onboardingComplete}>
          <Stack.Screen name="(onboarding)" />
        </Stack.Protected>
      </Stack>
    </ThemeWrapper>
  );
}
