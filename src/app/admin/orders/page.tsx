import Link from "next/link";

import { getOrders } from "@/lib/orders";
import { formatCurrency, formatDate } from "@/lib/utils";

export default async function AdminOrdersPage() {
  const orders = await getOrders();

  return (
    <div className="space-y-10 pb-20">
      <section className="flex flex-col gap-4 rounded-[36px] bg-white p-8 md:flex-row md:items-end md:justify-between md:p-12">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-stone-500">Admin Orders</p>
          <h1 className="mt-4 text-4xl font-semibold text-stone-900">주문 관리</h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-stone-600">
            레퍼럴 코드, 결제수단, 주문 상태가 함께 저장되며 엑셀 다운로드까지 바로 연결됩니다.
          </p>
        </div>

        <Link
          href="/api/admin/orders/export"
          className="btn-luxe-primary rounded-full px-5 py-3 text-sm font-semibold"
        >
          XLSX 다운로드
        </Link>
      </section>

      <section className="overflow-hidden rounded-[32px] border border-[rgba(116,88,59,0.12)] bg-white">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-[#f8f3ec] text-stone-700">
              <tr>
                <th className="px-5 py-4 font-medium">주문번호</th>
                <th className="px-5 py-4 font-medium">주문일시</th>
                <th className="px-5 py-4 font-medium">상품</th>
                <th className="px-5 py-4 font-medium">고객</th>
                <th className="px-5 py-4 font-medium">결제수단</th>
                <th className="px-5 py-4 font-medium">상태</th>
                <th className="px-5 py-4 font-medium">레퍼럴</th>
                <th className="px-5 py-4 font-medium text-right">금액</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-5 py-10 text-center text-stone-500">
                    아직 저장된 주문이 없습니다.
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.id} className="border-t border-stone-100">
                    <td className="px-5 py-4 font-medium text-stone-900">{order.orderNumber}</td>
                    <td className="px-5 py-4 text-stone-600">{formatDate(order.createdAt)}</td>
                    <td className="px-5 py-4 text-stone-600">
                      {order.orderItems.map((item) => `${item.productNameSnapshot} x ${item.quantity}`).join(", ")}
                    </td>
                    <td className="px-5 py-4 text-stone-600">
                      <div>{order.customerName}</div>
                      <div className="text-xs text-stone-400">{order.phone}</div>
                    </td>
                    <td className="px-5 py-4 text-stone-600">{order.paymentMethod}</td>
                    <td className="px-5 py-4 text-stone-600">{order.paymentStatus}</td>
                    <td className="px-5 py-4 text-stone-600">{order.referralCode ?? "-"}</td>
                    <td className="px-5 py-4 text-right font-medium text-stone-900">
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
