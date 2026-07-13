import Link from "next/link";

import { AdminDbUnavailableNotice } from "@/components/admin-db-unavailable";
import { AdminOrdersDateFilterForm } from "@/components/admin-orders-date-filter-form";
import { loadAdminSalesSummary } from "@/lib/orders";
import { formatCurrency } from "@/lib/utils";

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams: Promise<{ from?: string; to?: string }>;
};

/** KST 기준 YYYY-MM-DD */
function kstYmd(d = new Date()) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(d);
}

function kstMonthStartYmd() {
  const today = kstYmd();
  return `${today.slice(0, 7)}-01`;
}

function buildSalesHref(from?: string, to?: string) {
  const p = new URLSearchParams();
  if (from) p.set("from", from);
  if (to) p.set("to", to);
  const qs = p.toString();
  return qs ? `/admin/sales?${qs}` : "/admin/sales";
}

function MoneyCard({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
      <p className="text-xs font-medium tracking-wide text-stone-500">{label}</p>
      <p className="mt-2 text-2xl font-semibold tabular-nums text-stone-900 sm:text-3xl">{value}</p>
      {hint ? <p className="mt-1 text-xs text-stone-500">{hint}</p> : null}
    </div>
  );
}

export default async function AdminSalesPage({ searchParams }: PageProps) {
  const { from, to } = await searchParams;
  const loaded = await loadAdminSalesSummary({ from, to });

  const today = kstYmd();
  const monthStart = kstMonthStartYmd();
  const periodLabel =
    from || to
      ? `${from || "처음부터"} ~ ${to || "오늘"}`
      : "전체 기간";

  const empty = {
    period: {
      paidOrderCount: 0,
      paidRevenue: 0,
      unitsSold: 0,
      refundedOrderCount: 0,
      refundedAmount: 0,
    },
    lifetime: { paidOrderCount: 0, paidRevenue: 0 },
    products: [] as Array<{ sku: string; name: string; quantity: number; revenue: number }>,
  };

  const summary = loaded.ok ? loaded.summary : empty;

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-stone-900">매출 확인</h1>
          <p className="mt-1 text-sm text-stone-500">
            결제완료 주문 기준 · {periodLabel}
          </p>
        </div>
        <Link
          href="/admin"
          className="shrink-0 rounded-full border border-stone-200 bg-white px-4 py-2 text-sm font-medium text-stone-700 hover:bg-stone-50"
        >
          ← 대시보드
        </Link>
      </div>

      {!loaded.ok ? <AdminDbUnavailableNotice /> : null}

      <div className="flex flex-wrap gap-2">
        <Link
          href={buildSalesHref()}
          className={`rounded-full px-4 py-2 text-sm font-medium transition ${
            !from && !to
              ? "bg-stone-900 text-white"
              : "border border-stone-200 bg-white text-stone-600 hover:bg-stone-50"
          }`}
        >
          전체
        </Link>
        <Link
          href={buildSalesHref(today, today)}
          className={`rounded-full px-4 py-2 text-sm font-medium transition ${
            from === today && to === today
              ? "bg-stone-900 text-white"
              : "border border-stone-200 bg-white text-stone-600 hover:bg-stone-50"
          }`}
        >
          오늘
        </Link>
        <Link
          href={buildSalesHref(monthStart, today)}
          className={`rounded-full px-4 py-2 text-sm font-medium transition ${
            from === monthStart && to === today
              ? "bg-stone-900 text-white"
              : "border border-stone-200 bg-white text-stone-600 hover:bg-stone-50"
          }`}
        >
          이번 달
        </Link>
      </div>

      <AdminOrdersDateFilterForm
        action="/admin/sales"
        defaultFrom={from}
        defaultTo={to}
        clearHref="/admin/sales"
      />

      <div>
        <h2 className="mb-3 text-base font-semibold text-stone-900">선택 기간</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MoneyCard
            label="매출"
            value={formatCurrency(summary.period.paidRevenue)}
            hint={`결제완료 ${summary.period.paidOrderCount}건`}
          />
          <MoneyCard
            label="판매 수량"
            value={`${summary.period.unitsSold.toLocaleString("ko-KR")}개`}
            hint="상품 합계"
          />
          <MoneyCard
            label="결제완료 주문"
            value={`${summary.period.paidOrderCount.toLocaleString("ko-KR")}건`}
          />
          <MoneyCard
            label="기간 내 환불"
            value={formatCurrency(summary.period.refundedAmount)}
            hint={`${summary.period.refundedOrderCount}건 (참고)`}
          />
        </div>
      </div>

      <div>
        <h2 className="mb-3 text-base font-semibold text-stone-900">누적 매출</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <MoneyCard
            label="전체 누적 매출"
            value={formatCurrency(summary.lifetime.paidRevenue)}
            hint="기간과 무관 · 결제완료만"
          />
          <MoneyCard
            label="전체 누적 주문"
            value={`${summary.lifetime.paidOrderCount.toLocaleString("ko-KR")}건`}
            hint="결제완료"
          />
        </div>
      </div>

      <section className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">
        <div className="border-b border-stone-100 px-5 py-4">
          <h2 className="text-sm font-semibold text-stone-900">상품별 판매</h2>
          <p className="mt-1 text-xs text-stone-500">선택 기간 · 결제완료 주문 기준</p>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm text-stone-800">
            <thead className="bg-[#faf8f5] text-stone-600">
              <tr>
                <th className="px-5 py-3 font-normal">상품</th>
                <th className="px-5 py-3 font-normal text-right">판매 수량</th>
                <th className="px-5 py-3 font-normal text-right">매출</th>
              </tr>
            </thead>
            <tbody>
              {summary.products.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-5 py-12 text-center text-stone-500">
                    해당 기간에 결제완료 판매가 없습니다.
                  </td>
                </tr>
              ) : (
                summary.products.map((row) => (
                  <tr key={row.sku || row.name} className="border-t border-stone-100">
                    <td className="px-5 py-3">
                      <div className="font-medium text-stone-900">{row.name}</div>
                      {row.sku ? <div className="mt-0.5 text-xs text-stone-500">{row.sku}</div> : null}
                    </td>
                    <td className="px-5 py-3 text-right tabular-nums">
                      {row.quantity.toLocaleString("ko-KR")}개
                    </td>
                    <td className="px-5 py-3 text-right font-medium tabular-nums text-stone-900">
                      {formatCurrency(row.revenue)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
