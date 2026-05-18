import Link from "next/link";

import { AdminDashboardPromoLinks } from "@/components/admin-dashboard-promo-links";
import { AdminDbUnavailableNotice } from "@/components/admin-db-unavailable";
import { inflowSummary } from "@/lib/admin-order-inflow";
import { loadAdminOrdersOverview } from "@/lib/orders";
import { listPromoCampaignsAdmin } from "@/lib/promo";
import { formatKoreanMobileDisplay } from "@/lib/phone-format";
import { formatCurrency, formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

function StatCard({ label, value, href }: { label: string; value: number; href: string }) {
  return (
    <Link
      href={href}
      className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm transition hover:border-[#b89156]/40 hover:shadow-md"
    >
      <p className="text-xs font-medium uppercase tracking-wider text-stone-500">{label}</p>
      <p className="mt-2 text-3xl font-semibold tabular-nums text-stone-900">{value}</p>
    </Link>
  );
}

export default async function AdminDashboardPage() {
  const loaded = await loadAdminOrdersOverview();
  const stats = loaded.ok ? loaded.stats : { all: 0, pending: 0, paid: 0, cancelled: 0, refunded: 0 };
  const orders = loaded.ok ? loaded.orders : [];
  const recent = orders.slice(0, 8);

  let promoLinkRows: { id: string; code: string; title: string; isActive: boolean }[] = [];
  if (loaded.ok) {
    try {
      const rows = await listPromoCampaignsAdmin();
      promoLinkRows = rows.slice(0, 12).map((r) => ({
        id: r.id,
        code: r.code,
        title: r.title,
        isActive: r.isActive,
      }));
    } catch {
      promoLinkRows = [];
    }
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "";

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-2xl font-semibold text-stone-900">주문 한눈에 보기</h1>
        <p className="mt-1 text-sm text-stone-500">숫자를 누르면 해당 상태만 주문 목록으로 이동합니다.</p>
      </div>

      {!loaded.ok ? (
        <AdminDbUnavailableNotice />
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="전체" value={stats.all} href="/admin/orders" />
        <StatCard label="결제 완료" value={stats.paid} href="/admin/orders?status=PAID" />
        <StatCard label="결제 대기" value={stats.pending} href="/admin/orders?status=PENDING" />
        <StatCard
          label="취소·환불"
          value={stats.cancelled + stats.refunded}
          href="/admin/orders?status=CANCELLED_REFUNDED"
        />
      </div>

      {loaded.ok ? (
        <section className="rounded-2xl border border-stone-200 bg-white shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-100 px-5 py-4">
            <div>
              <h2 className="text-sm font-semibold text-stone-900">공구 유입 링크</h2>
              <p className="mt-1 text-xs text-stone-500">
                인플루에게 보낼 주소입니다. <span className="font-mono">NEXT_PUBLIC_SITE_URL</span>이 있으면 그 도메인으로, 없으면 현재 접속 주소 기준으로 표시됩니다.
              </p>
            </div>
            <Link href="/admin/promos" className="text-xs font-medium text-[#8b673f] hover:underline">
              공구캠페인
            </Link>
          </div>
          <div className="px-2 py-2 sm:px-0 sm:py-0">
            <AdminDashboardPromoLinks baseUrlFromEnv={siteUrl} campaigns={promoLinkRows} />
          </div>
        </section>
      ) : null}

      <section className="rounded-2xl border border-stone-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-stone-100 px-5 py-4">
          <h2 className="text-sm font-semibold text-stone-900">최근 주문</h2>
          <Link href="/admin/orders" className="text-xs font-medium text-[#8b673f] hover:underline">
            전체 보기
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-[#faf8f5] text-xs text-stone-600">
              <tr>
                <th className="px-5 py-3 font-medium">주문번호</th>
                <th className="px-5 py-3 font-medium">일시</th>
                <th className="px-5 py-3 font-medium">고객</th>
                <th className="px-5 py-3 font-medium">상태</th>
                <th className="px-5 py-3 font-medium">배송</th>
                <th className="px-5 py-3 font-medium">레퍼럴·공구</th>
                <th className="px-5 py-3 font-medium text-right">금액</th>
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
                    <td className="px-5 py-3">
                      <Link href={`/admin/orders/${encodeURIComponent(order.orderNumber)}`} className="font-medium text-[#8b673f] hover:underline">
                        {order.orderNumber}
                      </Link>
                    </td>
                    <td className="px-5 py-3 text-stone-600">{formatDate(order.createdAt)}</td>
                    <td className="px-5 py-3 text-stone-600">
                      <div>{order.customerName}</div>
                      <div className="text-xs text-stone-400">{formatKoreanMobileDisplay(order.phone)}</div>
                    </td>
                    <td className="px-5 py-3 text-stone-700">{order.paymentStatus}</td>
                    <td className="px-5 py-3 text-stone-600">
                      {order.trackingNumber ? (
                        <span className="text-emerald-700">송장 등록</span>
                      ) : order.paymentStatus === "PAID" ? (
                        <span className="text-amber-700">발송 전</span>
                      ) : (
                        <span>—</span>
                      )}
                    </td>
                    <td className="max-w-[160px] px-5 py-3">
                      <div className="truncate font-mono text-xs text-stone-700" title={inflowSummary(order)}>
                        {inflowSummary(order)}
                      </div>
                    </td>
                    <td className="px-5 py-3 text-right font-medium text-stone-900">{formatCurrency(order.totalAmount)}</td>
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
