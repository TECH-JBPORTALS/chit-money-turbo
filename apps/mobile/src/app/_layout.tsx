import "../globals.css";
import { Stack, useRouter, useSegments } from "expo-router";
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
import * as SplashScreen from "expo-splash-screen";
import { ClerkProvider, useClerk, useUser } from "@clerk/clerk-expo";
import {
  Theme,
  ThemeProvider,
  DefaultTheme,
  DarkTheme,
} from "@react-navigation/native";
import React from "react";
import { NAV_THEME } from "~/lib/constants";
import { useColorScheme } from "~/lib/useColorScheme";
import useIsomorphicLayoutEffect from "use-isomorphic-layout-effect";
import { StatusBar } from "expo-status-bar";

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

//Setting things app before loading the app
function Outlet() {
  const [loaded, error] = useFonts({
    Urbanist_100Thin,
    Urbanist_200ExtraLight,
    Urbanist_300Light,
    Urbanist_400Regular,
    Urbanist_500Medium,
    Urbanist_600SemiBold,
    Urbanist_700Bold,
    Urbanist_800ExtraBold,
    Urbanist_900Black,
  });
  const hasMounted = React.useRef(false);
  const { isDarkColorScheme } = useColorScheme();
  const [isColorSchemeLoaded, setIsColorSchemeLoaded] = React.useState(false);
  const { isSignedIn, isLoaded, user } = useUser();
  const segments = useSegments();
  const router = useRouter();

  useIsomorphicLayoutEffect(() => {
    if (hasMounted.current && (loaded || error) && isLoaded && isLoaded) {
      const isAuthSegment = segments["0"] === "(auth)";
      const isHomeSegment = segments["0"] === "(home)";

      if (isSignedIn && isAuthSegment) {
        router.replace("/(home)");
      } else if (!isSignedIn && isHomeSegment) {
        router.replace("/(auth)");
      }

      SplashScreen.hideAsync();
    }
    setIsColorSchemeLoaded(true);
    hasMounted.current = true;
  }, [loaded, error, isLoaded]);

  if (!isColorSchemeLoaded || (!loaded && !error)) {
    return null;
  }

  return (
    <ThemeProvider value={isDarkColorScheme ? DARK_THEME : LIGHT_THEME}>
      <StatusBar
        style={isDarkColorScheme ? "light" : "dark"}
        backgroundColor="transparent"
      />
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      />
    </ThemeProvider>
  );
}

//Entry Layout
export default function RootLayout() {
  const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

  if (!publishableKey) {
    throw new Error("Add EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY to your .env file");
  }

  return (
    <ClerkProvider tokenCache={tokenCache} publishableKey={publishableKey}>
      <Outlet />
    </ClerkProvider>
  );
}
