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

type OrderSearchRow = {
  orderNumber: string;
  customerName: string;
  phone: string;
};

function digitsOnly(s: string): string {
  return s.replace(/\D/g, "");
}

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
