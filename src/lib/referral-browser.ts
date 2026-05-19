import { sanitizeReferralCode } from "@/lib/referral-code";

type SearchParamsLike = { get: (key: string) => string | null };

/**
 * 스토어프론트: URL `?ref=` (Next `useSearchParams` 등).
 */
export function referralCodeFromUrlForStorefront(searchParams: SearchParamsLike | null): string | null {
  if (!searchParams) return null;
  return sanitizeReferralCode(searchParams.get("ref"));
}

/** 클라이언트: `window.location` 쿼리의 `ref` (훅과 불일치할 때만 보조). */
export function referralCodeFromWindowLocationSearch(): string | null {
  if (typeof window === "undefined") return null;
  return sanitizeReferralCode(new URLSearchParams(window.location.search).get("ref"));
}

/**
 * 상단 공구 바: **현재 URL에 `?ref=`가 있을 때만** (쿠키·이전 방문값으로는 띄우지 않음).
 */
export function referralCodeForPromoStrip(searchParams: SearchParamsLike | null): string | null {
  return referralCodeFromUrlForStorefront(searchParams) || referralCodeFromWindowLocationSearch();
}
