import { AdminOrdersDateFilterForm } from "@/components/admin-orders-date-filter-form";
import { AdminOrdersShipmentTable, type AdminOrdersShipmentRow } from "@/components/admin-orders-shipment-table";
import { AdminDbUnavailableNotice } from "@/components/admin-db-unavailable";
import { adminOrderProgressLabel, isPaidOrderAwaitingShipment } from "@/lib/admin-fulfillment";
import { buildAdminOrdersExportApiHref, buildAdminOrdersHref } from "@/lib/admin-orders-date-filter";
import { parseAdminOrdersListSearch } from "@/lib/admin-order-search";
import { inflowSummary } from "@/lib/admin-order-inflow";
import { ADMIN_ORDER_LIST_TAKE, loadAdminOrdersList } from "@/lib/orders";
import { formatKoreanMobileDisplay } from "@/lib/phone-format";
import { formatDate } from "@/lib/utils";
import Link from "next/link";

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams: Promise<{
    status?: string;
    fulfillment?: string;
    queue?: string;
    from?: string;
    to?: string;
    searchBy?: string;
    q?: string;
  }>;
};

function statusLabel(status: string | undefined, queue: string | undefined) {
  if (queue === "cancelRequest") return "환불요청 대기";
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

function fulfillmentChipLabel(fulfillment: string | undefined) {
  switch (fulfillment) {
    case "AWAITING_SHIP":
      return "배송 전만";
    case "IN_TRANSIT":
      return "배송중만";
    case "DELIVERED":
      return "배송완료만";
    default:
      return "";
  }
}

export default async function AdminOrdersPage({ searchParams }: PageProps) {
  const { status, fulfillment, queue: queueRaw, from, to, searchBy, q } = await searchParams;
  const queue = queueRaw === "cancelRequest" ? "cancelRequest" : undefined;
  const loaded = await loadAdminOrdersList({ from, to, status, fulfillment, queue, searchBy, q });

  const orders = loaded.ok ? loaded.orders : [];
  const totalMatching = loaded.ok ? loaded.totalMatching : 0;
  const fulfillmentStats = loaded.ok
    ? loaded.fulfillmentStats
    : { all: 0, awaiting: 0, inTransit: 0, delivered: 0 };
  const cancelRequestCount = loaded.ok ? loaded.cancelRequestCount : 0;
  const listCapped = loaded.ok ? loaded.listCapped : false;

  const parsedSearch = parseAdminOrdersListSearch(searchBy, q);
  const searchHrefOpts = parsedSearch ? { searchBy: parsedSearch.by, q: parsedSearch.needle } : {};

  const fulfillmentEffective = !queue && status === "PAID" ? fulfillment : undefined;

  const clearOrdersHref = queue
    ? buildAdminOrdersHref({ queue: "cancelRequest" })
    : buildAdminOrdersHref({
        status: status || undefined,
        fulfillment: fulfillmentEffective || undefined,
      });

  const tabs = [
    { href: buildAdminOrdersHref({ from, to, ...searchHrefOpts }), label: "전체", key: "" },
    { href: buildAdminOrdersHref({ status: "PAID", from, to, ...searchHrefOpts }), label: "결제완료", key: "PAID" },
    { href: buildAdminOrdersHref({ status: "PENDING", from, to, ...searchHrefOpts }), label: "결제대기", key: "PENDING" },
    {
      href: buildAdminOrdersHref({ status: "CANCELLED_REFUNDED", from, to, ...searchHrefOpts }),
      label: "취소·환불",
      key: "CANCELLED_REFUNDED",
    },
  ] as const;

  const fulfillmentTabs = [
    { href: buildAdminOrdersHref({ status: "PAID", from, to, ...searchHrefOpts }), label: "배송 전체", key: "" },
    {
      href: buildAdminOrdersHref({ status: "PAID", fulfillment: "AWAITING_SHIP", from, to, ...searchHrefOpts }),
      label: "배송 전",
      key: "AWAITING_SHIP",
    },
    {
      href: buildAdminOrdersHref({ status: "PAID", fulfillment: "IN_TRANSIT", from, to, ...searchHrefOpts }),
      label: "배송중",
      key: "IN_TRANSIT",
    },
    {
      href: buildAdminOrdersHref({ status: "PAID", fulfillment: "DELIVERED", from, to, ...searchHrefOpts }),
      label: "배송완료",
      key: "DELIVERED",
    },
  ] as const;

  const chip = fulfillmentChipLabel(fulfillmentEffective);
  const searchNote = parsedSearch ? " · 검색 적용" : "";
  const capNote = listCapped ? ` · 최신 ${ADMIN_ORDER_LIST_TAKE}건만 표시` : "";
  const subtitle =
    queue === "cancelRequest"
      ? `고객 환불·취소 요청 대기 · ${totalMatching}건${searchNote}${capNote}`
      : chip && status === "PAID"
        ? `${statusLabel(status, queue)} · ${chip} · ${totalMatching}건${searchNote}${capNote}`
        : `${statusLabel(status, queue)} · ${totalMatching}건${searchNote}${capNote}`;

  const exportApiHref = loaded.ok
    ? buildAdminOrdersExportApiHref({
        status: status || undefined,
        fulfillment: fulfillmentEffective,
        from,
        to,
      })
    : null;

  const tableRows: AdminOrdersShipmentRow[] = orders.map((order) => ({
    id: order.id,
    orderNumber: order.orderNumber,
    createdAtLabel: formatDate(order.createdAt),
    productSummary: order.orderItems.map((item) => `${item.productNameSnapshot}×${item.quantity}`).join(", "),
    customerName: order.customerName,
    phoneDisplay: formatKoreanMobileDisplay(order.phone),
    progressLabel: adminOrderProgressLabel(order),
    inflow: inflowSummary(order),
    totalAmount: order.totalAmount,
    canRegisterShipment: isPaidOrderAwaitingShipment(order),
    trackingCarrierCode: order.trackingCarrierCode ?? "",
    trackingNumber: order.trackingNumber ?? "",
    cancelRequested: Boolean(order.customerCancelRequestedAt),
    cancelRequestReason: order.customerCancelReason ?? "",
    cancelRequestedAtLabel: order.customerCancelRequestedAt
      ? formatDate(order.customerCancelRequestedAt)
      : "",
  }));

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-stone-900">주문 목록</h1>
          <p className="mt-1 text-sm text-stone-500">{subtitle}</p>
        </div>
        <Link
          href="/admin/orders/export?tab=general"
          className="shrink-0 rounded-full border border-stone-200 bg-white px-4 py-2 text-sm font-medium text-stone-700 hover:bg-stone-50"
          prefetch={false}
        >
          엑셀 <span className="font-normal text-stone-500">유입·직접입력</span>
        </Link>
      </div>

      {!loaded.ok ? <AdminDbUnavailableNotice /> : null}

      {cancelRequestCount > 0 && queue !== "cancelRequest" ? (
        <Link
          href={buildAdminOrdersHref({ queue: "cancelRequest", from, to, ...searchHrefOpts })}
          className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-950 transition hover:bg-amber-100/80"
        >
          <span>
            고객 <strong>환불·취소 요청</strong>이 <strong>{cancelRequestCount}건</strong> 대기 중입니다.
          </span>
          <span className="font-medium text-amber-900 underline-offset-2 hover:underline">대기함 보기 →</span>
        </Link>
      ) : null}

      <AdminOrdersDateFilterForm
        action="/admin/orders"
        status={queue ? undefined : status}
        fulfillment={fulfillmentEffective}
        queue={queue}
        defaultFrom={from}
        defaultTo={to}
        showOrderSearch
        defaultSearchBy={searchBy}
        defaultQ={q}
        clearHref={clearOrdersHref}
      />

      <div className="flex flex-wrap gap-2">
        <Link
          href={buildAdminOrdersHref({ queue: "cancelRequest", from, to, ...searchHrefOpts })}
          className={`inline-flex items-baseline gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition ${
            queue === "cancelRequest"
              ? "bg-amber-800 !text-white hover:!text-white visited:!text-white"
              : "border border-amber-300 bg-amber-50 text-amber-950 hover:bg-amber-100"
          }`}
        >
          <span>환불요청 대기</span>
          <span className={`tabular-nums ${queue === "cancelRequest" ? "text-white/90" : "text-amber-800"}`}>
            {cancelRequestCount}
          </span>
        </Link>
        {tabs.map((tab) => {
          const active = !queue && ((status ?? "") === tab.key || (!status && tab.key === ""));
          return (
            <Link
              key={tab.key}
              href={tab.href}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                active
                  ? "bg-stone-900 !text-white hover:!text-white visited:!text-white"
                  : "border border-stone-200 bg-white text-stone-600 hover:bg-stone-50"
              }`}
            >
              {tab.label}
            </Link>
          );
        })}
      </div>

      {!queue ? (
        <div className="space-y-2">
          <p className="text-[11px] text-stone-500">
            배송 단계는 <span className="font-medium text-stone-700">결제완료</span> 주문만 해당합니다. 아래를 누르면
            결제완료 목록으로 바뀌며 단계별로 좁혀집니다.
          </p>
          <div className="flex flex-wrap gap-2">
            {fulfillmentTabs.map((tab) => {
              const active =
                status === "PAID" &&
                ((fulfillmentEffective ?? "") === tab.key || (!fulfillmentEffective && tab.key === ""));
              const count =
                tab.key === ""
                  ? fulfillmentStats.all
                  : tab.key === "AWAITING_SHIP"
                    ? fulfillmentStats.awaiting
                    : tab.key === "IN_TRANSIT"
                      ? fulfillmentStats.inTransit
                      : fulfillmentStats.delivered;
              return (
                <Link
                  key={tab.key || "all"}
                  href={tab.href}
                  className={`inline-flex items-baseline gap-1 rounded-full px-3 py-1.5 text-xs font-medium transition ${
                    active
                      ? "bg-[#8b673f] !text-white hover:!text-white visited:!text-white"
                      : "border border-stone-200 bg-white text-stone-600 hover:bg-stone-50"
                  }`}
                >
                  <span>{tab.label}</span>
                  <span className={`tabular-nums ${active ? "text-white/90" : "text-stone-500"}`}>{count}건</span>
                </Link>
              );
            })}
          </div>
        </div>
      ) : (
        <p className="rounded-xl border border-amber-200 bg-amber-50/80 px-4 py-3 text-sm text-amber-950">
          고객이 남긴 환불·취소 요청만 모았습니다. 주문번호를 눌러 상세에서 결제 취소를 처리하면 대기함에서
          사라집니다.
        </p>
      )}

      {listCapped ? (
        <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">
          조건에 맞는 주문이 <strong>{totalMatching}건</strong>입니다. 응답 속도를 위해 표에는 최신{" "}
          <strong>{ADMIN_ORDER_LIST_TAKE}건</strong>만 보입니다. 나머지는 기간을 좁히거나 엑셀을 이용해 주세요.
        </p>
      ) : null}

      <AdminOrdersShipmentTable
        orders={tableRows}
        emptyMessage={
          queue === "cancelRequest"
            ? "대기 중인 환불·취소 요청이 없습니다."
            : parsedSearch
              ? "검색 조건과 일치하는 주문이 없습니다."
              : "표시할 주문이 없습니다."
        }
      />

      {loaded.ok && exportApiHref && !queue ? (
        <div className="flex flex-col gap-3 rounded-2xl border border-stone-200 bg-[#faf8f5] px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
          <p className="text-sm leading-relaxed text-stone-700">
            조건 일치 <strong className="text-stone-900">{totalMatching}건</strong>
            {listCapped ? (
              <>
                {" "}
                — 표에는 최신 <strong>{orders.length}건</strong>만 표시됩니다.
              </>
            ) : (
              <> — 아래 표와 동일합니다.</>
            )}{" "}
            엑셀은 기간·결제·배송만 반영됩니다(검색 미적용).
            {parsedSearch ? (
              <span className="mt-1 block text-xs text-stone-500">
                검색어(이름·번호·주문번호)는 엑셀에 적용되지 않습니다.
              </span>
            ) : null}
          </p>
          <a
            href={exportApiHref}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 rounded-full bg-[#8b673f] px-5 py-2.5 text-center text-sm font-semibold text-white shadow-sm transition hover:bg-[#755530]"
          >
            이 조건으로 엑셀 받기
          </a>
        </div>
      ) : null}
    </div>
  );
}
