import { cookies } from "next/headers";

export const REFERRAL_COOKIE_KEY = "careis_referral_code";
export const REFERRAL_COOKIE_AGE = 60 * 60 * 24 * 30;
/** 미들웨어가 URL `?ref=`를 담아 보냄. 같은 요청에서 RSC가 예전 쿠키 대신 현재 URL의 공구를 쓰도록 함 */
export const REFERRAL_FROM_QUERY_HEADER = "x-careis-ref-query";

export async function getReferralCodeFromCookie() {
  const cookieStore = await cookies();
  return cookieStore.get(REFERRAL_COOKIE_KEY)?.value ?? null;
}

export function sanitizeReferralCode(value: string | null | undefined) {
  if (!value) return null;
  const normalized = value.trim().toLowerCase();
  if (!normalized) return null;
  return normalized.replace(/[^a-z0-9_-]/g, "");
}
