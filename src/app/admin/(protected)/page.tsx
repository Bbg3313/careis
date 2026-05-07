import Link from "next/link";

import { getOrderStats, getOrders } from "@/lib/orders";
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
  const stats = await getOrderStats();
  const orders = await getOrders();
  const recent = orders.slice(0, 8);

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-2xl font-semibold text-stone-900">주문 한눈에 보기</h1>
        <p className="mt-1 text-sm text-stone-500">숫자를 누르면 해당 상태만 주문 목록으로 이동합니다.</p>
      </div>

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
                <th className="px-5 py-3 font-medium text-right">금액</th>
              </tr>
            </thead>
            <tbody>
              {recent.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-10 text-center text-stone-500">
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
                      <div className="text-xs text-stone-400">{order.phone}</div>
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
