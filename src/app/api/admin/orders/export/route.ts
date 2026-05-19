import { NextResponse } from "next/server";
import { z } from "zod";

import { guardAdminApi } from "@/lib/admin-auth";
import { buildOrdersWorkbook } from "@/lib/export-orders";
import { getOrdersForExport } from "@/lib/orders";
import { sanitizeReferralCode } from "@/lib/referral-code";

const exportQuerySchema = z.object({
  from: z.string().max(16).optional(),
  to: z.string().max(16).optional(),
  status: z.enum(["ALL", "PAID", "PENDING", "CANCELLED_REFUNDED"]).default("PAID"),
  fulfillment: z.enum(["ALL", "AWAITING_SHIP", "IN_TRANSIT", "DELIVERED"]).default("ALL"),
  inflowCode: z
    .string()
    .max(48)
    .optional()
    .transform((s) => (s?.trim() ? s.trim() : undefined)),
});

function asciiFilename(parts: string[]) {
  const safe = (s: string) =>
    s
      .normalize("NFKD")
      .replace(/[^\w.-]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 40) || "x";
  const joined = parts.map(safe).filter(Boolean).join("_");
  return `${joined || "careis-orders"}.xlsx`;
}

export async function GET(request: Request) {
  const denied = await guardAdminApi();
  if (denied) return denied;

  const { searchParams } = new URL(request.url);
  const raw = Object.fromEntries(searchParams.entries());
  const parsed = exportQuerySchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "요청 파라미터가 올바르지 않습니다." }, { status: 400 });
  }

  let { from, to, status, fulfillment, inflowCode } = parsed.data;
  if (status !== "PAID") {
    fulfillment = "ALL";
  }

  const inflowSanitized = sanitizeReferralCode(inflowCode ?? null);
  if (inflowCode && !inflowSanitized) {
    return NextResponse.json({ ok: false, error: "유입 코드 형식이 올바르지 않습니다." }, { status: 400 });
  }

  const orders = await getOrdersForExport({
    from,
    to,
    status,
    fulfillment,
    inflowCode: inflowSanitized,
  });

  const buffer = await buildOrdersWorkbook(orders);

  const filename = asciiFilename([
    "careis-orders",
    status,
    ...(fulfillment !== "ALL" ? [fulfillment] : []),
    ...(inflowSanitized ? [`ref-${inflowSanitized}`] : []),
    ...(from ? [from] : []),
    ...(to ? [to] : []),
  ]);

  return new NextResponse(new Uint8Array(buffer), {
    status: 200,
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
