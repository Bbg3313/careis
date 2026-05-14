import type { Metadata } from "next";

/**
 * 공개 사이트 URL (OG·canonical·sitemap). 배포 시 .env 의 NEXT_PUBLIC_SITE_URL 과 동일한 도메인 권장.
 */
export function getSiteUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (!raw) return "http://localhost:3000";
  return raw.replace(/\/+$/, "");
}

export function getMetadataBase(): URL {
  return new URL(`${getSiteUrl()}/`);
}

export function absoluteUrl(path: string): string {
  const base = getSiteUrl();
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${base}${p}`;
}

export const SITE_NAME = "CAREIS";

export const SITE_TAGLINE = "낮과 밤을 위한 2-step 더마코스메틱 루틴 브랜드";

export const DEFAULT_DESCRIPTION =
  "CAREIS(케어이즈)는 낮에는 선케어, 밤에는 브라이트닝 집중 케어로 하루 루틴을 완성하는 더마코스메틱 브랜드입니다. 심플스틱 선팩 SPF50+·일루미네이터 시스테아민 5% 제품을 만나보세요.";

export const DEFAULT_KEYWORDS = [
  "CAREIS",
  "케어이즈",
  "심플스틱",
  "선팩",
  "일루미네이터",
  "시스테아민",
  "더마코스메틱",
  "선크림",
  "야간 케어",
  "브라이트닝",
  "SPF50",
  "ODT 크림 팩",
];

/** 기본 OG·트위터 카드 이미지 (public 경로) */
export const DEFAULT_OG_IMAGE_PATH = "/images/sun-model-banner.png";

/** 장바구니·주문·결제 등 크롤링 제외 */
export const noIndexPageMetadata: Metadata = {
  robots: { index: false, follow: false },
};
