import { cookies } from "next/headers";

import { REFERRAL_COOKIE_KEY } from "@/lib/referral-code";

export { REFERRAL_COOKIE_AGE, REFERRAL_COOKIE_KEY, sanitizeReferralCode } from "@/lib/referral-code";

export async function getReferralCodeFromCookie() {
  const cookieStore = await cookies();
  return cookieStore.get(REFERRAL_COOKIE_KEY)?.value ?? null;
}
