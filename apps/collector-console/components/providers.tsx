"use client";
import { NuqsAdapter } from "nuqs/adapters/next/app";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { StepsProvider } from "react-step-builder";
import { TooltipProvider } from "@cmt/ui/components/tooltip";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NuqsAdapter>
      {/* <NextThemesProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
        enableColorScheme
      > */}
      <StepsProvider>
        <TooltipProvider>
          <>{children}</>
        </TooltipProvider>
      </StepsProvider>
      {/* </NextThemesProvider> */}
    </NuqsAdapter>
  );
}
