"use client";
import { NuqsAdapter } from "nuqs/adapters/next/app";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NuqsAdapter>
      <NextThemesProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
        enableColorScheme
      >
        <>{children}</>
      </NextThemesProvider>
    </NuqsAdapter>
  );
}
