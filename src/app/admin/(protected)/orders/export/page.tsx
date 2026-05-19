import Link from "next/link";

import { AdminDbUnavailableNotice } from "@/components/admin-db-unavailable";
import { listDistinctInflowCodesFromOrders } from "@/lib/orders";

export const dynamic = "force-dynamic";

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

export default async function AdminOrdersExportPage() {
  let inflowCodes: string[] = [];
  let dbOk = true;
  try {
    inflowCodes = await listDistinctInflowCodesFromOrders();
  } catch {
    dbOk = false;
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-stone-900">주문 엑셀 다운로드</h1>
          <p className="mt-1 max-w-2xl text-sm text-stone-500">
            조건을 선택한 뒤 다운로드합니다. 배송 구간(배송 전·배송중·배송완료)은{" "}
            <strong className="font-medium text-stone-700">결제완료</strong> 주문에만 적용됩니다. ref·공구·쿠폰 코드는
            주문에 저장된 값과 일치하는 건만 포함됩니다.
          </p>
        </div>
        <Link
          href="/admin/orders"
          className="shrink-0 rounded-full border border-stone-200 bg-white px-4 py-2 text-sm font-medium text-stone-700 hover:bg-stone-50"
        >
          ← 주문 목록
        </Link>
      </div>

      {!dbOk ? <AdminDbUnavailableNotice /> : null}

      <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-stone-900">조건 선택 후 받기</h2>
        <p className="mt-1 text-xs text-stone-500">
          기간을 비우면 전체 기간입니다. 대량일 수 있으니 필요할 때만 기간을 지정하는 것을 권장합니다.
        </p>

        <form
          method="get"
          action="/api/admin/orders/export"
          target="_blank"
          className="mt-6 space-y-5"
        >
          <div className="flex flex-wrap items-end gap-3">
            <label className="flex min-w-[10.5rem] flex-col gap-1 text-xs font-medium text-stone-600">
              시작일
              <input
                type="date"
                name="from"
                className="rounded-xl border border-stone-200 bg-white px-3 py-2 text-sm text-stone-900 outline-none focus:border-[#b89156]/50"
              />
            </label>
            <label className="flex min-w-[10.5rem] flex-col gap-1 text-xs font-medium text-stone-600">
              종료일
              <input
                type="date"
                name="to"
                className="rounded-xl border border-stone-200 bg-white px-3 py-2 text-sm text-stone-900 outline-none focus:border-[#b89156]/50"
              />
            </label>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="flex flex-col gap-1 text-xs font-medium text-stone-600">
              결제 상태
              <select
                name="status"
                defaultValue="PAID"
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
                defaultValue="ALL"
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
            유입 코드 (ref / 공구 적용 / 쿠폰 중 일치)
            <input
              name="inflowCode"
              list="admin-export-inflow-codes"
              placeholder="선택 입력 또는 아래 목록에서 고르기"
              autoComplete="off"
              className="rounded-xl border border-stone-200 bg-white px-3 py-2 font-mono text-sm text-stone-900 outline-none focus:border-[#b89156]/50"
            />
            <datalist id="admin-export-inflow-codes">
              {inflowCodes.map((code) => (
                <option key={code} value={code} />
              ))}
            </datalist>
          </label>

          <div className="flex flex-wrap gap-3 pt-2">
            <button
              type="submit"
              className="rounded-full bg-[#8b673f] px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#755530]"
            >
              이 조건으로 엑셀 받기
            </button>
          </div>
        </form>
      </div>

      <div className="rounded-2xl border border-stone-200 bg-[#faf8f5] p-6">
        <h2 className="text-lg font-semibold text-stone-900">유입 코드별로 바로 받기</h2>
        <p className="mt-1 text-sm text-stone-600">
          결제완료·배송 전체·기간 제한 없이, 해당 코드가 붙은 주문만 내려받습니다. 기간을 넣으려면 위 폼을 이용하세요.
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
                  })}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 rounded-full border border-stone-300 bg-white px-3 py-1.5 text-xs font-medium text-stone-700 hover:bg-stone-50"
                >
                  이 코드만 엑셀
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
