import { REFERRAL_COOKIE_KEY, sanitizeReferralCode } from "@/lib/referral-code";

type SearchParamsLike = { get: (key: string) => string | null };

/**
 * 스토어프론트: URL `?ref=` (Next `useSearchParams` 등).
 */
export function referralCodeFromUrlForStorefront(searchParams: SearchParamsLike | null): string | null {
  if (!searchParams) return null;
  return sanitizeReferralCode(searchParams.get("ref"));
}

/** 클라이언트: `window.location` 쿼리의 `ref` (일부 환경에서 훅보다 먼저 맞는 경우 대비). */
export function referralCodeFromWindowLocationSearch(): string | null {
  if (typeof window === "undefined") return null;
  return sanitizeReferralCode(new URLSearchParams(window.location.search).get("ref"));
}

/** 클라이언트: 미들웨어·ReferralTracker가 심은 레퍼럴 쿠키 (`?ref=` 없이 이동해도 타이머 유지). */
export function referralCodeFromBrowserCookie(): string | null {
  if (typeof document === "undefined") return null;
  const prefix = `${REFERRAL_COOKIE_KEY}=`;
  const hit = document.cookie.split("; ").find((row) => row.startsWith(prefix));
  if (!hit) return null;
  const raw = hit.slice(prefix.length);
  try {
    return sanitizeReferralCode(decodeURIComponent(raw));
  } catch {
    return sanitizeReferralCode(raw);
  }
}

/**
 * 공구 타이머용: URL ref 우선, 없으면 쿠키(미들웨어가 `?ref=`로 심은 값).
 */
export function referralCodeForPromoStrip(searchParams: SearchParamsLike | null): string | null {
  return (
    referralCodeFromUrlForStorefront(searchParams) ||
    referralCodeFromWindowLocationSearch() ||
    referralCodeFromBrowserCookie()
  );
}
