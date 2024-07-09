import type { Metadata } from "next";
import Script from "next/script";

import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

import { Kanit } from "next/font/google";

import { env } from "@/utils/env/server";

import "./globals.css";

import Navbar from "./_components/navbar";

const kanit = Kanit({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "codepression",
  description: "it's me, it's your boy, it's kodeh",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={kanit.className}>
        <Navbar />

        {children}
        {env.NODE_ENV === "production" && <Analytics />}
        {env.NODE_ENV === "production" && <SpeedInsights />}
        {env.NODE_ENV === "production" && (
          <Script
            async
            src="/_stats/script.js"
            data-website-id="a41afee2-d12d-4379-99ce-62e7d8280e45"
            data-domains="codepression.io"
            data-host-url="/_stats"
          />
        )}
      </body>
    </html>
  );
}
