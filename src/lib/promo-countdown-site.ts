import { findActivePromoByCode } from "@/lib/promo";
import { sanitizeReferralCode } from "@/lib/referral";

export type SitePromoCountdownPayload = {
  endsAt: Date;
  title: string;
};

/**
 * 쇼핑몰 상단 공구 타이머: **레퍼럴 쿠키(`?ref=`로 저장된 코드)**가 있고,
 * 그 코드에 해당하는 활성 공구가 있을 때만 표시합니다.
 * 일반 메인 URL 방문자에게는 공구 배너를 띄우지 않습니다.
 */
export async function getSitePromoCountdownForReferrer(
  referralFromCookie: string | null | undefined,
): Promise<SitePromoCountdownPayload | null> {
  const code = sanitizeReferralCode(referralFromCookie);
  if (!code) return null;

  try {
    const campaign = await findActivePromoByCode(code, new Date());
    if (!campaign) return null;
    return { endsAt: campaign.endsAt, title: campaign.title };
  } catch {
    return null;
  }
}
