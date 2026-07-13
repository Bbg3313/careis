"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState, useTransition } from "react";

import { registerShipmentsAction } from "@/app/admin/(protected)/orders/actions";
import { SWEET_TRACKER_CARRIER_OPTIONS } from "@/lib/sweet-tracker-carriers";
import { formatCurrency } from "@/lib/utils";

export type AdminOrdersShipmentRow = {
  id: string;
  orderNumber: string;
  createdAtLabel: string;
  productSummary: string;
  customerName: string;
  phoneDisplay: string;
  progressLabel: string;
  inflow: string;
  totalAmount: number;
  canRegisterShipment: boolean;
  trackingCarrierCode: string;
  trackingNumber: string;
};

type RowDraft = {
  selected: boolean;
  trackingCarrierCode: string;
  trackingNumber: string;
};

type Props = {
  orders: AdminOrdersShipmentRow[];
  emptyMessage: string;
};

export function AdminOrdersShipmentTable({ orders, emptyMessage }: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<{ type: "ok" | "error"; text: string } | null>(null);

  const [drafts, setDrafts] = useState<Record<string, RowDraft>>(() => {
    const init: Record<string, RowDraft> = {};
    for (const order of orders) {
      init[order.orderNumber] = {
        selected: false,
        trackingCarrierCode: order.trackingCarrierCode || "04",
        trackingNumber: order.trackingNumber || "",
      };
    }
    return init;
  });

  useEffect(() => {
    setDrafts((prev) => {
      const next: Record<string, RowDraft> = {};
      for (const order of orders) {
        const existing = prev[order.orderNumber];
        if (order.canRegisterShipment && existing) {
          next[order.orderNumber] = {
            selected: existing.selected,
            trackingCarrierCode: existing.trackingCarrierCode || order.trackingCarrierCode || "04",
            trackingNumber: existing.trackingNumber || order.trackingNumber || "",
          };
        } else {
          next[order.orderNumber] = {
            selected: false,
            trackingCarrierCode: order.trackingCarrierCode || "04",
            trackingNumber: order.trackingNumber || "",
          };
        }
      }
      return next;
    });
  }, [orders]);

  const registerable = useMemo(() => orders.filter((o) => o.canRegisterShipment), [orders]);
  const selectedCount = registerable.filter((o) => drafts[o.orderNumber]?.selected).length;

  function updateDraft(orderNumber: string, patch: Partial<RowDraft>) {
    setDrafts((prev) => ({
      ...prev,
      [orderNumber]: { ...prev[orderNumber]!, ...patch },
    }));
  }

  function toggleSelectAll(checked: boolean) {
    setDrafts((prev) => {
      const next = { ...prev };
      for (const order of registerable) {
        next[order.orderNumber] = { ...next[order.orderNumber]!, selected: checked };
      }
      return next;
    });
  }

  function submitShipments() {
    setFeedback(null);
    const items = registerable
      .filter((o) => drafts[o.orderNumber]?.selected)
      .map((o) => ({
        orderNumber: o.orderNumber,
        trackingCarrierCode: drafts[o.orderNumber]!.trackingCarrierCode.trim(),
        trackingNumber: drafts[o.orderNumber]!.trackingNumber.trim(),
      }));

    if (items.length === 0) {
      setFeedback({ type: "error", text: "송장 등록할 주문을 체크해 주세요." });
      return;
    }

    const missing = items.find((i) => !i.trackingCarrierCode || !i.trackingNumber);
    if (missing) {
      setFeedback({
        type: "error",
        text: `${missing.orderNumber}: 택배사와 운송장 번호를 입력해 주세요.`,
      });
      return;
    }

    startTransition(async () => {
      const result = await registerShipmentsAction(items);
      if (!result.ok) {
        setFeedback({ type: "error", text: result.message });
        return;
      }
      setFeedback({
        type: "ok",
        text:
          result.errors.length > 0
            ? `${result.registeredCount}건 등록 완료 · 일부 실패: ${result.errors[0]}`
            : `${result.registeredCount}건 송장 등록 완료 · 배송중으로 변경됨`,
      });
      router.refresh();
    });
  }

  const allSelected = registerable.length > 0 && selectedCount === registerable.length;

  return (
    <div className="space-y-3">
      {registerable.length > 0 ? (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-stone-200 bg-[#faf8f5] px-4 py-3">
          <p className="text-sm text-stone-700">
            배송 전 주문에 택배사·운송장을 입력하고 체크한 뒤{" "}
            <strong className="font-semibold text-stone-900">송장등록완료</strong>를 누르면 배송중으로 바뀝니다.
            {selectedCount > 0 ? (
              <span className="ml-2 text-[#8b673f]">선택 {selectedCount}건</span>
            ) : null}
          </p>
          <button
            type="button"
            disabled={pending || selectedCount === 0}
            onClick={submitShipments}
            className="shrink-0 rounded-full bg-[#8b673f] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#755530] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {pending ? "등록 중…" : "송장등록완료"}
          </button>
        </div>
      ) : null}

      {feedback ? (
        <div
          className={`rounded-xl border px-4 py-3 text-sm ${
            feedback.type === "ok"
              ? "border-emerald-200 bg-emerald-50 text-emerald-950"
              : "border-red-200 bg-red-50 text-red-950"
          }`}
        >
          {feedback.text}
        </div>
      ) : null}

      <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-[#faf8f5] text-xs text-stone-600">
              <tr>
                <th className="w-10 px-3 py-3 font-medium">
                  {registerable.length > 0 ? (
                    <input
                      type="checkbox"
                      checked={allSelected}
                      onChange={(e) => toggleSelectAll(e.target.checked)}
                      aria-label="배송 전 주문 전체 선택"
                      className="h-4 w-4 rounded border-stone-300"
                    />
                  ) : null}
                </th>
                <th className="px-3 py-3 font-medium">주문번호</th>
                <th className="px-3 py-3 font-medium">일시</th>
                <th className="px-3 py-3 font-medium">상품</th>
                <th className="px-3 py-3 font-medium">고객</th>
                <th className="min-w-[7rem] px-3 py-3 font-medium">진행</th>
                <th className="min-w-[9rem] px-3 py-3 font-medium">택배사</th>
                <th className="min-w-[10rem] px-3 py-3 font-medium">운송장</th>
                <th className="px-3 py-3 font-medium">레퍼럴·공구</th>
                <th className="px-3 py-3 font-medium text-right">금액</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={10} className="px-4 py-12 text-center text-stone-500">
                    {emptyMessage}
                  </td>
                </tr>
              ) : (
                orders.map((order) => {
                  const draft = drafts[order.orderNumber];
                  return (
                    <tr key={order.id} className="border-t border-stone-100 align-top">
                      <td className="px-3 py-3">
                        {order.canRegisterShipment ? (
                          <input
                            type="checkbox"
                            checked={Boolean(draft?.selected)}
                            onChange={(e) => updateDraft(order.orderNumber, { selected: e.target.checked })}
                            aria-label={`${order.orderNumber} 선택`}
                            className="mt-1 h-4 w-4 rounded border-stone-300"
                          />
                        ) : (
                          <span className="text-stone-300">—</span>
                        )}
                      </td>
                      <td className="px-3 py-3">
                        <Link
                          href={`/admin/orders/${encodeURIComponent(order.orderNumber)}`}
                          className="font-medium text-[#8b673f] underline-offset-2 hover:underline"
                          prefetch={false}
                        >
                          {order.orderNumber}
                        </Link>
                      </td>
                      <td className="whitespace-nowrap px-3 py-3 text-stone-600">{order.createdAtLabel}</td>
                      <td className="max-w-[160px] px-3 py-3 text-stone-600">
                        <span className="line-clamp-2">{order.productSummary}</span>
                      </td>
                      <td className="px-3 py-3 text-stone-600">
                        <div>{order.customerName}</div>
                        <div className="text-xs text-stone-400">{order.phoneDisplay}</div>
                      </td>
                      <td className="px-3 py-3 text-stone-800">
                        <span className="text-[13px] font-medium leading-snug">{order.progressLabel}</span>
                      </td>
                      <td className="px-3 py-3">
                        {order.canRegisterShipment ? (
                          <select
                            value={draft?.trackingCarrierCode ?? "04"}
                            onChange={(e) =>
                              updateDraft(order.orderNumber, { trackingCarrierCode: e.target.value })
                            }
                            className="w-full min-w-[8.5rem] rounded-lg border border-stone-200 bg-white px-2 py-1.5 text-xs text-stone-900 outline-none focus:border-[#b89156]"
                          >
                            {SWEET_TRACKER_CARRIER_OPTIONS.map((c) => (
                              <option key={c.code} value={c.code}>
                                {c.label}
                              </option>
                            ))}
                          </select>
                        ) : order.trackingNumber ? (
                          <span className="text-xs text-stone-600">
                            {SWEET_TRACKER_CARRIER_OPTIONS.find((c) => c.code === order.trackingCarrierCode)
                              ?.label ||
                              order.trackingCarrierCode ||
                              "—"}
                          </span>
                        ) : (
                          <span className="text-xs text-stone-400">—</span>
                        )}
                      </td>
                      <td className="px-3 py-3">
                        {order.canRegisterShipment ? (
                          <input
                            type="text"
                            value={draft?.trackingNumber ?? ""}
                            onChange={(e) => updateDraft(order.orderNumber, { trackingNumber: e.target.value })}
                            placeholder="운송장 번호"
                            className="w-full min-w-[9rem] rounded-lg border border-stone-200 bg-white px-2 py-1.5 font-mono text-xs text-stone-900 outline-none focus:border-[#b89156]"
                          />
                        ) : order.trackingNumber ? (
                          <span className="font-mono text-xs text-stone-700">{order.trackingNumber}</span>
                        ) : (
                          <span className="text-xs text-stone-400">—</span>
                        )}
                      </td>
                      <td className="max-w-[140px] px-3 py-3">
                        <div className="truncate font-mono text-xs text-stone-700" title={order.inflow}>
                          {order.inflow}
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-3 py-3 text-right font-medium text-stone-900">
                        {formatCurrency(order.totalAmount)}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
