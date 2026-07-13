import { formatCurrency } from "@/lib/utils";

type Daily = { day: string; revenue: number; orderCount: number };
type Product = { sku: string; name: string; quantity: number; revenue: number };

function shortDay(day: string) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(day);
  if (!m) return day;
  return `${Number(m[2])}/${Number(m[3])}`;
}

export function AdminSalesDailyChart({
  daily,
  caption,
}: {
  daily: Daily[];
  caption: string;
}) {
  const max = Math.max(1, ...daily.map((d) => d.revenue));
  const total = daily.reduce((s, d) => s + d.revenue, 0);
  const chartH = 168;

  return (
    <section className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <h2 className="text-sm font-semibold text-stone-900">일별 매출</h2>
          <p className="mt-1 text-xs text-stone-500">{caption}</p>
        </div>
        <p className="text-sm font-medium tabular-nums text-stone-800">{formatCurrency(total)}</p>
      </div>

      {daily.length === 0 ? (
        <p className="mt-10 text-center text-sm text-stone-500">표시할 매출 데이터가 없습니다.</p>
      ) : (
        <div className="mt-6 overflow-x-auto">
          <div
            className="flex items-end gap-1 sm:gap-1.5"
            style={{ minWidth: daily.length > 20 ? `${daily.length * 14}px` : undefined, height: chartH + 28 }}
          >
            {daily.map((d, i) => {
              const barPx = d.revenue > 0 ? Math.max(14, Math.round((d.revenue / max) * chartH)) : 4;
              const showLabel = daily.length <= 14 || i % Math.ceil(daily.length / 10) === 0;
              return (
                <div
                  key={d.day}
                  className="group relative flex min-w-0 flex-1 flex-col items-center justify-end"
                  style={{ height: chartH + 28 }}
                  title={`${d.day} · ${formatCurrency(d.revenue)} · ${d.orderCount}건`}
                >
                  <div
                    className="w-full max-w-[26px] rounded-t-md bg-[#8b673f] transition group-hover:bg-[#6f5232]"
                    style={{ height: barPx }}
                  />
                  <span className="mt-2 h-4 text-[10px] tabular-nums text-stone-400">
                    {showLabel ? shortDay(d.day) : ""}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
}

export function AdminSalesProductChart({ products }: { products: Product[] }) {
  const max = Math.max(1, ...products.map((p) => p.revenue));
  const rows = products.slice(0, 8);

  return (
    <section className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm sm:p-6">
      <h2 className="text-sm font-semibold text-stone-900">상품별 매출</h2>
      <p className="mt-1 text-xs text-stone-500">선택 기간 · 막대는 매출 비율</p>

      {rows.length === 0 ? (
        <p className="mt-10 text-center text-sm text-stone-500">해당 기간 판매가 없습니다.</p>
      ) : (
        <ul className="mt-5 space-y-4">
          {rows.map((p) => {
            const pct = Math.max(4, Math.round((p.revenue / max) * 100));
            return (
              <li key={p.sku || p.name}>
                <div className="mb-1.5 flex items-baseline justify-between gap-3 text-sm">
                  <span className="truncate font-medium text-stone-900">{p.name}</span>
                  <span className="shrink-0 tabular-nums text-stone-700">
                    {p.quantity.toLocaleString("ko-KR")}개 · {formatCurrency(p.revenue)}
                  </span>
                </div>
                <div className="h-2.5 overflow-hidden rounded-full bg-stone-100">
                  <div className="h-full rounded-full bg-[#b89156]" style={{ width: `${pct}%` }} />
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
