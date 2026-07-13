import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

import { OrderLookupResultScroll } from "@/components/order-lookup-result-scroll";
import { StatusConfirmDialog } from "@/components/status-confirm-dialog";
import {
  lookupCustomerOrder,
  lookupCustomerOrdersByNameAndPhone,
  normalizeKoreanPhoneDigits,
  type CustomerOrderView,
} from "@/lib/orders";
import { formatKoreanMobileDisplay } from "@/lib/phone-format";
import { noIndexPageMetadata } from "@/lib/site-seo";
import {
  CHANGE_OF_MIND_SHIPPING_FEE,
  formatChangeOfMindShippingFee,
  refundAmountAfterChangeOfMindFee,
} from "@/lib/refund-policy";
import { formatCurrency, formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  ...noIndexPageMetadata,
  title: "주문 취소·환불",
  description: "결제완료 주문을 조회해 발송 전 취소 또는 발송 후 환불 요청을 합니다.",
};

function actionBadge(order: CustomerOrderView) {
  if (order.canCancelNow) {
    return (
      <span className="rounded-full bg-red-100 px-2.5 py-1 text-xs font-medium text-red-900">
        발송 전 · 즉시 취소
      </span>
    );
  }
  if (order.customerCancelRequestedAt) {
    return (
      <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-medium text-amber-950">
        환불 요청 접수됨
      </span>
    );
  }
  if (order.canRequestRefund) {
    return (
      <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-medium text-amber-950">
        배송중 · 환불 요청
      </span>
    );
  }
  return null;
}

function OrderDetailCard({
  order,
  phone,
  customerName,
}: {
  order: CustomerOrderView;
  phone: string;
  customerName: string;
}) {
  return (
    <section className="space-y-6 rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm text-stone-500">주문번호</p>
          <h2 className="mt-1 text-xl font-semibold text-stone-900">{order.orderNumber}</h2>
          <p className="mt-1 text-sm text-stone-500">{formatDate(order.createdAt)}</p>
          <div className="mt-2">{actionBadge(order)}</div>
        </div>
        <div className="text-right text-sm">
          <p className="text-stone-500">결제 · 배송</p>
          <p className="font-medium text-stone-900">결제완료 · {order.fulfillmentLabel}</p>
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
          환불·취소 요청이 {formatDate(order.customerCancelRequestedAt)}에 접수되어 있습니다. 관리자가 확인 후
          처리합니다.
          {order.customerCancelReason ? (
            <p className="mt-1 text-amber-900/80">사유: {order.customerCancelReason}</p>
          ) : null}
        </div>
      ) : null}

      {order.canCancelNow ? (
        <div className="rounded-xl border border-red-200/80 bg-red-50/50 p-5">
          <h3 className="text-sm font-semibold text-red-950">즉시 취소 · 환불</h3>
          <p className="mt-1 text-sm leading-6 text-red-950/80">
            아직 발송 전(운송장 미등록)이라 결제 금액이 <strong className="font-medium">전액</strong> 취소됩니다.
            배송비 차감은 없습니다.
          </p>
          <form method="post" action="/order/lookup/cancel" className="mt-4 space-y-3">
            <input type="hidden" name="orderNumber" value={order.orderNumber} />
            <input type="hidden" name="phone" value={phone} />
            <input type="hidden" name="customerName" value={customerName} />
            <label className="block text-sm">
              <span className="text-stone-700">취소 사유 (선택)</span>
              <input
                name="reason"
                maxLength={200}
                placeholder="예: 단순 변심"
                className="mt-1 w-full rounded-xl border border-red-200 bg-white px-3 py-2 text-sm text-stone-900 outline-none focus:border-red-400"
              />
            </label>
            <button
              type="submit"
              className="w-full rounded-full bg-red-800 px-5 py-3 text-sm font-semibold text-white hover:bg-red-900 sm:w-auto"
            >
              결제 취소하기
            </button>
          </form>
        </div>
      ) : null}

      {order.canRequestRefund ? (
        <div className="rounded-xl border border-amber-200 bg-amber-50/60 p-5">
          <h3 className="text-sm font-semibold text-amber-950">환불 요청</h3>
          <p className="mt-1 text-sm leading-6 text-amber-950/80">
            운송장이 등록되어 배송이 진행 중입니다. 즉시 취소는 불가하며, 요청을 남기시면 관리자가 확인 후
            처리합니다.
          </p>
          <div className="mt-3 rounded-lg border border-amber-200/80 bg-white/70 px-3 py-2.5 text-xs leading-5 text-amber-950/90">
            <p>
              <strong className="font-semibold">단순 변심</strong> 환불 시 배송비{" "}
              <strong className="font-semibold">{formatChangeOfMindShippingFee()}</strong>이 차감됩니다. (예상 환불{" "}
              {formatCurrency(refundAmountAfterChangeOfMindFee(order.totalAmount))})
            </p>
            <p className="mt-1">상품 하자·오배송은 확인 후 전액 환불될 수 있습니다.</p>
          </div>
          <form method="post" action="/order/lookup/refund-request" className="mt-4 space-y-3">
            <input type="hidden" name="orderNumber" value={order.orderNumber} />
            <input type="hidden" name="phone" value={phone} />
            <input type="hidden" name="customerName" value={customerName} />
            <fieldset className="space-y-2 text-sm">
              <legend className="text-stone-700">환불 사유 구분</legend>
              <label className="flex cursor-pointer items-start gap-2 rounded-xl border border-amber-200 bg-white px-3 py-2.5">
                <input
                  type="radio"
                  name="refundCategory"
                  value="change_of_mind"
                  defaultChecked
                  className="mt-1"
                />
                <span>
                  <span className="font-medium text-stone-900">단순 변심</span>
                  <span className="mt-0.5 block text-xs text-stone-500">
                    배송비 {CHANGE_OF_MIND_SHIPPING_FEE.toLocaleString("ko-KR")}원 차감
                  </span>
                </span>
              </label>
              <label className="flex cursor-pointer items-start gap-2 rounded-xl border border-amber-200 bg-white px-3 py-2.5">
                <input type="radio" name="refundCategory" value="defect" className="mt-1" />
                <span>
                  <span className="font-medium text-stone-900">상품 하자 · 오배송</span>
                  <span className="mt-0.5 block text-xs text-stone-500">확인 후 전액 환불 검토</span>
                </span>
              </label>
            </fieldset>
            <label className="block text-sm">
              <span className="text-stone-700">상세 사유</span>
              <input
                name="reason"
                required
                maxLength={300}
                placeholder="예: 사이즈가 맞지 않아요"
                className="mt-1 w-full rounded-xl border border-amber-200 bg-white px-3 py-2 text-sm text-stone-900 outline-none focus:border-amber-400"
              />
            </label>
            <button
              type="submit"
              className="w-full rounded-full bg-amber-900 px-5 py-3 text-sm font-semibold text-white hover:bg-amber-950 sm:w-auto"
            >
              환불 요청 남기기
            </button>
          </form>
        </div>
      ) : null}
    </section>
  );
}

