import { sanitizeReferralCode } from "@/lib/referral-code";

type SearchParamsLike = { get: (key: string) => string | null };

/**
 * 스토어프론트 공구 UI(상단 타이머·모바일 CTA 등)는 **현재 URL의 `?ref=`만** 본다.
 * 쿠키·localStorage는 일반 방문에서 공구가 남지 않도록 사용하지 않는다.
 */
export function referralCodeFromUrlForStorefront(searchParams: SearchParamsLike | null): string | null {
  if (!searchParams) return null;
  return sanitizeReferralCode(searchParams.get("ref"));
}
