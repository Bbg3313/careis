/** 레퍼럴 코드 정규화 + 쿠키 상수. `next/headers` 없음 — Edge·클라이언트에서도 import 가능 */

export const REFERRAL_COOKIE_KEY = "careis_referral_code";
export const REFERRAL_COOKIE_AGE = 60 * 60 * 24 * 30;

export function sanitizeReferralCode(value: string | null | undefined) {
  if (!value) return null;
  const normalized = value.trim().toLowerCase();
  if (!normalized) return null;
  return normalized.replace(/[^a-z0-9_-]/g, "");
}
