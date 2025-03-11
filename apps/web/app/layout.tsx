import { Urbanist, Geist_Mono, Geist } from "next/font/google";

import "@cmt/ui/globals.css";
import { Providers } from "@/components/providers";

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${fontSans.variable} ${fontGeist.variable} dark ${fontMono.variable} font-sans antialiased `}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
