import { FulfillmentStatus } from "@prisma/client";
import Link from "next/link";
import { notFound } from "next/navigation";

import { markOrderDeliveredForm, saveOrderAdminForm } from "./actions";
import { AdminDbUnavailableNotice } from "@/components/admin-db-unavailable";
import { adminFulfillmentLabel } from "@/lib/admin-fulfillment";
import { loadAdminOrderByNumber } from "@/lib/orders";
import { formatKoreanMobileDisplay } from "@/lib/phone-format";
import { trackingLookupUrl } from "@/lib/tracking-url";
import { formatCurrency, formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminOrderDetailPage({ params }: { params: Promise<{ orderNumber: string }> }) {
  const { orderNumber: raw } = await params;
  const orderNumber = decodeURIComponent(raw);
  const loaded = await loadAdminOrderByNumber(orderNumber);
  if (!loaded.ok) {
    return (
      <div className="space-y-6">
        <Link href="/admin/orders" className="text-xs font-medium text-[#8b673f] hover:underline">
          ← 주문 목록
        </Link>
        <AdminDbUnavailableNotice />
      </div>
    );
  }
  const order = loaded.order;
  if (!order) {
    notFound();
  }

  const lookup = trackingLookupUrl(order.carrier, order.trackingNumber);
  const showDeliverButton =
    order.paymentStatus === "PAID" &&
    order.fulfillmentStatus !== FulfillmentStatus.DELIVERED &&
    Boolean(order.trackingNumber?.trim());

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <Link href="/admin/orders" className="text-xs font-medium text-[#8b673f] hover:underline">
            ← 주문 목록
          </Link>
          <h1 className="mt-2 text-2xl font-semibold text-stone-900">{order.orderNumber}</h1>
          <p className="mt-1 text-sm text-stone-500">{formatDate(order.createdAt)}</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-stone-500">총액</p>
          <p className="text-xl font-semibold text-stone-900">{formatCurrency(order.totalAmount)}</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
          <h2 className="text-sm font-semibold text-stone-900">고객·배송지</h2>
          <dl className="mt-4 space-y-3 text-sm">
            <div>
              <dt className="text-stone-500">이름</dt>
              <dd className="font-medium text-stone-900">{order.customerName}</dd>
            </div>
            <div>
              <dt className="text-stone-500">연락처</dt>
              <dd className="text-stone-800">{formatKoreanMobileDisplay(order.phone)}</dd>
            </div>
            <div>
              <dt className="text-stone-500">주소</dt>
              <dd className="text-stone-800">
                ({order.postalCode}) {order.address}
              </dd>
            </div>
            {order.memo ? (
              <div>
                <dt className="text-stone-500">고객 요청</dt>
                <dd className="text-stone-800">{order.memo}</dd>
              </div>
            ) : null}
          </dl>
        </section>

        <section className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
          <h2 className="text-sm font-semibold text-stone-900">결제</h2>
          <dl className="mt-4 space-y-3 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-stone-500">상태</dt>
              <dd className="font-medium text-stone-900">{order.paymentStatus}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-stone-500">배송 단계</dt>
              <dd className="font-medium text-stone-900">{adminFulfillmentLabel(order)}</dd>
            </div>
            {order.deliveredAt ? (
              <div className="flex justify-between gap-4">
                <dt className="text-stone-500">배송완료 처리</dt>
                <dd className="text-stone-800">{formatDate(order.deliveredAt)}</dd>
              </div>
            ) : null}
            <div className="flex justify-between gap-4">
              <dt className="text-stone-500">수단</dt>
              <dd className="text-stone-800">{order.paymentMethod}</dd>
            </div>
            {order.paymentProvider ? (
              <div className="flex justify-between gap-4">
                <dt className="text-stone-500">PG</dt>
                <dd className="text-stone-800">{order.paymentProvider}</dd>
              </div>
            ) : null}
            <div className="border-t border-stone-100 pt-3">
              <p className="text-xs font-medium uppercase tracking-wide text-stone-500">유입 · 공구</p>
              <dl className="mt-2 space-y-2 text-sm">
                <div className="flex justify-between gap-4">
                  <dt className="text-stone-500">적용 공구 코드</dt>
                  <dd className="font-mono text-stone-800">{order.appliedPromoCode ?? "—"}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-stone-500">레퍼럴(ref)</dt>
                  <dd className="font-mono text-stone-800">{order.referralCode ?? "—"}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-stone-500">쿠폰 입력</dt>
                  <dd className="font-mono text-stone-800">{order.couponCode?.trim() ? order.couponCode : "—"}</dd>
                </div>
              </dl>
            </div>
          </dl>
        </section>
      </div>

      <section className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
        <h2 className="text-sm font-semibold text-stone-900">상품</h2>
        <ul className="mt-4 divide-y divide-stone-100 text-sm">
          {order.orderItems.map((item) => (
            <li key={item.id} className="flex justify-between gap-4 py-3">
              <span className="text-stone-800">
                {item.productNameSnapshot} × {item.quantity}
              </span>
              <span className="shrink-0 text-stone-600">{formatCurrency(item.unitPrice * item.quantity)}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-2xl border border-[#b89156]/25 bg-[#fffdf9] p-6 shadow-sm">
        <h2 className="text-sm font-semibold text-stone-900">배송·메모 (관리자)</h2>
        <p className="mt-1 text-xs text-stone-500">
          결제 완료 후 <strong>발송준비</strong> → 운송장을 저장하면 <strong>배송중</strong> → 실제 수령이 확인되면 아래{" "}
          <strong>배송완료 처리</strong>를 눌러 마감합니다.
        </p>
        <form action={saveOrderAdminForm.bind(null, order.orderNumber)} className="mt-5 grid gap-4 sm:grid-cols-2">
          <label className="block text-sm">
            <span className="text-stone-600">택배사</span>
            <input
              name="carrier"
              defaultValue={order.carrier ?? ""}
              placeholder="예: CJ대한통운"
              className="mt-1 w-full rounded-xl border border-stone-200 bg-white px-3 py-2 text-stone-900 outline-none focus:border-[#b89156]"
            />
          </label>
          <label className="block text-sm">
            <span className="text-stone-600">운송장 번호</span>
            <input
              name="trackingNumber"
              defaultValue={order.trackingNumber ?? ""}
              placeholder="숫자만 또는 하이픈 포함"
              className="mt-1 w-full rounded-xl border border-stone-200 bg-white px-3 py-2 text-stone-900 outline-none focus:border-[#b89156]"
            />
          </label>
          <label className="block text-sm sm:col-span-2">
            <span className="text-stone-600">관리자 메모 (고객 비노출)</span>
            <textarea
              name="adminNote"
              rows={3}
              defaultValue={order.adminNote ?? ""}
              className="mt-1 w-full rounded-xl border border-stone-200 bg-white px-3 py-2 text-stone-900 outline-none focus:border-[#b89156]"
            />
          </label>
          <div className="flex flex-wrap items-center gap-3 sm:col-span-2">
            <button type="submit" className="btn-luxe-primary rounded-full px-6 py-2.5 text-sm font-semibold">
              저장
            </button>
            {lookup ? (
              <a
                href={lookup}
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-stone-200 bg-white px-5 py-2.5 text-sm font-medium text-stone-700 hover:bg-stone-50"
              >
                운송장 조회 (네이버)
              </a>
            ) : null}
            {order.shippedAt ? (
              <span className="text-xs text-stone-500">최초 송장 등록: {formatDate(order.shippedAt)}</span>
            ) : null}
          </div>
        </form>
        {showDeliverButton ? (
          <form action={markOrderDeliveredForm.bind(null, order.orderNumber)} className="mt-5 border-t border-stone-200/80 pt-5">
            <p className="text-xs text-stone-600">택배 배송이 고객에게 완료된 것이 확인된 경우에만 눌러 주세요.</p>
            <button
              type="submit"
              className="mt-3 rounded-full bg-emerald-800 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-900"
            >
              배송완료 처리
            </button>
          </form>
        ) : null}
      </section>
    </div>
  );
}
