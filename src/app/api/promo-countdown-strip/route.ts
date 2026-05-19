import { NextResponse } from "next/server";

import { prisma } from "@/lib/db";
import { sanitizeReferralCode } from "@/lib/referral-code";

const noStore = { "Cache-Control": "private, no-store, max-age=0" } as const;

/**
 * 쇼핑몰 상단 공구 바(비로그인).
 * - `ref`와 일치하는 `PromoCampaign` 행이 있으면 `ok: true` + `state`(live|ended|upcoming|disabled).
 * - 행이 없으면 `ok: false` + `reason: UNKNOWN_CODE` (타이머 대신 안내 UI용).
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

    const at = new Date();
    let state: "live" | "ended" | "upcoming" | "disabled";
    if (!row.isActive) {
      state = "disabled";
    } else if (row.startsAt > at) {
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
