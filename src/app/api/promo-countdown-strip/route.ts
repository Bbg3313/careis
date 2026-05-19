import { NextResponse } from "next/server";

import { findAllActivePromoCampaigns } from "@/lib/promo";
import { sanitizeReferralCode } from "@/lib/referral-code";

/**
 * 쇼핑몰 상단 공구 타이머(비로그인).
 * `ref`가 있으면(쿠키/URL로 유입 확인용) **현재 시각 기준 활성인 모든 공구**를 내려줌 — 캠페인이 여러 개면 줄을 여러 개 띄움.
 */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = sanitizeReferralCode(url.searchParams.get("ref"));
  if (!code) {
    return NextResponse.json({ ok: false as const });
  }
  try {
    const rows = await findAllActivePromoCampaigns(new Date());
    if (rows.length === 0) {
      return NextResponse.json({ ok: false as const });
    }
    return NextResponse.json({
      ok: true as const,
      campaigns: rows.map((c) => ({
        id: c.id,
        endsAtIso: c.endsAt.toISOString(),
        title: c.title,
      })),
    });
  } catch {
    return NextResponse.json({ ok: false as const }, { status: 500 });
  }
}
