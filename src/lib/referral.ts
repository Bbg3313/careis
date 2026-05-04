import { cookies } from "next/headers";

export const REFERRAL_COOKIE_KEY = "careis_referral_code";
export const REFERRAL_COOKIE_AGE = 60 * 60 * 24 * 30;

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
