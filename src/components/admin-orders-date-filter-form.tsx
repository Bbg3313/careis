import Link from "next/link";

type Props = {
  action: "/admin/orders" | "/admin";
  status?: string;
  fulfillment?: string;
  defaultFrom?: string;
  defaultTo?: string;
  /** `/admin/orders` 전용: 주문번호·이름·연락처 완전 일치 검색 */
  showOrderSearch?: boolean;
  defaultSearchBy?: string;
  defaultQ?: string;
  clearHref: string;
};

export function AdminOrdersDateFilterForm({
  action,
  status,
  fulfillment,
  defaultFrom,
  defaultTo,
  showOrderSearch = false,
  defaultSearchBy,
  defaultQ,
  clearHref,
}: Props) {
  const searchByValue =
    defaultSearchBy === "name" || defaultSearchBy === "phone" || defaultSearchBy === "orderNumber"
      ? defaultSearchBy
      : "orderNumber";

  return (
    <form method="get" action={action} className="space-y-4 rounded-2xl border border-stone-200 bg-[#faf8f5] px-4 py-3">
      <div className="flex flex-wrap items-end gap-3">
        {status ? <input type="hidden" name="status" value={status} /> : null}
        {fulfillment ? <input type="hidden" name="fulfillment" value={fulfillment} /> : null}
        <label className="flex min-w-[10.5rem] flex-col gap-1 text-xs font-medium text-stone-600">
          시작일
          <input
            type="date"
            name="from"
            defaultValue={defaultFrom ?? ""}
            className="rounded-xl border border-stone-200 bg-white px-3 py-2 text-sm text-stone-900 outline-none focus:border-[#b89156]/50"
          />
        </label>
        <label className="flex min-w-[10.5rem] flex-col gap-1 text-xs font-medium text-stone-600">
          종료일
          <input
            type="date"
            name="to"
            defaultValue={defaultTo ?? ""}
            className="rounded-xl border border-stone-200 bg-white px-3 py-2 text-sm text-stone-900 outline-none focus:border-[#b89156]/50"
          />
        </label>
        <button
          type="submit"
          className="rounded-full bg-stone-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-stone-800"
        >
          조회
        </button>
        <Link
          href={clearHref}
          className="rounded-full border border-stone-300 bg-white px-4 py-2 text-sm font-medium text-stone-700 transition hover:bg-stone-50"
        >
          초기화
        </Link>
      </div>

      {showOrderSearch && action === "/admin/orders" ? (
        <div className="flex flex-col gap-2 border-t border-stone-200/90 pt-3 sm:flex-row sm:flex-wrap sm:items-end">
          <label className="flex min-w-[9.5rem] flex-col gap-1 text-xs font-medium text-stone-600">
            검색 조건
            <select
              name="searchBy"
              defaultValue={searchByValue}
              className="rounded-xl border border-stone-200 bg-white px-3 py-2 text-sm text-stone-900 outline-none focus:border-[#b89156]/50"
            >
              <option value="orderNumber">주문번호</option>
              <option value="name">고객 이름</option>
              <option value="phone">연락처</option>
            </select>
          </label>
          <label className="flex min-w-[min(100%,14rem)] flex-1 flex-col gap-1 text-xs font-medium text-stone-600">
            검색어 <span className="font-normal text-stone-400">(완전 일치)</span>
            <input
              type="search"
              name="q"
              defaultValue={defaultQ ?? ""}
              placeholder="주문번호·이름·번호 그대로 입력"
              autoComplete="off"
              maxLength={120}
              className="rounded-xl border border-stone-200 bg-white px-3 py-2 text-sm text-stone-900 outline-none focus:border-[#b89156]/50"
            />
          </label>
          <p className="w-full text-[11px] leading-relaxed text-stone-500 sm:order-last">
            이름·주문번호는 저장된 문자와 동일해야 합니다. 연락처는 숫자만 맞으면 됩니다(하이픈 무시).
          </p>
        </div>
      ) : null}
    </form>
  );
}
