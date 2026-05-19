import type { Prisma } from "@prisma/client";

const MAX_Q = 120;

export type AdminOrderListSearchBy = "orderNumber" | "name" | "phone";

export type AdminOrderListSearchSpec = {
  by: AdminOrderListSearchBy;
  needle: string;
};

function normalizeSearchBy(raw: string | undefined): AdminOrderListSearchBy {
  if (raw === "name" || raw === "phone" || raw === "orderNumber") return raw;
  return "orderNumber";
}

/** URL `searchBy`·`q` 파싱. `q`가 비면 검색 없음. */
export function parseAdminOrdersListSearch(
  searchBy: string | undefined,
  q: string | undefined,
): AdminOrderListSearchSpec | null {
  const needle = (q ?? "").trim();
  if (!needle || needle.length > MAX_Q) return null;
  return { by: normalizeSearchBy(searchBy), needle };
}

function digitsOnly(s: string): string {
  return s.replace(/\D/g, "");
}

function phoneExactVariants(needle: string): string[] {
  const t = needle.trim();
  const variants = new Set<string>();
  if (t) variants.add(t);
  const d = digitsOnly(t);
  if (d) variants.add(d);
  if (d.length === 11 && d.startsWith("010")) {
    variants.add(`${d.slice(0, 3)}-${d.slice(3, 7)}-${d.slice(7)}`);
    variants.add(`${d.slice(0, 3)}-${d.slice(3, 6)}-${d.slice(6)}`);
  }
  return [...variants];
}

/** DB `findMany`/`count`용 — 목록 검색과 동일한 완전 일치 규칙(연락처는 자주 쓰는 하이픈 변형 OR). */
export function adminOrderSearchToPrismaWhere(spec: AdminOrderListSearchSpec): Prisma.OrderWhereInput {
  switch (spec.by) {
    case "orderNumber":
      return { orderNumber: spec.needle.trim() };
    case "name":
      return { customerName: spec.needle.trim() };
    case "phone": {
      const opts = phoneExactVariants(spec.needle);
      if (opts.length === 1) return { phone: opts[0]! };
      return { OR: opts.map((phone) => ({ phone })) };
    }
    default:
      return {};
  }
}

type OrderSearchRow = {
  orderNumber: string;
  customerName: string;
  phone: string;
};

/** 주문번호·이름은 DB 문자열과 완전 일치(앞뒤 공백 제외). 연락처는 숫자만 추출해 완전 일치(하이픈 등 무시). */
export function orderMatchesAdminListSearch(row: OrderSearchRow, spec: AdminOrderListSearchSpec): boolean {
  switch (spec.by) {
    case "orderNumber":
      return row.orderNumber.trim() === spec.needle.trim();
    case "name":
      return row.customerName.trim() === spec.needle.trim();
    case "phone": {
      const n = digitsOnly(spec.needle);
      if (n.length > 0) return digitsOnly(row.phone) === n;
      return row.phone.trim() === spec.needle.trim();
    }
    default:
      return false;
  }
}
