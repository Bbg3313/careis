import { FulfillmentStatus } from "@prisma/client";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { cancelOrderPaymentForm, deleteOrderForm, markOrderDeliveredForm, saveOrderAdminForm } from "./actions";
import { AdminDbUnavailableNotice } from "@/components/admin-db-unavailable";
import { StatusConfirmDialog } from "@/components/status-confirm-dialog";
import { adminFulfillmentLabel, adminPaymentStatusLabel } from "@/lib/admin-fulfillment";
import { loadAdminOrderByNumber, SWEET_TRACKER_DETAIL_MIN_INTERVAL_MS, syncOrderDeliveryFromSweetTracker } from "@/lib/orders";
import { formatKoreanMobileDisplay } from "@/lib/phone-format";
import { trackingLookupUrl } from "@/lib/tracking-url";
import { SWEET_TRACKER_CARRIER_OPTIONS } from "@/lib/sweet-tracker-carriers";
import { formatCurrency, formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminOrderDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ orderNumber: string }>;
  searchParams: Promise<{ cancelError?: string; cancelOk?: string; deleteError?: string }>;
}) {
  const { orderNumber: raw } = await params;
  const q = await searchParams;
  const orderNumber = decodeURIComponent(raw);
  const cancelError = q.cancelError?.trim() || null;
  const cancelOk = q.cancelOk === "1";
  const deleteError = q.deleteError?.trim() || null;
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
  if (!loaded.order) {
    notFound();
  }

  let order = loaded.order;

  if (process.env.SWEET_TRACKER_API_KEY) {
    const sync = await syncOrderDeliveryFromSweetTracker(orderNumber, {
      minIntervalMs: SWEET_TRACKER_DETAIL_MIN_INTERVAL_MS,
    });
    if (sync === "updated") {
      const next = await loadAdminOrderByNumber(orderNumber);
      if (next.ok && next.order) {
        order = next.order;
      }
    }
  }

  const lookup = trackingLookupUrl(order.carrier, order.trackingNumber);
  const showDeliverButton =
    order.paymentStatus === "PAID" &&
    order.fulfillmentStatus !== FulfillmentStatus.DELIVERED &&
    Boolean(order.trackingNumber?.trim());
  const canCancelOrder = order.paymentStatus === "PAID" || order.paymentStatus === "PENDING";
  const canDeleteOrder = order.paymentStatus !== "PAID";

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

      <Suspense fallback={null}>
        <StatusConfirmDialog
          open={cancelOk}
          title="취소가 완료되었습니다"
          message={`${order.orderNumber} 주문이 취소 처리되었습니다. 결제완료 건은 토스 결제 취소(환불)까지 반영됩니다.`}
          clearParam="cancelOk"
          confirmLabel="확인"
        />
      </Suspense>
      {cancelError ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-950">{cancelError}</div>
      ) : null}
      {deleteError ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-950">{deleteError}</div>
      ) : null}
      {order.customerCancelRequestedAt ? (
        <div className="rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-950">
          <p className="font-medium">고객 환불·취소 요청이 접수되어 있습니다.</p>
          <p className="mt-1 text-amber-900/85">
            요청 시각: {formatDate(order.customerCancelRequestedAt)}
            {order.customerCancelReason ? ` · 사유: ${order.customerCancelReason}` : null}
          </p>
          <p className="mt-1 text-xs text-amber-900/70">
            아래에서 결제 취소를 진행하면 요청이 처리된 것으로 정리됩니다.
          </p>
        </div>
      ) : null}

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
              <dd className="font-medium text-stone-900">{adminPaymentStatusLabel(order.paymentStatus)}</dd>
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
          결제 완료 후 <strong>발송준비</strong> → 운송장을 저장하면 <strong>배송중</strong> → 스마트택배 조회상 배송완료이면{" "}
          <strong>자동으로 배송완료</strong>로 바뀝니다. (서버에 <span className="font-mono">SWEET_TRACKER_API_KEY</span>와
          아래 택배사 코드 필요 · 주기 크론 + 이 페이지를 열 때 동기화)
        </p>
        <form action={saveOrderAdminForm.bind(null, order.orderNumber)} className="mt-5 grid gap-4 sm:grid-cols-2">
          <label className="block text-sm sm:col-span-2">
            <span className="text-stone-600">스마트택배 택배사 코드</span>
            <select
              name="trackingCarrierCode"
              defaultValue={order.trackingCarrierCode ?? ""}
              className="mt-1 w-full rounded-xl border border-stone-200 bg-white px-3 py-2 text-stone-900 outline-none focus:border-[#b89156]"
            >
              <option value="">미지정 (자동 배송완료 조회 안 함)</option>
              {SWEET_TRACKER_CARRIER_OPTIONS.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.label} ({c.code})
                </option>
              ))}
            </select>
          </label>
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
            <p className="text-xs text-stone-600">
              스마트택배 연동이 없거나 조회 지연이 있을 때만 사용하세요. 정상 시에는 조회 API가 자동으로 완료 처리합니다.
            </p>
            <button
              type="submit"
              className="mt-3 rounded-full bg-emerald-800 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-900"
            >
              배송완료 처리
            </button>
          </form>
        ) : null}
      </section>

      {canCancelOrder ? (
        <section className="rounded-2xl border border-red-200/80 bg-red-50/40 p-6 shadow-sm">
          <h2 className="text-sm font-semibold text-red-950">주문·결제 취소</h2>
          <p className="mt-1 text-xs leading-6 text-red-950/80">
            {order.paymentStatus === "PAID"
              ? "결제완료 주문은 토스페이먼츠에 결제 취소를 요청한 뒤, 주문 상태를 환불로 바꿉니다. 이미 발송된 건은 회수·재고를 별도로 확인하세요."
              : "결제대기 주문은 PG 취소 없이 주문만 취소 처리합니다."}
          </p>
          <form action={cancelOrderPaymentForm.bind(null, order.orderNumber)} className="mt-5 space-y-4">
            <label className="block text-sm">
              <span className="text-stone-700">취소 사유</span>
              <input
                name="cancelReason"
                required
                maxLength={200}
                placeholder="예: 고객 취소 요청"
                className="mt-1 w-full rounded-xl border border-red-200 bg-white px-3 py-2 text-stone-900 outline-none focus:border-red-400"
              />
            </label>
            <label className="block text-sm">
              <span className="text-stone-700">
                확인 — 아래 칸에 <strong className="font-semibold">취소</strong> 라고 입력
              </span>
              <input
                name="confirmCancel"
                required
                autoComplete="off"
                placeholder="취소"
                className="mt-1 w-full max-w-xs rounded-xl border border-red-200 bg-white px-3 py-2 text-stone-900 outline-none focus:border-red-400"
              />
            </label>
            <button
              type="submit"
              className="rounded-full bg-red-800 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-red-900"
            >
              {order.paymentStatus === "PAID" ? "결제 취소 · 환불 처리" : "주문 취소"}
            </button>
          </form>
        </section>
      ) : null}

      {canDeleteOrder ? (
        <section className="rounded-2xl border border-stone-300 bg-stone-50 p-6 shadow-sm">
          <h2 className="text-sm font-semibold text-stone-900">주문 삭제</h2>
          <p className="mt-1 text-xs leading-6 text-stone-600">
            목록·통계에서 이 주문을 <strong className="font-medium text-stone-800">완전히 삭제</strong>합니다. 복구할 수
            없습니다. 결제완료 주문은 먼저 결제 취소(환불)한 뒤에만 삭제할 수 있습니다.
          </p>
          <form action={deleteOrderForm.bind(null, order.orderNumber)} className="mt-5 space-y-4">
            <label className="block text-sm">
              <span className="text-stone-700">
                확인 — 아래 칸에 <strong className="font-semibold">삭제</strong> 라고 입력
              </span>
              <input
                name="confirmDelete"
                required
                autoComplete="off"
                placeholder="삭제"
                className="mt-1 w-full max-w-xs rounded-xl border border-stone-300 bg-white px-3 py-2 text-stone-900 outline-none focus:border-stone-500"
              />
            </label>
            <button
              type="submit"
              className="rounded-full bg-stone-900 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-stone-800"
            >
              주문 영구 삭제
            </button>
          </form>
        </section>
      ) : (
        <section className="rounded-2xl border border-dashed border-stone-200 bg-white p-6 text-sm text-stone-500">
          결제완료 주문은 삭제할 수 없습니다. 위에서 결제 취소(환불)한 뒤 삭제해 주세요.
        </section>
      )}
    </div>
  );
}
