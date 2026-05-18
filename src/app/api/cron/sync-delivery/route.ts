import { NextResponse } from "next/server";

import { syncDeliveryStatusBatchForCron } from "@/lib/orders";

export const dynamic = "force-dynamic";
export const maxDuration = 120;

/**
 * 스마트택배 기준 배송완료 자동 반영.
 * - Vercel Cron: `x-vercel-cron: 1` 헤더
 * - 수동: `Authorization: Bearer ${CRON_SECRET}`
 */
export async function GET(request: Request) {
  const vercelCron = request.headers.get("x-vercel-cron") === "1";
  const secret = process.env.CRON_SECRET?.trim();
  const auth = request.headers.get("authorization");
  const bearerOk = Boolean(secret && auth === `Bearer ${secret}`);
  if (!vercelCron && !bearerOk) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await syncDeliveryStatusBatchForCron(40);
    return NextResponse.json({ ok: true, ...result });
  } catch (e) {
    console.error("[cron/sync-delivery]", e);
    return NextResponse.json(
      { ok: false, error: e instanceof Error ? e.message : "sync_failed" },
      { status: 500 },
    );
  }
}
