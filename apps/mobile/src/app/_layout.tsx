import "../globals.css";
import { Slot } from "expo-router";
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

  useIsomorphicLayoutEffect(() => {
    if (hasMounted.current && (loaded || error)) {
      SplashScreen.hideAsync();
    }
    setIsColorSchemeLoaded(true);
    hasMounted.current = true;
  }, [loaded, error]);

  if (!isColorSchemeLoaded || (!loaded && !error)) {
    return null;
  }

  return (
    <ThemeProvider value={isDarkColorScheme ? DARK_THEME : LIGHT_THEME}>
      <StatusBar
        style={isDarkColorScheme ? "light" : "dark"}
        backgroundColor="transparent"
      />
      <Slot />
    </ThemeProvider>
  );
}

//Entry Layout
export default function RootLayout() {
  return <Outlet />;
}
