import type { Config } from "tailwindcss";
// @ts-expect-error - no types
import nativewind from "nativewind/preset";
import plugin from "tailwindcss/plugin";

export default {
  darkMode: "class",
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  presets: [nativewind],
  theme: {
    extend: {
      colors: {
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
        },
        destructive: {
          DEFAULT: "var(--destructive)",
          foreground: "var(--destructive-foreground)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
        },
        popover: {
          DEFAULT: "var(--popover)",
          foreground: "var(--popover-foreground)",
        },
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },
      },
      borderColor: {
        DEFAULT: "var(--border)",
      },
    },
  },
  plugins: [
    plugin(({ addUtilities }) => {
      const newUtilities = {
        ".font-thin": { fontFamily: "Urbanist_100Thin" },
        ".font-extralight": { fontFamily: "Urbanist_200ExtraLight" },
        ".font-light": { fontFamily: "Urbanist_300Light" },
        ".font-normal": { fontFamily: "Urbanist_400Regular" },
        ".font-medium": { fontFamily: "Urbanist_500Medium" },
        ".font-semibold": { fontFamily: "Urbanist_600SemiBold" },
        ".font-bold": { fontFamily: "Urbanist_700Bold", fontWeight: "unset" },
        ".font-extrabold": {
          fontFamily: "Urbanist_800ExtraBold",
          fontWeight: "unset",
        },
        ".font-black": { fontFamily: "Urbanist_900Black", fontWeight: "unset" },
        ".font-fira": {
          fontFamily: "FiraCode_400Regular",
          fontWeight: "unset",
        },
        ".font-fira-bold": {
          fontFamily: "FiraCode_700Bold",
          fontWeight: "unset",
        },
      };
      addUtilities(newUtilities);
    }),
  ],
} satisfies Config;
