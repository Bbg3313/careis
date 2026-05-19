import { NextResponse } from "next/server";

import { findActivePromoByCode } from "@/lib/promo";
import { sanitizeReferralCode } from "@/lib/referral-code";

/**
 * 쇼핑몰 상단 공구 타이머(비로그인).
 * `ref`와 **코드가 일치하고** 현재 시각에 활성인 공구 **한 건**만 내려줍니다.
 * `title`은 관리자 「상단바 표시」(DB `PromoCampaign.title`) 그대로입니다.
 */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = sanitizeReferralCode(url.searchParams.get("ref"));
  if (!code) {
    return NextResponse.json({ ok: false as const });
  }
  try {
    const c = await findActivePromoByCode(code, new Date());
    if (!c) {
      return NextResponse.json({ ok: false as const });
    }
    return NextResponse.json({
      ok: true as const,
      campaigns: [
        {
          id: c.id,
          endsAtIso: c.endsAt.toISOString(),
          title: c.title,
        },
      ],
    });
  } catch {
    return NextResponse.json({ ok: false as const }, { status: 500 });
  }
}
