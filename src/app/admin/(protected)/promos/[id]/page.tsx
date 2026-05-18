import Link from "next/link";
import { notFound } from "next/navigation";

import { AdminDbUnavailableNotice } from "@/components/admin-db-unavailable";
import { loadAdminPromoPaidPerformance } from "@/lib/promo";
import { formatKoreanMobileDisplay } from "@/lib/phone-format";
import { formatCurrency, formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function AdminPromoPerformancePage({ params }: PageProps) {
  const { id } = await params;
  const loaded = await loadAdminPromoPaidPerformance(id);

  if (loaded.ok === false && loaded.reason === "not_found") {
    notFound();
  }

  if (loaded.ok === false) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-stone-900">공구 실적</h1>
        </div>
        <AdminDbUnavailableNotice />
        <Link href="/admin/promos" className="text-sm font-medium text-[#8b673f] hover:underline">
          공구캠페인으로
        </Link>
      </div>
    );
  }

  const { campaign, paidCount, totalPaidAmount, orders } = loaded;

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-stone-500">공구 실적</p>
          <h1 className="mt-1 text-2xl font-semibold text-stone-900">{campaign.title}</h1>
          <p className="mt-1 font-mono text-sm text-stone-600">{campaign.code}</p>
        </div>
        <div className="flex flex-wrap gap-2 text-sm">
          <Link href="/admin/promos" className="rounded-full border border-stone-200 bg-white px-4 py-2 font-medium text-stone-700 hover:bg-stone-50">
            공구 목록
          </Link>
          <Link href="/admin" className="rounded-full border border-stone-200 bg-white px-4 py-2 font-medium text-stone-700 hover:bg-stone-50">
            대시보드
          </Link>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wider text-stone-500">결제 완료 건수</p>
          <p className="mt-2 text-3xl font-semibold tabular-nums text-stone-900">{paidCount}</p>
        </div>
        <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wider text-stone-500">총 결제 금액</p>
          <p className="mt-2 text-3xl font-semibold tabular-nums text-stone-900">{formatCurrency(totalPaidAmount)}</p>
        </div>
      </div>

      <section className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">
        <div className="border-b border-stone-100 px-5 py-4">
          <h2 className="text-sm font-semibold text-stone-900">결제 완료 주문</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-[#faf8f5] text-xs text-stone-600">
              <tr>
                <th className="px-4 py-3 font-medium">주문번호</th>
                <th className="px-4 py-3 font-medium">결제일시</th>
                <th className="px-4 py-3 font-medium">고객</th>
                <th className="px-4 py-3 font-medium">상품</th>
                <th className="px-4 py-3 font-medium text-right">결제금액</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center text-stone-500">
                    이 공구 코드로 결제 완료된 주문이 없습니다.
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.id} className="border-t border-stone-100">
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin/orders/${encodeURIComponent(order.orderNumber)}`}
                        className="font-medium text-[#8b673f] hover:underline"
                      >
                        {order.orderNumber}
                      </Link>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-stone-600">
                      {order.paidAt ? formatDate(order.paidAt) : formatDate(order.createdAt)}
                    </td>
                    <td className="px-4 py-3 text-stone-600">
                      <div>{order.customerName}</div>
                      <div className="text-xs text-stone-400">{formatKoreanMobileDisplay(order.phone)}</div>
                    </td>
                    <td className="max-w-[220px] px-4 py-3 text-stone-600">
                      <span className="line-clamp-2">
                        {order.orderItems.map((item) => `${item.productNameSnapshot}×${item.quantity}`).join(", ")}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-right font-medium text-stone-900">
                      {formatCurrency(order.totalAmount)}
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
