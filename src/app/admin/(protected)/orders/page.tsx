import Link from "next/link";

import { AdminDbUnavailableNotice } from "@/components/admin-db-unavailable";
import { loadAdminOrdersList } from "@/lib/orders";
import { formatKoreanMobileDisplay } from "@/lib/phone-format";
import { formatCurrency, formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams: Promise<{ status?: string }>;
};

function statusLabel(status: string | undefined) {
  switch (status) {
    case "PAID":
      return "결제 완료";
    case "PENDING":
      return "결제 대기";
    case "CANCELLED_REFUNDED":
      return "취소·환불";
    default:
      return "전체";
  }
}

export default async function AdminOrdersPage({ searchParams }: PageProps) {
  const { status } = await searchParams;
  const loaded = await loadAdminOrdersList();
  let orders = loaded.ok ? loaded.orders : [];

  if (status === "PAID") {
    orders = orders.filter((o) => o.paymentStatus === "PAID");
  } else if (status === "PENDING") {
    orders = orders.filter((o) => o.paymentStatus === "PENDING");
  } else if (status === "CANCELLED_REFUNDED") {
    orders = orders.filter((o) => o.paymentStatus === "CANCELLED" || o.paymentStatus === "REFUNDED");
  }

  const tabs = [
    { href: "/admin/orders", label: "전체", key: "" },
    { href: "/admin/orders?status=PAID", label: "결제완료", key: "PAID" },
    { href: "/admin/orders?status=PENDING", label: "결제대기", key: "PENDING" },
    { href: "/admin/orders?status=CANCELLED_REFUNDED", label: "취소·환불", key: "CANCELLED_REFUNDED" },
  ] as const;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-stone-900">주문 목록</h1>
        <p className="mt-1 text-sm text-stone-500">{statusLabel(status)} · {orders.length}건</p>
      </div>

      {!loaded.ok ? <AdminDbUnavailableNotice /> : null}

      <div className="flex flex-wrap gap-2">
        {tabs.map((tab) => {
          const active = (status ?? "") === tab.key || (!status && tab.key === "");
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                active ? "bg-stone-900 text-white" : "border border-stone-200 bg-white text-stone-600 hover:bg-stone-50"
              }`}
            >
              {tab.label}
            </Link>
          );
        })}
      </div>

      <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-[#faf8f5] text-xs text-stone-600">
              <tr>
                <th className="px-4 py-3 font-medium">주문번호</th>
                <th className="px-4 py-3 font-medium">일시</th>
                <th className="px-4 py-3 font-medium">상품</th>
                <th className="px-4 py-3 font-medium">고객</th>
                <th className="px-4 py-3 font-medium">결제</th>
                <th className="px-4 py-3 font-medium">배송</th>
                <th className="px-4 py-3 font-medium text-right">금액</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-stone-500">
                    표시할 주문이 없습니다.
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
                    <td className="whitespace-nowrap px-4 py-3 text-stone-600">{formatDate(order.createdAt)}</td>
                    <td className="max-w-[200px] px-4 py-3 text-stone-600">
                      <span className="line-clamp-2">
                        {order.orderItems.map((item) => `${item.productNameSnapshot}×${item.quantity}`).join(", ")}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-stone-600">
                      <div>{order.customerName}</div>
                      <div className="text-xs text-stone-400">{formatKoreanMobileDisplay(order.phone)}</div>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-stone-700">{order.paymentStatus}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-stone-600">
                      {order.trackingNumber ? (
                        <span className="text-emerald-700">등록됨</span>
                      ) : order.paymentStatus === "PAID" ? (
                        <span className="text-amber-700">발송 전</span>
                      ) : (
                        "—"
                      )}
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
      </div>
    </div>
  );
}
