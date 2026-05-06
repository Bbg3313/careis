import { Suspense } from "react";
import type { Metadata } from "next";
import { Cormorant_Garamond, Noto_Sans_KR } from "next/font/google";

import { ReferralTracker } from "@/components/referral-tracker";
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
  description: "병원 유통 기반 더마 코스메틱 브랜드 커머스 MVP",
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
          <SiteHeader />
          <main className="mx-auto max-w-7xl px-6 pb-10 pt-32 md:px-8 md:pb-14 md:pt-36 lg:pt-32">{children}</main>
          <SiteFooter />
        </div>
      </body>
    </html>
  );
}
