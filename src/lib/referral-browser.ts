import { REFERRAL_COOKIE_KEY, sanitizeReferralCode } from "@/lib/referral-code";

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

function readCookieValue(name: string): string | null {
  if (typeof document === "undefined") return null;
  const parts = document.cookie.split("; ");
  for (const part of parts) {
    const eq = part.indexOf("=");
    if (eq === -1) continue;
    if (part.slice(0, eq) === name) {
      return decodeURIComponent(part.slice(eq + 1));
    }
  }
  return null;
}

/**
 * `?ref=`로 들어왔을 때 ReferralTracker가 남긴 쿠키·localStorage.
 * 홈 → 주문처럼 URL에서 ref가 빠진 뒤에도 할인을 유지한다.
 */
export function referralCodeFromStoredSession(): string | null {
  if (typeof window === "undefined") return null;
  const fromLs = sanitizeReferralCode(window.localStorage.getItem(REFERRAL_COOKIE_KEY));
  if (fromLs) return fromLs;
  return sanitizeReferralCode(readCookieValue(REFERRAL_COOKIE_KEY));
}

/**
 * 주문서·CTA: URL `ref` → 저장 세션 순으로 해석.
 */
export function resolveStorefrontReferralCode(
  searchParams: SearchParamsLike | null,
  urlFallback: string | null = null,
): string | null {
  return (
    referralCodeFromUrlForStorefront(searchParams) ||
    referralCodeFromWindowLocationSearch() ||
    sanitizeReferralCode(urlFallback) ||
    referralCodeFromStoredSession()
  );
}

/**
 * 상단 공구 바: **현재 URL에 `?ref=`가 있을 때만** (쿠키·이전 방문값으로는 띄우지 않음).
 */
export function referralCodeForPromoStrip(searchParams: SearchParamsLike | null): string | null {
  return referralCodeFromUrlForStorefront(searchParams) || referralCodeFromWindowLocationSearch();
}
