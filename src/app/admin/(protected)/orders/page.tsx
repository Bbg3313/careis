import Link from "next/link";

import { AdminOrdersDateFilterForm } from "@/components/admin-orders-date-filter-form";
import { AdminDbUnavailableNotice } from "@/components/admin-db-unavailable";
import { buildAdminOrdersHref } from "@/lib/admin-orders-date-filter";
import { inflowSummary } from "@/lib/admin-order-inflow";import { loadAdminOrdersList } from "@/lib/orders";
import { formatKoreanMobileDisplay } from "@/lib/phone-format";
import { formatCurrency, formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams: Promise<{ status?: string; from?: string; to?: string }>;
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
  const { status, from, to } = await searchParams;
  const loaded = await loadAdminOrdersList({ from, to });
  let orders = loaded.ok ? loaded.orders : [];

  if (status === "PAID") {
    orders = orders.filter((o) => o.paymentStatus === "PAID");
  } else if (status === "PENDING") {
    orders = orders.filter((o) => o.paymentStatus === "PENDING");
  } else if (status === "CANCELLED_REFUNDED") {
    orders = orders.filter((o) => o.paymentStatus === "CANCELLED" || o.paymentStatus === "REFUNDED");
  }

  const dateFilterActive = Boolean(from?.trim() || to?.trim());
  const clearOrdersHref = buildAdminOrdersHref({ status: status || undefined });

  const tabs = [
    { href: buildAdminOrdersHref({ from, to }), label: "전체", key: "" },
    { href: buildAdminOrdersHref({ status: "PAID", from, to }), label: "결제완료", key: "PAID" },
    { href: buildAdminOrdersHref({ status: "PENDING", from, to }), label: "결제대기", key: "PENDING" },
    {
      href: buildAdminOrdersHref({ status: "CANCELLED_REFUNDED", from, to }),
      label: "취소·환불",
      key: "CANCELLED_REFUNDED",
    },
  ] as const;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-stone-900">주문 목록</h1>
        <p className="mt-1 text-sm text-stone-500">
          {statusLabel(status)} · {orders.length}건
          {dateFilterActive ? (
            <span className="ml-2 text-[#8b673f]">
              (기간 필터: {from?.trim() || "…"} ~ {to?.trim() || "…"})
            </span>
          ) : null}
        </p>
      </div>

      {!loaded.ok ? <AdminDbUnavailableNotice /> : null}

      <AdminOrdersDateFilterForm
        action="/admin/orders"
        status={status}
        defaultFrom={from}
        defaultTo={to}
        clearHref={clearOrdersHref}
      />

      <div className="flex flex-wrap gap-2">
        {tabs.map((tab) => {
          const active = (status ?? "") === tab.key || (!status && tab.key === "");
          return (
            <Link
              key={tab.key}
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
                <th className="px-4 py-3 font-medium">레퍼럴·공구</th>
                <th className="px-4 py-3 font-medium text-right">금액</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-stone-500">
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
                    <td className="max-w-[160px] px-4 py-3">
                      <div className="truncate font-mono text-xs text-stone-700" title={inflowSummary(order)}>
                        {inflowSummary(order)}
                      </div>
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
