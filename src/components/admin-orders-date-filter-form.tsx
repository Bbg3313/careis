import Link from "next/link";

type Props = {
  action: "/admin/orders" | "/admin";
  status?: string;
  defaultFrom?: string;
  defaultTo?: string;
  clearHref: string;
};

export function AdminOrdersDateFilterForm({ action, status, defaultFrom, defaultTo, clearHref }: Props) {
  return (
    <form method="get" action={action} className="flex flex-wrap items-end gap-3 rounded-2xl border border-stone-200 bg-[#faf8f5] px-4 py-3">
      {status ? <input type="hidden" name="status" value={status} /> : null}
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
      <p className="w-full text-[11px] leading-relaxed text-stone-500 sm:text-xs">
        주문 생성일 기준(KST 달력)입니다. 한쪽만 넣으면 그날부터·까지로 동작합니다.
      </p>
    </form>
  );
}
