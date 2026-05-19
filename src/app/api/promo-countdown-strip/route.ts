import { NextResponse } from "next/server";

import { prisma } from "@/lib/db";
import { sanitizeReferralCode } from "@/lib/referral-code";

const noStore = { "Cache-Control": "private, no-store, max-age=0" } as const;

/**
 * 쇼핑몰 상단 공구 바(비로그인).
 * - `ref`와 일치하는 행이 있고 **활성**이면 `ok: true` + `state`(live|ended|upcoming).
 * - 행이 있으나 **비활성**이면 `ok: false` + `reason: INACTIVE` — 상단바 없음(할인도 주문 단계에서 미적용).
 * - 행이 없으면 `ok: false` + `reason: UNKNOWN_CODE` (안내 막대).
 */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = sanitizeReferralCode(url.searchParams.get("ref"));
  if (!code) {
    return NextResponse.json({ ok: false as const, reason: "MISSING_REF" as const }, { headers: noStore });
  }

  try {
    const row = await prisma.promoCampaign.findFirst({
      where: { code },
    });

    if (!row) {
      console.warn("[promo-countdown-strip] no PromoCampaign row for ref=", code);
      return NextResponse.json({ ok: false as const, reason: "UNKNOWN_CODE" as const }, { headers: noStore });
    }

    if (!row.isActive) {
      return NextResponse.json({ ok: false as const, reason: "INACTIVE" as const }, { headers: noStore });
    }

    const at = new Date();
    let state: "live" | "ended" | "upcoming";
    if (row.startsAt > at) {
      state = "upcoming";
    } else if (row.endsAt < at) {
      state = "ended";
    } else {
      state = "live";
    }

    return NextResponse.json(
      {
        ok: true as const,
        campaigns: [
          {
            id: row.id,
            title: row.title,
            endsAtIso: row.endsAt.toISOString(),
            startsAtIso: row.startsAt.toISOString(),
            state,
          },
        ],
      },
      { headers: noStore },
    );
  } catch (e) {
    console.error("[promo-countdown-strip]", e);
    return NextResponse.json({ ok: false as const, reason: "SERVER" as const }, { status: 500, headers: noStore });
  }
}
