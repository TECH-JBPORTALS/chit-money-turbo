import type { ConfigContext, ExpoConfig } from "expo/config";

export default ({ config }: ConfigContext) => {
  const { name, scheme, adaptiveIcon } = getConfig();

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
    ios: {
      supportsTablet: true,
      icon: {
        light: "./assets/icons/ios-light-icon.png",
        dark: "./assets/icons/ios-dark-icon.png",
        tinted: "./assets/icons/ios-tinted-icon.png",
      },
    },
    extra: {
      eas: {
        projectId: "af73ccee-6f1b-4a7e-a1f7-4daeb769609f",
      },
    },
    android: {
      adaptiveIcon: {
        foregroundImage: adaptiveIcon,
        monochromeImage: adaptiveIcon,
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
      [
        "expo-splash-screen",
        {
          image: "./assets/icons/splash-icon-light.png",
          resizeMode: "contain",
          imageWidth: 200,
          backgroundColor: "#ffffff",
          dark: {
            image: "./assets/icons/splash-icon-dark.png",
            backgroundColor: "#020806",
          },
        },
      ],
    ],
    experiments: {
      tsconfigPaths: true,
      typedRoutes: true,
    },
  } satisfies ExpoConfig;
};

function getConfig() {
  switch (process.env.APP_ENV) {
    case "development":
      return {
        name: "Chit.Money (Development)",
        scheme: "money.chit.development",
        adaptiveIcon: "./assets/icons/android-adaptive-dev-icon.png",
      };
    case "preview":
      return {
        name: "Chit.Money (Preview)",
        scheme: "money.chit.preview",
        adaptiveIcon: "./assets/icons/android-adaptive-preview-icon.png",
      };
    case "production":
      return {
        name: "Chit.Money",
        scheme: "money.chit.app",
        adaptiveIcon: "./assets/icons/android-adaptive-icon.png",
      };
    default:
      return {
        name: "Chit.Money",
        scheme: "money.chit.app",
        adaptiveIcon: "./assets/icons/android-adaptive-icon.png",
      };
  }
}
