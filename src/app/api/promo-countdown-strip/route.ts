import { NextResponse } from "next/server";

import { findActivePromoByCode } from "@/lib/promo";
import { sanitizeReferralCode } from "@/lib/referral-code";

/** 쇼핑몰 상단 공구 타이머용(비로그인). `ref`에 맞는 활성 공구만 반환 */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = sanitizeReferralCode(url.searchParams.get("ref"));
  if (!code) {
    return NextResponse.json({ ok: false as const });
  }
  try {
    const campaign = await findActivePromoByCode(code, new Date());
    if (!campaign) {
      return NextResponse.json({ ok: false as const });
    }
    return NextResponse.json({
      ok: true as const,
      endsAtIso: campaign.endsAt.toISOString(),
      title: campaign.title,
    });
  } catch {
    return NextResponse.json({ ok: false as const }, { status: 500 });
  }
}