export default async function OrderLookupPage({
  searchParams,
}: {
  searchParams: Promise<{
    orderNumber?: string;
    phone?: string;
    customerName?: string;
    error?: string;
    ok?: string;
  }>;
}) {
  const q = await searchParams;
  const orderNumber = q.orderNumber?.trim() ?? "";
  const phone = q.phone?.trim() ?? "";
  const customerName = q.customerName?.trim() ?? "";
  const ok = q.ok?.trim() || null;

  let error = q.error?.trim() || null;
  let list: CustomerOrderView[] = [];
  let selected: CustomerOrderView | null = null;
  let lookupFailed = false;
  let identityMatchedButNoActionable = false;

  const triedLookup = Boolean(customerName || phone || orderNumber);

  if (triedLookup) {
    if (customerName.replace(/\s+/g, "").length < 2) {
      error = error || "주문자 이름을 입력해 주세요.";
    } else if (normalizeKoreanPhoneDigits(phone).length < 10) {
      error = error || "휴대폰 번호를 확인해 주세요. (예: 010-1234-5678)";
    } else {
      try {
        const result = await lookupCustomerOrdersByNameAndPhone(customerName, phone);
        list = result.orders;
        identityMatchedButNoActionable = result.identityMatchedButNoActionable;

        if (orderNumber) {
          selected = await lookupCustomerOrder(orderNumber, phone, customerName);
          if (!selected) {
            // 목록에 있으면 그걸 쓰고, 없으면 안내
            selected = list.find((o) => o.orderNumber === orderNumber) ?? null;
            if (!selected) {
              error =
                error ||
                "선택한 주문은 취소·환불 대상이 아니거나 찾을 수 없습니다. 다시 조회해 주세요.";
            }
          }
        } else if (list.length === 1) {
          selected = list[0]!;
        } else if (list.length === 0 && !ok) {
          if (identityMatchedButNoActionable) {
            error =
              error ||
              "이름·연락처는 확인되었지만, 지금 취소·환불할 수 있는 결제완료 주문이 없습니다. (이미 취소·환불되었거나 결제대기만 있는 경우)";
          } else {
            error = error || "일치하는 주문이 없습니다. 주문 시 입력한 이름·연락처를 확인해 주세요.";
          }
        }
      } catch (e) {
        console.error("[order/lookup] lookup failed", e);
        lookupFailed = true;
        error = error || "주문 조회 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.";
      }
    }
  }

  const showResult = Boolean(selected) || (!selected && list.length > 1);

  return (
    <div className="space-y-8 pb-24">
      <OrderLookupResultScroll active={showResult && !lookupFailed} />

      <section className="space-y-2.5 rounded-[40px] bg-[linear-gradient(145deg,#fbf3eb_0%,#eef3fa_100%)] p-6 shadow-[0_24px_80px_rgba(73,53,26,0.05)] sm:p-8 md:p-12">
        <p className="text-[11px] uppercase tracking-[0.28em] text-stone-500 sm:text-xs">Cancel · Refund</p>
        <h1 className="display-font text-[2rem] font-semibold leading-tight text-stone-900 sm:text-5xl">
          주문 취소 · 환불
        </h1>
        <p className="max-w-2xl text-[13px] leading-[1.72] text-stone-600 sm:text-sm">
          <strong className="font-medium text-stone-800">주문자 이름 + 연락처</strong>로 조회합니다.{" "}
          <strong className="font-medium text-stone-800">결제완료 · 발송 전</strong> 주문만 바로 전액 취소되고,{" "}
          <strong className="font-medium text-stone-800">운송장 등록(배송중)</strong>이면 환불 요청만 가능합니다.
          단순 변심 환불은 배송비 {CHANGE_OF_MIND_SHIPPING_FEE.toLocaleString("ko-KR")}원이 차감됩니다.
          이미 취소·환불된 주문은 표시되지 않습니다.
        </p>
      </section>

      {error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-950">{error}</div>
      ) : null}

      <Suspense fallback={null}>
        <StatusConfirmDialog
          open={ok === "cancelled"}
          title="취소가 완료되었습니다"
          message="결제가 취소(환불) 처리되었습니다. 카드사·결제수단에 따라 환불 반영까지 며칠 걸릴 수 있습니다."
          clearParam="ok"
          confirmLabel="확인"
        />
        <StatusConfirmDialog
          open={ok === "requested"}
          title="환불 요청이 접수되었습니다"
          message="요청이 정상적으로 접수되었습니다. 평일 운영시간에 확인 후 연락드립니다."
          clearParam="ok"
          confirmLabel="확인"
        />
      </Suspense>

      <section className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
        <h2 className="text-sm font-semibold text-stone-900">주문 찾기</h2>
        <p className="mt-1 text-xs text-stone-500">결제완료된 취소·환불 가능 주문만 조회됩니다.</p>
        <form method="get" action="/order/lookup" className="mt-4 grid gap-4 sm:grid-cols-2">
          <label className="block text-sm">
            <span className="text-stone-600">주문자 이름</span>
            <input
              name="customerName"
              required
              autoComplete="name"
              defaultValue={customerName}
              placeholder="주문 시 입력한 이름"
              className="mt-1 w-full rounded-xl border border-stone-200 px-3 py-3 text-base text-stone-900 outline-none focus:border-[#b89156] sm:text-sm"
            />
          </label>
          <label className="block text-sm">
            <span className="text-stone-600">주문 시 연락처</span>
            <input
              name="phone"
              required
              autoComplete="tel"
              defaultValue={phone}
              placeholder="010-0000-0000"
              inputMode="tel"
              className="mt-1 w-full rounded-xl border border-stone-200 px-3 py-3 text-base text-stone-900 outline-none focus:border-[#b89156] sm:text-sm"
            />
          </label>
          <div className="sm:col-span-2">
            <button
              type="submit"
              className="btn-luxe-primary w-full rounded-full px-6 py-3.5 text-sm font-semibold sm:w-auto sm:py-2.5"
            >
              조회하기
            </button>
          </div>
        </form>
      </section>

      <div id="lookup-result" className="scroll-mt-28 space-y-6">
        {!selected && list.length > 1 ? (
          <section className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-sm font-semibold text-stone-900">취소·환불 가능 주문 {list.length}건</h2>
            <p className="mt-1 text-sm text-stone-500">처리할 주문을 선택해 주세요.</p>
            <ul className="mt-4 divide-y divide-stone-100">
              {list.map((order) => (
                <li key={order.orderNumber}>
                  <Link
                    href={`/order/lookup?${new URLSearchParams({
                      customerName,
                      phone,
                      orderNumber: order.orderNumber,
                    }).toString()}`}
                    className="flex flex-wrap items-center justify-between gap-3 py-4 text-sm transition hover:bg-stone-50"
                  >
                    <div>
                      <p className="font-medium text-[#8b673f]">{order.orderNumber}</p>
                      <p className="mt-1 text-stone-600">
                        {formatDate(order.createdAt)} ·{" "}
                        {order.items.map((item) => `${item.name}×${item.quantity}`).join(", ")}
                      </p>
                      <div className="mt-2">{actionBadge(order)}</div>
                    </div>
                    <div className="text-right">
                      <p className="text-stone-800">{order.fulfillmentLabel}</p>
                      <p className="mt-1 font-medium text-stone-900">{formatCurrency(order.totalAmount)}</p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {selected ? <OrderDetailCard order={selected} phone={phone} customerName={customerName} /> : null}
      </div>

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
