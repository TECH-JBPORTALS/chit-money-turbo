import "./globals.css";
import { Urbanist, Geist_Mono, Geist } from "next/font/google";
import type { Metadata } from "next";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { extractRouterConfig } from "uploadthing/server";
import { Providers } from "@/components/providers";
import { ClerkProvider } from "@clerk/nextjs";
import { ourFileRouter } from "@cmt/api/uploadthing";
import { Toaster } from "@cmt/ui/components/sonner";

const fontSans = Urbanist({
  subsets: ["latin"],
  variable: "--font-sans",
});

const fontGeist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
});

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "Chit.Money",
  description: "Modernize Your Chit Fund Management",
  keywords: ["chit fund", "funds"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body
          className={`${fontSans.variable} ${fontGeist.variable} ${fontMono.variable} font-sans antialiased `}
        >
          <Providers>
            <NextSSRPlugin
              /**
               * The `extractRouterConfig` will extract **only** the route configs
               * from the router to prevent additional information from being
               * leaked to the client. The data passed to the client is the same
               * as if you were to fetch `/api/uploadthing` directly.
               */
              routerConfig={extractRouterConfig(ourFileRouter)}
            />
            {children}
            <Toaster />
          </Providers>
        </body>
      </html>
    </ClerkProvider>
  );
}
