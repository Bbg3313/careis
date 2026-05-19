import Link from "next/link";
import type { Metadata } from "next";

import { AdminDbUnavailableNotice } from "@/components/admin-db-unavailable";
import { buildAdminOrdersExportApiHref } from "@/lib/admin-orders-date-filter";
import { adminFulfillmentLabel, adminPaymentStatusLabel } from "@/lib/admin-fulfillment";
import { inflowSummary } from "@/lib/admin-order-inflow";
import {
  getOrdersForExport,
  listDistinctAppliedPromoCodesFromOrders,
  listDistinctInflowCodesFromOrders,
  type OrdersExportFilter,
} from "@/lib/orders";
import { formatKoreanMobileDisplay } from "@/lib/phone-format";
import { formatCurrency, formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "주문 엑셀",
};

function exportApiQueryString(params: Record<string, string | undefined>) {
  const sp = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== "") {
      sp.set(key, value);
    }
  }
  const q = sp.toString();
  return q ? `?${q}` : "";
}

function buildExportTabHref(
  next: "general" | "promo",
  q: {
    from?: string;
    to?: string;
    status?: string;
    fulfillment?: string;
    inflowCode?: string;
    preview?: string;
  },
) {
  const p = new URLSearchParams();
  p.set("tab", next);
  if (q.from?.trim()) p.set("from", q.from.trim());
  if (q.to?.trim()) p.set("to", q.to.trim());
  if (q.status?.trim()) p.set("status", q.status.trim());
  if (q.fulfillment?.trim()) p.set("fulfillment", q.fulfillment.trim());
  if (q.inflowCode?.trim()) p.set("inflowCode", q.inflowCode.trim());
  if (q.preview === "1") p.set("preview", "1");
  return `/admin/orders/export?${p.toString()}`;
}

function parseExportFilter(sp: {
  from?: string;
  to?: string;
  status?: string;
  fulfillment?: string;
  inflowCode?: string;
}): OrdersExportFilter {
  const st = sp.status?.trim();
  const exportStatus: OrdersExportFilter["status"] =
    st === "PAID" || st === "PENDING" || st === "CANCELLED_REFUNDED" ? st : "ALL";

  let fulfillment: OrdersExportFilter["fulfillment"] = "ALL";
  if (exportStatus === "PAID") {
    const ful = sp.fulfillment?.trim();
    if (ful === "AWAITING_SHIP" || ful === "IN_TRANSIT" || ful === "DELIVERED") {
      fulfillment = ful;
    }
  }

  return {
    from: sp.from?.trim() || undefined,
    to: sp.to?.trim() || undefined,
    status: exportStatus,
    fulfillment,
    inflowCode: sp.inflowCode?.trim() || undefined,
  };
}

type PageProps = {
  searchParams: Promise<{
    tab?: string;
    from?: string;
    to?: string;
    status?: string;
    fulfillment?: string;
    inflowCode?: string;
    preview?: string;
  }>;
};

