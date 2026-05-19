/** 레퍼럴 코드 정규화 + 쿠키 상수. `next/headers` 없음 — Edge·클라이언트에서도 import 가능 */

export const REFERRAL_COOKIE_KEY = "careis_referral_code";
export const REFERRAL_COOKIE_AGE = 60 * 60 * 24 * 30;

export function sanitizeReferralCode(value: string | null | undefined) {
  if (!value) return null;
  const normalized = value.trim().toLowerCase();
  if (!normalized) return null;
  return normalized.replace(/[^a-z0-9_-]/g, "");
}

/** 내부 라우트 href에 `ref` 쿼리를 붙이거나 덮어씀(공구 링크 유지용) */
export function appendPromoRefToHref(href: string, ref: string | null | undefined): string {
  const code = sanitizeReferralCode(ref ?? null);
  if (!code || !href.startsWith("/")) return href;
  const qIndex = href.indexOf("?");
  const path = qIndex === -1 ? href : href.slice(0, qIndex);
  const query = qIndex === -1 ? "" : href.slice(qIndex + 1);
  const sp = new URLSearchParams(query);
  sp.set("ref", code);
  const next = sp.toString();
  return next ? `${path}?${next}` : path;
}
