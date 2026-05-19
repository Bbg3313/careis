import type { Prisma } from "@prisma/client";

const YMD = /^(\d{4})-(\d{2})-(\d{2})$/;

function pad2(n: number) {
  return n.toString().padStart(2, "0");
}

/** KST 해당 일의 시작 또는 끝을 UTC `Date`로 */
function kstBoundaryUtc(y: number, mo: number, d: number, endOfDay: boolean): Date {
  const iso = `${y}-${pad2(mo)}-${pad2(d)}T${endOfDay ? "23:59:59.999" : "00:00:00.000"}+09:00`;
  return new Date(iso);
}

export function parseYmdKst(s: string | undefined): { y: number; mo: number; d: number } | null {
  if (!s?.trim()) return null;
  const m = YMD.exec(s.trim());
  if (!m) return null;
  const y = Number(m[1]);
  const mo = Number(m[2]);
  const d = Number(m[3]);
  if (mo < 1 || mo > 12 || d < 1 || d > 31) return null;
  const dt = kstBoundaryUtc(y, mo, d, false);
  if (Number.isNaN(dt.getTime())) return null;
  return { y, mo, d };
}

/** 주문 `createdAt` 기준. 날짜는 KST 달력 기준 하루 단위(시작·끝 포함) */
export function prismaOrderCreatedAtRange(fromRaw?: string, toRaw?: string): Prisma.OrderWhereInput {
  const fromP = parseYmdKst(fromRaw);
  const toP = parseYmdKst(toRaw);
  if (!fromP && !toP) return {};

  let gte: Date | undefined;
  let lte: Date | undefined;
  if (fromP) gte = kstBoundaryUtc(fromP.y, fromP.mo, fromP.d, false);
  if (toP) lte = kstBoundaryUtc(toP.y, toP.mo, toP.d, true);
  if (gte && lte && gte > lte) {
    gte = kstBoundaryUtc(toP!.y, toP!.mo, toP!.d, false);
    lte = kstBoundaryUtc(fromP!.y, fromP!.mo, fromP!.d, true);
  }
  const filter: Prisma.DateTimeFilter = {};
  if (gte) filter.gte = gte;
  if (lte) filter.lte = lte;
  return { createdAt: filter };
}

export function buildAdminOrdersHref(opts: { status?: string; fulfillment?: string; from?: string; to?: string }): string {
  const p = new URLSearchParams();
  if (opts.status) p.set("status", opts.status);
  if (opts.fulfillment?.trim()) p.set("fulfillment", opts.fulfillment.trim());
  if (opts.from?.trim()) p.set("from", opts.from.trim());
  if (opts.to?.trim()) p.set("to", opts.to.trim());
  const q = p.toString();
  return q ? `/admin/orders?${q}` : "/admin/orders";
}

/** 주문 목록과 동일한 기간·결제·배송·유입 필터로 `/api/admin/orders/export` GET URL */
export function buildAdminOrdersExportApiHref(opts: {
  status?: string;
  fulfillment?: string;
  from?: string;
  to?: string;
  inflowCode?: string;
  /** 생략 시 구분 없음(전체). 엑셀 페이지 탭에서만 넘깁니다. */
  scope?: "general" | "promo";
}): string {
  const p = new URLSearchParams();
  const st = opts.status?.trim();
  const exportStatus = st === "PAID" || st === "PENDING" || st === "CANCELLED_REFUNDED" ? st : "ALL";
  p.set("status", exportStatus);

  if (exportStatus === "PAID") {
    const ful = opts.fulfillment?.trim();
    if (ful === "AWAITING_SHIP" || ful === "IN_TRANSIT" || ful === "DELIVERED") {
      p.set("fulfillment", ful);
    } else {
      p.set("fulfillment", "ALL");
    }
  }

  if (opts.from?.trim()) p.set("from", opts.from.trim());
  if (opts.to?.trim()) p.set("to", opts.to.trim());
  if (opts.inflowCode?.trim()) p.set("inflowCode", opts.inflowCode.trim());
  if (opts.scope === "general" || opts.scope === "promo") {
    p.set("scope", opts.scope);
  }

  return `/api/admin/orders/export?${p.toString()}`;
}