export default async function AdminOrdersExportPage({ searchParams }: PageProps) {
  const q = await searchParams;
  const { from, to, status, fulfillment, inflowCode, preview } = q;
  const tab = q.tab === "promo" ? "promo" : "general";
  const scope = tab === "promo" ? ("promo" as const) : ("general" as const);
  const showPreview = preview === "1";

  let inflowCodes: string[] = [];
  let appliedPromoCodes: string[] = [];
  let dbOk = true;
  try {
    [inflowCodes, appliedPromoCodes] = await Promise.all([
      listDistinctInflowCodesFromOrders(),
      listDistinctAppliedPromoCodesFromOrders(),
    ]);
  } catch {
    dbOk = false;
  }

  const filter = parseExportFilter({ from, to, status, fulfillment, inflowCode });

  let previewOrders: Awaited<ReturnType<typeof getOrdersForExport>> = [];
  if (showPreview && dbOk) {
    try {
      previewOrders = await getOrdersForExport({ ...filter, scope });
    } catch {
      previewOrders = [];
    }
  }

  const excelHref = dbOk
    ? buildAdminOrdersExportApiHref({
        status: filter.status === "ALL" ? undefined : filter.status,
        fulfillment: filter.status === "PAID" ? filter.fulfillment : undefined,
        from: filter.from,
        to: filter.to,
        inflowCode: filter.inflowCode ?? undefined,
        scope,
      })
    : "";

  const statusDefault = status?.trim() || "PAID";
  const fulfillmentDefault =
    statusDefault === "PAID"
      ? fulfillment?.trim() && ["AWAITING_SHIP", "IN_TRANSIT", "DELIVERED"].includes(fulfillment.trim())
        ? fulfillment.trim()
        : "ALL"
      : "ALL";

  const codeList = tab === "promo" ? appliedPromoCodes : inflowCodes;
  const datalistId = tab === "promo" ? "admin-export-applied-promo-codes" : "admin-export-inflow-codes";

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-stone-900">주문 엑셀 다운로드</h1>
          <p className="mt-1 max-w-2xl text-sm text-stone-500">
            <strong className="font-medium text-stone-700">일반</strong>은 공구 할인이 적용되지 않은 주문만,{" "}
            <strong className="font-medium text-stone-700">공구</strong>는 캠페인 할인이 적용된 주문만 엑셀로 내려갑니다. 조건을 맞춘 뒤{" "}
            <strong className="font-medium text-stone-700">조회</strong>로 미리 확인하세요. 기간·결제만 빠르게 맞추려면{" "}
            <Link href="/admin/orders" className="font-medium text-[#8b673f] underline-offset-2 hover:underline">
              주문 목록
            </Link>
            에서 받는 엑셀은 여전히 <span className="font-medium text-stone-700">해당 목록 조건 전체</span>(일반·공구 구분 없음)입니다. 배송 구간은{" "}
            <strong className="font-medium text-stone-700">결제완료</strong>일 때만 적용됩니다.
          </p>
        </div>
        <Link
          href="/admin/orders"
          className="shrink-0 rounded-full border border-stone-200 bg-white px-4 py-2 text-sm font-medium text-stone-700 hover:bg-stone-50"
        >
          ← 주문 목록
        </Link>
      </div>

      <div className="flex flex-wrap gap-2 border-b border-stone-200 pb-px">
        <Link
          href={buildExportTabHref("general", q)}
          className={`rounded-t-xl px-4 py-2.5 text-sm font-semibold transition ${
            tab === "general"
              ? "border border-b-0 border-stone-200 bg-white text-stone-900"
              : "border border-transparent text-stone-500 hover:text-stone-800"
          }`}
        >
          일반 주문 엑셀
        </Link>
        <Link
          href={buildExportTabHref("promo", q)}
          className={`rounded-t-xl px-4 py-2.5 text-sm font-semibold transition ${
            tab === "promo"
              ? "border border-b-0 border-stone-200 bg-white text-stone-900"
              : "border border-transparent text-stone-500 hover:text-stone-800"
          }`}
        >
          공구 주문 엑셀
        </Link>
      </div>

      {!dbOk ? <AdminDbUnavailableNotice /> : null}

      <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-stone-900">조건 설정</h2>
        <p className="mt-1 text-xs text-stone-500">
          {tab === "promo" ? (
            <>
              공구 할인이 적용된 주문만 대상입니다. 기간을 비우면 전체 기간입니다. 먼저 조회로 건수·내용을 확인한 다음 엑셀을 받으세요.
            </>
          ) : (
            <>
              공구 캠페인 할인이 붙지 않은 주문만 대상입니다. 기간을 비우면 전체 기간입니다. 먼저 조회로 건수·내용을 확인한 다음 엑셀을 받으세요.
            </>
          )}
        </p>

        <form method="get" action="/admin/orders/export" className="mt-6 space-y-5">
          <input type="hidden" name="tab" value={tab} />
          <input type="hidden" name="preview" value="1" />
          <input type="hidden" name="scope" value={scope} />

          <div className="flex flex-wrap items-end gap-3">
            <label className="flex min-w-[10.5rem] flex-col gap-1 text-xs font-medium text-stone-600">
              시작일
              <input
                type="date"
                name="from"
                defaultValue={from ?? ""}
                className="rounded-xl border border-stone-200 bg-white px-3 py-2 text-sm text-stone-900 outline-none focus:border-[#b89156]/50"
              />
            </label>
            <label className="flex min-w-[10.5rem] flex-col gap-1 text-xs font-medium text-stone-600">
              종료일
              <input
                type="date"
                name="to"
                defaultValue={to ?? ""}
                className="rounded-xl border border-stone-200 bg-white px-3 py-2 text-sm text-stone-900 outline-none focus:border-[#b89156]/50"
              />
            </label>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="flex flex-col gap-1 text-xs font-medium text-stone-600">
              결제 상태
              <select
                name="status"
                defaultValue={statusDefault}
                className="rounded-xl border border-stone-200 bg-white px-3 py-2 text-sm text-stone-900 outline-none focus:border-[#b89156]/50"
              >
                <option value="PAID">결제완료</option>
                <option value="PENDING">결제대기</option>
                <option value="CANCELLED_REFUNDED">취소·환불</option>
                <option value="ALL">전체</option>
              </select>
            </label>
            <label className="flex flex-col gap-1 text-xs font-medium text-stone-600">
              배송 단계 (결제완료만)
              <select
                name="fulfillment"
                defaultValue={fulfillmentDefault}
                className="rounded-xl border border-stone-200 bg-white px-3 py-2 text-sm text-stone-900 outline-none focus:border-[#b89156]/50"
              >
                <option value="ALL">배송 전체 (결제완료 기준)</option>
                <option value="AWAITING_SHIP">배송 전</option>
                <option value="IN_TRANSIT">배송중</option>
                <option value="DELIVERED">배송완료</option>
              </select>
            </label>
          </div>

          <label className="flex max-w-md flex-col gap-1 text-xs font-medium text-stone-600">
            {tab === "promo" ? (
              <>필터 코드 (레퍼럴·적용 공구·쿠폰 중 하나라도 일치 — 공구 주문만 범위 안에서 좁힘)</>
            ) : (
              <>유입 코드 (ref / 공구 적용 / 쿠폰 중 일치 — 일반 주문만 범위 안에서 좁힘)</>
            )}
            <input
              name="inflowCode"
              list={datalistId}
              defaultValue={inflowCode ?? ""}
              placeholder="선택 입력 또는 아래 목록에서 고르기"
              autoComplete="off"
              className="rounded-xl border border-stone-200 bg-white px-3 py-2 font-mono text-sm text-stone-900 outline-none focus:border-[#b89156]/50"
            />
            <datalist id={datalistId}>
              {codeList.map((code) => (
                <option key={code} value={code} />
              ))}
            </datalist>
          </label>

          <div className="flex flex-wrap gap-3 pt-2">
            <button
              type="submit"
              className="rounded-full bg-stone-900 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-stone-800"
            >
              조회
            </button>
            <button
              type="submit"
              formAction="/api/admin/orders/export"
              formTarget="_blank"
              formNoValidate
              disabled={!dbOk || !excelHref}
              className="rounded-full bg-[#8b673f] px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#755530] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {tab === "promo" ? "이 조건으로 공구 엑셀 받기" : "이 조건으로 일반 엑셀 받기"}
            </button>
          </div>
        </form>
      </div>

      {showPreview && dbOk ? (
        <div className="space-y-3">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <h2 className="text-lg font-semibold text-stone-900">미리보기</h2>
            <p className="text-sm text-stone-600">
              <strong className="text-stone-900">{previewOrders.length}건</strong> — 엑셀에도 동일한 주문이 들어갑니다.
            </p>
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
                    <th className="px-4 py-3 font-medium">배송단계</th>
                    <th className="px-4 py-3 font-medium">레퍼럴·공구</th>
                    <th className="px-4 py-3 text-right font-medium">금액</th>
                  </tr>
                </thead>
                <tbody>
                  {previewOrders.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="px-4 py-12 text-center text-stone-500">
                        조건에 맞는 주문이 없습니다.
                      </td>
                    </tr>
                  ) : (
                    previewOrders.map((order) => (
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
                        <td className="whitespace-nowrap px-4 py-3 text-stone-700">{adminPaymentStatusLabel(order.paymentStatus)}</td>
                        <td className="whitespace-nowrap px-4 py-3 text-stone-700">{adminFulfillmentLabel(order)}</td>
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
          {excelHref ? (
            <p className="text-center text-xs text-stone-500">
              위 내용이 맞으면{" "}
              <strong className="text-stone-700">{tab === "promo" ? "이 조건으로 공구 엑셀 받기" : "이 조건으로 일반 엑셀 받기"}</strong>를 누르세요.
            </p>
          ) : null}
        </div>
      ) : dbOk ? (
        <p className="rounded-2xl border border-dashed border-stone-200 bg-[#faf8f5] px-4 py-8 text-center text-sm text-stone-600">
          조건을 선택한 뒤 <strong className="text-stone-800">조회</strong>를 누르면 이 자리에 목록이 표시됩니다.
        </p>
      ) : null}

      <div className="rounded-2xl border border-stone-200 bg-[#faf8f5] p-6">
        {tab === "promo" ? (
          <>
            <h2 className="text-lg font-semibold text-stone-900">공구 코드별로 바로 받기</h2>
            <p className="mt-1 text-sm text-stone-600">
              결제완료·배송 전체·기간 제한 없이, 해당 공구 코드가 적용된 주문만 내려받습니다. 위 탭에서 조건을 바꾼 뒤에도 이 링크는 동일하게 동작합니다.
            </p>
            {appliedPromoCodes.length === 0 ? (
              <p className="mt-4 text-sm text-stone-500">아직 공구 할인이 적용된 주문이 없습니다.</p>
            ) : (
              <ul className="mt-4 divide-y divide-stone-200 rounded-xl border border-stone-200 bg-white">
                {appliedPromoCodes.map((code) => (
                  <li key={code} className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 text-sm">
                    <code className="font-mono text-stone-800">{code}</code>
                    <a
                      href={`/api/admin/orders/export${exportApiQueryString({
                        status: "PAID",
                        fulfillment: "ALL",
                        inflowCode: code,
                        scope: "promo",
                      })}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="shrink-0 rounded-full border border-stone-300 bg-white px-3 py-1.5 text-xs font-medium text-stone-700 hover:bg-stone-50"
                    >
                      이 공구만 엑셀
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </>
        ) : (
          <>
            <h2 className="text-lg font-semibold text-stone-900">유입 코드별로 바로 받기 (일반 주문만)</h2>
            <p className="mt-1 text-sm text-stone-600">
              결제완료·배송 전체·기간 제한 없이, 해당 코드가 붙었고 공구 할인은 적용되지 않은 주문만 내려받습니다.
            </p>
            {inflowCodes.length === 0 ? (
              <p className="mt-4 text-sm text-stone-500">아직 유입 코드가 붙은 주문이 없습니다.</p>
            ) : (
              <ul className="mt-4 divide-y divide-stone-200 rounded-xl border border-stone-200 bg-white">
                {inflowCodes.map((code) => (
                  <li key={code} className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 text-sm">
                    <code className="font-mono text-stone-800">{code}</code>
                    <a
                      href={`/api/admin/orders/export${exportApiQueryString({
                        status: "PAID",
                        fulfillment: "ALL",
                        inflowCode: code,
                        scope: "general",
                      })}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="shrink-0 rounded-full border border-stone-300 bg-white px-3 py-1.5 text-xs font-medium text-stone-700 hover:bg-stone-50"
                    >
                      이 코드만 엑셀 (일반)
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </div>
    </div>
  );
}
