import type { ConfigContext, ExpoConfig } from "expo/config";

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: "Chit.Money",
  slug: "chit-money",
  owner: "jb-portals",
  version: "1.0.0",
  scheme: "com.jb_portals.chit.money",
  orientation: "portrait",
  icon: "./assets/icon.png",
  assetBundlePatterns: ["**/*"],
  userInterfaceStyle: "automatic",
  // newArchEnabled: false,
  splash: {
    image: "./assets/splash-icon.png",
    resizeMode: "contain",
    backgroundColor: "#ffffff",
  },
  ios: {
    supportsTablet: true,
  },
  extra: {
    eas: {
      projectId: "af73ccee-6f1b-4a7e-a1f7-4daeb769609f",
    },
  },
  android: {
    adaptiveIcon: {
      foregroundImage: "./assets/adaptive-icon.png",
      backgroundColor: "#ffffff",
    },
    package: "com.jb_portals.chit.money",
  },
  web: {
    favicon: "./assets/favicon.png",
    output: "server",
  },
  updates: {
    url: "https://u.expo.dev/af73ccee-6f1b-4a7e-a1f7-4daeb769609f",
  },
  runtimeVersion: {
    policy: "appVersion",
  },
  plugins: [
    "expo-font",
    [
      "expo-router",
      {
        origin: "https://chit-money-sub-nerd--api-only.expo.app",
      },
    ],
    [
      "expo-dev-client",
      {
        launchMode: "most-recent",
      },
    ],
  ],
});
