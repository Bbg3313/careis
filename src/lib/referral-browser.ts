import { REFERRAL_COOKIE_KEY, sanitizeReferralCode } from "@/lib/referral-code";

type SearchParamsLike = { get: (key: string) => string | null };

/**
 * 클라이언트에서 `?ref=` 우선, 없으면 레퍼럴 쿠키에서 캠페인 코드를 읽습니다.
 * (RSC/Edge에서 `document` 없음 → null)
 */
export function resolveReferralCodeForClient(searchParams: SearchParamsLike | null): string | null {
  const fromUrl = searchParams ? sanitizeReferralCode(searchParams.get("ref")) : null;
  if (fromUrl) return fromUrl;
  if (typeof document === "undefined") return null;
  const raw = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${REFERRAL_COOKIE_KEY}=`))
    ?.slice(REFERRAL_COOKIE_KEY.length + 1);
  const fromCookie = sanitizeReferralCode(raw ? decodeURIComponent(raw) : null);
  if (fromCookie) return fromCookie;
  try {
    return sanitizeReferralCode(window.localStorage?.getItem(REFERRAL_COOKIE_KEY));
  } catch {
    return null;
  }
}
