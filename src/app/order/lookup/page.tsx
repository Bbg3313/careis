import type { Metadata } from "next";
import Link from "next/link";

import { customerCancelForm, customerRefundRequestForm, lookupOrderForm } from "./actions";
import { adminPaymentStatusLabel } from "@/lib/admin-fulfillment";
import { lookupCustomerOrder } from "@/lib/orders";
import { formatKoreanMobileDisplay } from "@/lib/phone-format";
import { noIndexPageMetadata } from "@/lib/site-seo";
import { formatCurrency, formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  ...noIndexPageMetadata,
  title: "주문 조회·취소",
  description: "비회원 주문을 조회하고 취소 또는 환불 요청을 합니다.",
};

export default async function OrderLookupPage({
  searchParams,
}: {
  searchParams: Promise<{
    orderNumber?: string;
    phone?: string;
    error?: string;
    ok?: string;
  }>;
}) {
  const q = await searchParams;
  const orderNumber = q.orderNumber?.trim() ?? "";
  const phone = q.phone?.trim() ?? "";
  const error = q.error?.trim() || null;
  const ok = q.ok?.trim() || null;

  const order =
    orderNumber && phone ? await lookupCustomerOrder(orderNumber, phone) : null;

  return (
    <div className="space-y-8 pb-24">
      <section className="space-y-2.5 rounded-[40px] bg-[linear-gradient(145deg,#fbf3eb_0%,#eef3fa_100%)] p-6 shadow-[0_24px_80px_rgba(73,53,26,0.05)] sm:p-8 md:p-12">
        <p className="text-[11px] uppercase tracking-[0.28em] text-stone-500 sm:text-xs">Order Lookup</p>
        <h1 className="display-font text-[2rem] font-semibold leading-tight text-stone-900 sm:text-5xl">
          주문 조회 · 취소
        </h1>
        <p className="max-w-2xl text-[13px] leading-[1.72] text-stone-600 sm:text-sm">
          비회원 주문은 <strong className="font-medium text-stone-800">주문번호 + 연락처</strong>로 조회합니다.
          발송 전이면 바로 취소·환불이 가능하고, 발송 후에는 환불 요청을 남기면 관리자가 확인합니다.
        </p>
      </section>

      {error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-950">{error}</div>
      ) : null}
      {ok === "cancelled" ? (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-950">
          주문이 취소되었습니다. 결제완료 건은 결제 취소(환불)가 함께 진행됩니다.
        </div>
      ) : null}
      {ok === "requested" ? (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-950">
          환불·취소 요청이 접수되었습니다. 평일 운영시간에 확인 후 연락드립니다.
        </div>
      ) : null}

      <section className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
        <h2 className="text-sm font-semibold text-stone-900">주문 찾기</h2>
        <form action={lookupOrderForm} className="mt-4 grid gap-4 sm:grid-cols-2">
          <label className="block text-sm">
            <span className="text-stone-600">주문번호</span>
            <input
              name="orderNumber"
              required
              defaultValue={orderNumber}
              placeholder="주문 완료 화면에 표시된 번호"
              className="mt-1 w-full rounded-xl border border-stone-200 px-3 py-2.5 text-stone-900 outline-none focus:border-[#b89156]"
            />
          </label>
          <label className="block text-sm">
            <span className="text-stone-600">주문 시 연락처</span>
            <input
              name="phone"
              required
              defaultValue={phone}
              placeholder="010-0000-0000"
              className="mt-1 w-full rounded-xl border border-stone-200 px-3 py-2.5 text-stone-900 outline-none focus:border-[#b89156]"
            />
          </label>
          <div className="sm:col-span-2">
            <button type="submit" className="btn-luxe-primary rounded-full px-6 py-2.5 text-sm font-semibold">
              조회하기
            </button>
          </div>
        </form>
      </section>

      {order ? (
        <section className="space-y-6 rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-stone-500">주문번호</p>
              <h2 className="mt-1 font-mono text-xl font-semibold text-stone-900">{order.orderNumber}</h2>
              <p className="mt-1 text-sm text-stone-500">{formatDate(order.createdAt)}</p>
            </div>
            <div className="text-right text-sm">
              <p className="text-stone-500">결제 · 배송</p>
              <p className="font-medium text-stone-900">
                {adminPaymentStatusLabel(order.paymentStatus)} · {order.fulfillmentLabel}
              </p>
              <p className="mt-1 text-lg font-semibold text-stone-900">{formatCurrency(order.totalAmount)}</p>
            </div>
          </div>

          <dl className="grid gap-3 border-t border-stone-100 pt-4 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-stone-500">주문자</dt>
              <dd className="text-stone-900">{order.customerName}</dd>
            </div>
            <div>
              <dt className="text-stone-500">연락처</dt>
              <dd className="text-stone-900">{formatKoreanMobileDisplay(order.phone)}</dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-stone-500">배송지</dt>
              <dd className="text-stone-900">
                ({order.postalCode}) {order.address}
              </dd>
            </div>
          </dl>

          <ul className="divide-y divide-stone-100 border-t border-stone-100 text-sm">
            {order.items.map((item) => (
              <li key={`${item.name}-${item.quantity}`} className="flex justify-between gap-4 py-3">
                <span>
                  {item.name} × {item.quantity}
                </span>
                <span className="shrink-0 text-stone-600">{formatCurrency(item.lineTotal)}</span>
              </li>
            ))}
          </ul>

          {order.customerCancelRequestedAt ? (
            <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">
              환불·취소 요청이 {formatDate(order.customerCancelRequestedAt)}에 접수되어 있습니다.
              {order.customerCancelReason ? (
                <p className="mt-1 text-amber-900/80">사유: {order.customerCancelReason}</p>
              ) : null}
            </div>
          ) : null}

          {order.canCancelNow ? (
            <div className="rounded-xl border border-red-200/80 bg-red-50/50 p-5">
              <h3 className="text-sm font-semibold text-red-950">즉시 취소 · 환불</h3>
              <p className="mt-1 text-xs leading-6 text-red-950/80">
                {order.paymentStatus === "PAID"
                  ? "아직 발송 전이라 결제 취소(환불)가 바로 진행됩니다."
                  : "결제대기 주문이므로 주문만 취소됩니다."}
              </p>
              <form action={customerCancelForm} className="mt-4 space-y-3">
                <input type="hidden" name="orderNumber" value={order.orderNumber} />
                <input type="hidden" name="phone" value={phone} />
                <label className="block text-sm">
                  <span className="text-stone-700">취소 사유 (선택)</span>
                  <input
                    name="reason"
                    maxLength={200}
                    placeholder="예: 단순 변심"
                    className="mt-1 w-full rounded-xl border border-red-200 bg-white px-3 py-2 text-stone-900 outline-none focus:border-red-400"
                  />
                </label>
                <button
                  type="submit"
                  className="rounded-full bg-red-800 px-5 py-2.5 text-sm font-semibold text-white hover:bg-red-900"
                >
                  {order.paymentStatus === "PAID" ? "결제 취소하기" : "주문 취소하기"}
                </button>
              </form>
            </div>
          ) : null}

          {order.canRequestRefund ? (
            <div className="rounded-xl border border-amber-200 bg-amber-50/60 p-5">
              <h3 className="text-sm font-semibold text-amber-950">환불 · 취소 요청</h3>
              <p className="mt-1 text-xs leading-6 text-amber-950/80">
                이미 발송되었거나 배송 중이어서 바로 자동 환불은 되지 않습니다. 요청을 남기시면 관리자가
                확인 후 처리합니다.
              </p>
              <form action={customerRefundRequestForm} className="mt-4 space-y-3">
                <input type="hidden" name="orderNumber" value={order.orderNumber} />
                <input type="hidden" name="phone" value={phone} />
                <label className="block text-sm">
                  <span className="text-stone-700">요청 사유</span>
                  <input
                    name="reason"
                    required
                    maxLength={300}
                    placeholder="예: 상품 불량 / 오배송"
                    className="mt-1 w-full rounded-xl border border-amber-200 bg-white px-3 py-2 text-stone-900 outline-none focus:border-amber-400"
                  />
                </label>
                <button
                  type="submit"
                  className="rounded-full bg-amber-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-amber-950"
                >
                  환불 요청 남기기
                </button>
              </form>
            </div>
          ) : null}

          {!order.canCancelNow && !order.canRequestRefund && !order.customerCancelRequestedAt ? (
            <p className="text-sm text-stone-500">
              이 주문은 이미 취소·환불되었거나, 추가 요청이 필요하지 않은 상태입니다. 문의는 고객센터로
              연락해 주세요.
            </p>
          ) : null}
        </section>
      ) : null}

      <p className="text-center text-sm text-stone-500">
        <Link href="/order" className="text-[#8b673f] underline-offset-2 hover:underline">
          주문하기
        </Link>
        {" · "}
        <Link href="/policy/shipping" className="text-[#8b673f] underline-offset-2 hover:underline">
          배송·교환·반품 안내
        </Link>
      </p>
    </div>
  );
}
