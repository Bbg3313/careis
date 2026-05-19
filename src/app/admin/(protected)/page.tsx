import Link from "next/link";

import { AdminDashboardPromoLinks } from "@/components/admin-dashboard-promo-links";
import { AdminOrdersDateFilterForm } from "@/components/admin-orders-date-filter-form";
import { AdminDbUnavailableNotice } from "@/components/admin-db-unavailable";
import { adminFulfillmentLabel, adminPaymentStatusLabel } from "@/lib/admin-fulfillment";
import { buildAdminOrdersHref } from "@/lib/admin-orders-date-filter";
import { inflowSummary } from "@/lib/admin-order-inflow";
import { loadAdminOrdersOverview } from "@/lib/orders";
import { aggregatePaidOrdersByAppliedPromoCode, listPromoCampaignsAdmin } from "@/lib/promo";
import { formatKoreanMobileDisplay } from "@/lib/phone-format";
import { formatCurrency, formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

type DashboardPageProps = {
  searchParams: Promise<{ from?: string; to?: string }>;
};

function StatCard({ label, value, href }: { label: string; value: number; href: string }) {
  return (
    <Link
      href={href}
      className="flex flex-col rounded-2xl border border-stone-200 bg-white p-5 shadow-sm transition hover:border-[#b89156]/40 hover:shadow-md"
    >
      <p className="text-left text-xs font-medium tracking-wide text-stone-500 normal-case">{label}</p>
      <p className="mt-2 text-right text-3xl font-semibold tabular-nums text-stone-900">{value}</p>
    </Link>
  );
}

export default async function AdminDashboardPage({ searchParams }: DashboardPageProps) {
  const { from, to } = await searchParams;

  const [loaded, promoRows, promoPaidByCode] = await Promise.all([
    loadAdminOrdersOverview({ from, to }),
    listPromoCampaignsAdmin().catch(() => [] as Awaited<ReturnType<typeof listPromoCampaignsAdmin>>),
    aggregatePaidOrdersByAppliedPromoCode(),
  ]);

  const stats = loaded.ok
    ? loaded.stats
    : {
        all: 0,
        pending: 0,
        paid: 0,
        cancelled: 0,
        refunded: 0,
        paidAwaitingShip: 0,
        paidInTransit: 0,
        paidDelivered: 0,
      };
  const recent = loaded.ok ? loaded.orders : [];

  const promoLinkRows = promoRows.slice(0, 12).map((r) => {
    const agg = promoPaidByCode.get(r.code) ?? { paidCount: 0, totalPaidAmount: 0 };
    return {
      id: r.id,
      code: r.code,
      title: r.title,
      isActive: r.isActive,
      paidCount: agg.paidCount,
      totalPaidAmount: agg.totalPaidAmount,
    };
  });

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "";

  return (
    <div className="space-y-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold text-stone-900">주문 한눈에 보기</h1>
        <Link
          href="/admin/orders/export"
          prefetch={false}
          className="shrink-0 rounded-full border border-[#b89156]/40 bg-[#faf8f5] px-4 py-2 text-sm font-medium text-stone-800 hover:bg-[#f3efe8]"
        >
          주문 엑셀 <span className="font-normal text-stone-500">(조건 선택)</span>
        </Link>
      </div>

      {!loaded.ok ? (
        <AdminDbUnavailableNotice />
      ) : null}

      <AdminOrdersDateFilterForm
        action="/admin"
        defaultFrom={from}
        defaultTo={to}
        clearHref="/admin"
      />

      <div>
        <h2 className="mb-3 text-base font-semibold text-stone-900">주문 요약</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="전체" value={stats.all} href={buildAdminOrdersHref({ from, to })} />
          <StatCard label="결제 완료" value={stats.paid} href={buildAdminOrdersHref({ status: "PAID", from, to })} />
          <StatCard label="결제 대기" value={stats.pending} href={buildAdminOrdersHref({ status: "PENDING", from, to })} />
          <StatCard
            label="취소·환불"
            value={stats.cancelled + stats.refunded}
            href={buildAdminOrdersHref({ status: "CANCELLED_REFUNDED", from, to })}
          />
        </div>
      </div>

      <div>
        <h2 className="mb-3 text-base font-semibold text-stone-900">배송 단계</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <StatCard
            label="배송 전"
            value={stats.paidAwaitingShip}
            href={buildAdminOrdersHref({ status: "PAID", fulfillment: "AWAITING_SHIP", from, to })}
          />
          <StatCard
            label="배송중"
            value={stats.paidInTransit}
            href={buildAdminOrdersHref({ status: "PAID", fulfillment: "IN_TRANSIT", from, to })}
          />
          <StatCard
            label="배송완료"
            value={stats.paidDelivered}
            href={buildAdminOrdersHref({ status: "PAID", fulfillment: "DELIVERED", from, to })}
          />
        </div>
      </div>

      <section className="rounded-2xl border border-stone-200 bg-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-100 px-5 py-4">
          <div>
            <h2 className="text-sm font-semibold text-stone-900">공구 유입 링크</h2>
          </div>
          <Link href="/admin/promos" className="text-xs font-medium text-[#8b673f] hover:underline">
            공구캠페인
          </Link>
        </div>
        <AdminDashboardPromoLinks baseUrlFromEnv={siteUrl} campaigns={promoLinkRows} />
      </section>

      <section className="rounded-2xl border border-stone-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-stone-100 px-5 py-4">
          <h2 className="text-sm font-semibold text-stone-900">최근 주문</h2>
          <Link href={buildAdminOrdersHref({ from, to })} className="text-xs font-medium text-[#8b673f] hover:underline">
            전체 보기
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px] border-collapse text-left text-sm text-stone-800">
            <thead className="bg-[#faf8f5] text-xs text-stone-600">
              <tr>
                <th className="align-middle px-5 py-3 font-medium">주문번호</th>
                <th className="align-middle px-5 py-3 font-medium">일시</th>
                <th className="align-middle px-5 py-3 font-medium">고객</th>
                <th className="align-middle px-5 py-3 font-medium">결제</th>
                <th className="align-middle px-5 py-3 font-medium">배송</th>
                <th className="align-middle px-5 py-3 font-medium">레퍼럴·공구</th>
                <th className="align-middle px-5 py-3 text-right font-medium">금액</th>
              </tr>
            </thead>
            <tbody>
              {recent.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-10 text-center text-stone-500">
                    주문이 없습니다.
                  </td>
                </tr>
              ) : (
                recent.map((order) => (
                  <tr key={order.id} className="border-t border-stone-100">
                    <td className="align-top px-5 py-3">
                      <Link href={`/admin/orders/${encodeURIComponent(order.orderNumber)}`} className="font-medium text-[#8b673f] hover:underline">
                        {order.orderNumber}
                      </Link>
                    </td>
                    <td className="align-top whitespace-nowrap px-5 py-3 tabular-nums text-stone-600">{formatDate(order.createdAt)}</td>
                    <td className="align-top px-5 py-3 text-stone-600">
                      <div>{order.customerName}</div>
                      <div className="text-xs text-stone-400">{formatKoreanMobileDisplay(order.phone)}</div>
                    </td>
                    <td className="align-top whitespace-nowrap px-5 py-3 text-stone-700">{adminPaymentStatusLabel(order.paymentStatus)}</td>
                    <td className="align-top whitespace-nowrap px-5 py-3 text-stone-700">{adminFulfillmentLabel(order)}</td>
                    <td className="align-top px-5 py-3">
                      <div className="max-w-[200px] truncate font-mono text-xs text-stone-700" title={inflowSummary(order)}>
                        {inflowSummary(order)}
                      </div>
                    </td>
                    <td className="align-top whitespace-nowrap px-5 py-3 text-right font-medium tabular-nums text-stone-900">{formatCurrency(order.totalAmount)}</td>
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
