import Link from "next/link";
import { notFound } from "next/navigation";

import { getOrderByNumber } from "@/lib/orders";
import { formatCurrency } from "@/lib/utils";

export default async function PaymentCheckoutPage({
  searchParams,
}: {
  searchParams: Promise<{ orderNumber?: string }>;
}) {
  const params = await searchParams;
  const orderNumber = params.orderNumber ?? "";
  const order = orderNumber ? await getOrderByNumber(orderNumber) : null;

  if (!order) {
    notFound();
  }

  const payload = safeParsePayload(order.paymentPayload);

  return (
    <div className="space-y-8 pb-24">
      <section className="rounded-[40px] bg-[linear-gradient(145deg,#fbf3eb_0%,#eef3fa_100%)] p-8 shadow-[0_24px_80px_rgba(73,53,26,0.05)] md:p-12">
        <p className="text-xs uppercase tracking-[0.3em] text-stone-500">Payment Checkout</p>
        <h1 className="headline-balance mt-4 text-4xl font-semibold text-stone-900 md:text-5xl">
          결제 연동 준비가 완료되었습니다.
        </h1>
        <p className="copy-pretty mt-4 max-w-3xl text-sm leading-8 text-stone-600 md:text-base">
          결제 전 주문 정보와 결제 수단을 한 번 더 확인하는 페이지입니다. 실제 결제창이 연결되면 이
          화면 다음 단계에서 바로 결제를 진행할 수 있습니다.
        </p>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <article className="rounded-[32px] border border-[rgba(116,88,59,0.12)] bg-white p-8 shadow-[0_18px_60px_rgba(73,53,26,0.05)]">
          <p className="text-sm font-semibold text-stone-900">주문 및 결제 요청 정보</p>
          <div className="mt-6 space-y-4 text-sm text-stone-600">
            <InfoRow label="주문번호" value={order.orderNumber} />
            <InfoRow label="구매자" value={order.customerName} />
            <InfoRow label="연락처" value={order.phone} />
            <InfoRow label="결제수단" value={order.paymentMethod} />
            <InfoRow label="결제상태" value={order.paymentStatus} />
            <InfoRow label="총 결제 예정 금액" value={formatCurrency(order.totalAmount)} />
            <InfoRow label="PG Provider" value={order.paymentProvider ?? "EXTERNAL_PG"} />
          </div>

          <div className="mt-8 rounded-[28px] bg-[#f8f3ec] p-6">
            <p className="text-sm font-semibold text-stone-900">결제 진행 안내</p>
            <ul className="mt-4 space-y-2 text-sm leading-7 text-stone-600">
              <li>- 이 페이지 다음 단계에서 실제 결제창이 열립니다.</li>
              <li>- 결제가 완료되면 주문 상태가 자동으로 반영됩니다.</li>
              <li>- 실패 또는 취소 시에는 다시 이전 단계로 돌아갈 수 있습니다.</li>
              <li>- 결제와 관련된 상세 정보는 주문번호 기준으로 확인할 수 있습니다.</li>
            </ul>
          </div>
        </article>

        <aside className="space-y-6 rounded-[32px] border border-[rgba(116,88,59,0.12)] bg-white p-8 shadow-[0_18px_60px_rgba(73,53,26,0.05)]">
          <div>
            <p className="text-sm font-semibold text-stone-900">결제 요청 정보</p>
            <p className="mt-2 text-xs leading-6 text-stone-500">
              결제창에 전달될 주요 정보를 아래에서 미리 확인할 수 있습니다.
            </p>
          </div>

          <pre className="overflow-x-auto rounded-[24px] bg-stone-950 p-5 text-xs leading-6 text-stone-100">
            {JSON.stringify(payload, null, 2)}
          </pre>

          <div className="grid gap-3">
            <Link
              href={`/payment/return?orderNumber=${encodeURIComponent(order.orderNumber)}&amount=${order.totalAmount}&paymentMethod=${order.paymentMethod}&provider=${encodeURIComponent(order.paymentProvider ?? "EXTERNAL_PG")}&reference=${encodeURIComponent(`mock-${order.orderNumber}`)}`}
              className="btn-luxe-primary inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold"
            >
              테스트 승인 처리
            </Link>
            <Link
              href={`/payment/fail?orderNumber=${encodeURIComponent(order.orderNumber)}&code=USER_CANCEL&message=${encodeURIComponent("사용자가 결제를 취소했습니다.")}`}
              className="btn-luxe-secondary inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold"
            >
              테스트 실패 처리
            </Link>
          </div>
        </aside>
      </section>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-stone-100 pb-4 last:border-b-0">
      <span>{label}</span>
      <strong className="text-right text-stone-900">{value}</strong>
    </div>
  );
}

function safeParsePayload(value: string | null) {
  if (!value) return {};

  try {
    return JSON.parse(value) as Record<string, unknown>;
  } catch {
    return { raw: value };
  }
}
