import { Suspense } from "react";
import type { Metadata } from "next";
import { Cormorant_Garamond, Noto_Sans_KR } from "next/font/google";

import { ReferralTracker } from "@/components/referral-tracker";
import { ScrollToTopButton } from "@/components/scroll-to-top-button";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

import "./globals.css";

const notoSansKr = Noto_Sans_KR({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-display",
});

export const metadata: Metadata = {
  title: "CAREIS",
  description: "낮과 밤을 위한 2-step 더마코스메틱 루틴 브랜드",
  icons: {
    icon: [
      { url: "/favicon-48.png", type: "image/png", sizes: "48x48" },
      { url: "/favicon-32.png", type: "image/png", sizes: "32x32" },
      { url: "/favicon-16.png", type: "image/png", sizes: "16x16" },
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-64.png", type: "image/png", sizes: "64x64" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={`${notoSansKr.className} ${cormorant.variable}`}>
        <div className="min-h-screen bg-[#FAFAF8]">
          <Suspense fallback={null}>
            <ReferralTracker />
          </Suspense>
          <ScrollToTopButton />
          <SiteHeader />
          <main className="mx-auto max-w-7xl px-6 pb-10 pt-8 md:px-8 md:pb-14 md:pt-10 lg:pt-8">{children}</main>
          <SiteFooter />
        </div>
      </body>
    </html>
  );
}
