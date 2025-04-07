import type { ConfigContext, ExpoConfig } from "expo/config";

export default ({ config }: ConfigContext) => {   
  const { name, scheme } = getConfig();

  return {
    ...config,
    name,
    slug: "chit-money",
    version: "1.0.0",
    scheme,
    orientation: "portrait",
    owner: "jb-portals",
    icon: "./assets/icon.png",
    assetBundlePatterns: ["**/*"],
    userInterfaceStyle: "automatic",
    platforms: ["ios", "android"],
    newArchEnabled: true,
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
      package: scheme,
    },
    updates: {
      url: "https://u.expo.dev/af73ccee-6f1b-4a7e-a1f7-4daeb769609f",
    },
    runtimeVersion: {
      policy: "appVersion",
    },
    web: {
      favicon: "./assets/favicon.png",
      output: "server",
    },
    plugins: [
      [
        "expo-router",
        {
          origin: "https://chit-money-sub-nerd--api-only.expo.app",
        },
      ],
      "expo-font",
      ["expo-dev-client", { launchMode: "most-recent" }],
    ],
  } satisfies ExpoConfig;
};


function getConfig() {
  
  switch (process.env.APP_ENV) {
    case "development":
      return {
        name: "Chit.Money (Development)",
        scheme: "com.jb_portals.chit.money.development",
      };
    case "preview":
      return {
        name: "Chit.Money (Preview)",
        scheme: "com.jb_portals.chit.money.preview",
      };
    default:
      return {
        name: "Chit.Money",
        scheme: "com.jb_portals.chit.money",
      };
  }
}

