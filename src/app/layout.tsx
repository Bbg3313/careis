import { Suspense } from "react";
import type { Metadata } from "next";
import { headers } from "next/headers";
import { Cormorant_Garamond, Noto_Sans_KR } from "next/font/google";

import { ReferralTracker } from "@/components/referral-tracker";
import { ScrollToTopButton } from "@/components/scroll-to-top-button";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getSitePromoCountdown } from "@/lib/promo-countdown-site";
import {
  DEFAULT_DESCRIPTION,
  DEFAULT_KEYWORDS,
  DEFAULT_OG_IMAGE_PATH,
  SITE_NAME,
  SITE_TAGLINE,
  getMetadataBase,
} from "@/lib/site-seo";

import "./globals.css";

const notoSansKr = Noto_Sans_KR({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-display",
});

export const metadata: Metadata = {
  metadataBase: getMetadataBase(),
  title: {
    default: `${SITE_NAME} — ${SITE_TAGLINE}`,
    template: `%s · ${SITE_NAME}`,
  },
  description: DEFAULT_DESCRIPTION,
  keywords: DEFAULT_KEYWORDS,
  applicationName: SITE_NAME,
  authors: [{ name: SITE_NAME }],
  creator: SITE_NAME,
  formatDetection: { email: true, address: false, telephone: true },
  openGraph: {
    type: "website",
    locale: "ko_KR",
    siteName: SITE_NAME,
    title: `${SITE_NAME} — ${SITE_TAGLINE}`,
    description: DEFAULT_DESCRIPTION,
    url: "/",
    images: [{ url: DEFAULT_OG_IMAGE_PATH, alt: `${SITE_NAME} 제품 비주얼` }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} — ${SITE_TAGLINE}`,
    description: DEFAULT_DESCRIPTION,
    images: [DEFAULT_OG_IMAGE_PATH],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon-192.png", type: "image/png", sizes: "192x192" },
      { url: "/favicon-96.png", type: "image/png", sizes: "96x96" },
      { url: "/favicon-64.png", type: "image/png", sizes: "64x64" },
      { url: "/favicon-48.png", type: "image/png", sizes: "48x48" },
      { url: "/favicon-32.png", type: "image/png", sizes: "32x32" },
      { url: "/favicon-16.png", type: "image/png", sizes: "16x16" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersList = await headers();
  const pathname = headersList.get("x-pathname") ?? "";
  const onStorefront = !pathname.startsWith("/admin");

  let promoCountdown: { endsAtIso: string; title: string } | null = null;
  if (onStorefront) {
    const row = await getSitePromoCountdown();
    if (row) {
      promoCountdown = { endsAtIso: row.endsAt.toISOString(), title: row.title };
    }
  }

  return (
    <html lang="ko">
      <body className={`${notoSansKr.className} ${cormorant.variable}`}>
        <div className="min-h-screen bg-[#FAFAF8]">
          <Suspense fallback={null}>
            <ReferralTracker />
          </Suspense>
          <ScrollToTopButton />
          <SiteHeader promoCountdown={promoCountdown} />
          <main className="mx-auto max-w-7xl px-4 pb-6 pt-5 md:px-8 md:pb-14 md:pt-10 lg:pt-8">{children}</main>
          <SiteFooter />
        </div>
      </body>
    </html>
  );
}
