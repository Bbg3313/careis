import { OrderStatus } from "@prisma/client";
import Link from "next/link";
import { notFound } from "next/navigation";

import { TossCheckoutButton } from "@/components/toss-checkout-button";
import { BUSINESS_INFO, BUSINESS_ORDER_FALLBACK_NAME } from "@/lib/business-info";
import { getOrderByNumber } from "@/lib/orders";
import { formatKoreanMobileDisplay } from "@/lib/phone-format";
import { getTossClientKey } from "@/lib/toss-payments";
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
  const checkoutUrl = typeof payload.checkoutUrl === "string" ? payload.checkoutUrl : null;
  const successUrl =
    typeof payload.successUrl === "string" ? payload.successUrl : null;
  const failUrl = typeof payload.failUrl === "string" ? payload.failUrl : null;

  const tossClientKey = getTossClientKey() ?? "";
  const tossSecretConfigured = Boolean(
    process.env.TOSS_SECRET_KEY?.trim() || process.env.TOSS_PAYMENTS_SECRET_KEY?.trim(),
  );
  const canUseTossCheckout =
    order.paymentStatus === OrderStatus.PENDING &&
    Boolean(tossClientKey) &&
    Boolean(successUrl && failUrl);
  const orderName =
    order.orderItems.length > 0
      ? order.orderItems
          .map((item) => `${item.productNameSnapshot} ×${item.quantity}`)
          .join(", ")
          .slice(0, 100)
      : BUSINESS_ORDER_FALLBACK_NAME;

  const bizOneLine = [
    `상호 ${BUSINESS_INFO.tradeName}`,
    `대표 ${BUSINESS_INFO.representativeName}`,
    `사업자등록번호 ${BUSINESS_INFO.registrationNumber}`,
    `통신판매 ${BUSINESS_INFO.mailOrderReportNumber}`,
    `주소 ${BUSINESS_INFO.addressDesktop}`,
    `고객센터 ${BUSINESS_INFO.customerServicePhone}`,
  ].join(" · ");

  return (
    <div className="pb-20 pt-4 md:pb-24 md:pt-6">
      <div className="mx-auto max-w-lg rounded-[28px] border border-[rgba(116,88,59,0.12)] bg-white p-6 shadow-[0_18px_50px_rgba(73,53,26,0.06)] md:p-8">
        <div className="border-b border-stone-100 pb-5">
          <h1 className="text-xl font-semibold tracking-[-0.02em] text-stone-900 md:text-2xl">결제</h1>
          <p className="mt-1 text-xs text-stone-500">주문번호 {order.orderNumber}</p>
        </div>

        <dl className="mt-5 space-y-3 text-sm text-stone-600">
          <div className="flex justify-between gap-4">
            <dt>결제 금액</dt>
            <dd className="font-semibold text-stone-900">{formatCurrency(order.totalAmount)}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt>구매자</dt>
            <dd className="text-right text-stone-900">{order.customerName}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt>연락처</dt>
            <dd className="text-right text-stone-900">{formatKoreanMobileDisplay(order.phone)}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt>결제수단</dt>
            <dd className="text-right text-stone-900">{formatPaymentMethod(order.paymentMethod)}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt>배송지</dt>
            <dd className="max-w-[60%] text-right text-stone-900">{order.address}</dd>
          </div>
        </dl>

        {order.orderItems.length ? (
          <ul className="mt-5 space-y-2 border-t border-stone-100 pt-5 text-sm text-stone-700">
            {order.orderItems.map((item) => (
              <li key={`${item.sku}-${item.id}`} className="flex justify-between gap-3">
                <span className="min-w-0 truncate">
                  {item.productNameSnapshot} ×{item.quantity}
                </span>
                <span className="shrink-0 font-medium text-stone-900">
                  {formatCurrency(item.unitPrice * item.quantity)}
                </span>
              </li>
            ))}
          </ul>
        ) : null}

        <div className="mt-6 border-t border-stone-100 pt-6">
          <p className="text-[11px] leading-relaxed text-stone-500 [word-break:keep-all]">{bizOneLine}</p>
          <p className="mt-3 flex flex-wrap gap-x-2 gap-y-1 text-[11px] text-stone-500">
            <Link href="/policy/terms" className="underline underline-offset-2 hover:text-stone-800">
              이용약관
            </Link>
            <span aria-hidden className="text-stone-300">
              ·
            </span>
            <Link href="/policy/privacy" className="underline underline-offset-2 hover:text-stone-800">
              개인정보처리방침
            </Link>
            <span aria-hidden className="text-stone-300">
              ·
            </span>
            <Link href="/policy/shipping" className="underline underline-offset-2 hover:text-stone-800">
              배송·환불
            </Link>
          </p>

          <div className="mt-6">
            {checkoutUrl ? (
              <a
                href={checkoutUrl}
                className="btn-luxe-primary inline-flex w-full items-center justify-center rounded-full px-5 py-3 text-sm font-semibold"
              >
                결제창으로 이동
              </a>
            ) : canUseTossCheckout && successUrl && failUrl ? (
              <div className="space-y-3">
                <TossCheckoutButton
                  clientKey={tossClientKey}
                  orderId={order.orderNumber}
                  orderName={orderName}
                  amount={order.totalAmount}
                  customerName={order.customerName}
                  successUrl={successUrl}
                  failUrl={failUrl}
                />
                {!tossSecretConfigured ? (
                  <p className="text-center text-[11px] leading-5 text-amber-800/90">
                    결제 완료 반영을 위해 서버에 <code className="text-[10px]">TOSS_SECRET_KEY</code>도 설정해주세요.
                  </p>
                ) : null}
              </div>
            ) : (
              <div className="rounded-2xl border border-[rgba(169,125,77,0.2)] bg-[#fcf8f2] px-4 py-3 text-center text-xs leading-6 text-stone-600">
                {!tossClientKey ? (
                  <>
                    결제 연동 키가 없습니다. <code className="text-[10px]">TOSS_CLIENT_KEY</code> 또는{" "}
                    <code className="text-[10px]">NEXT_PUBLIC_TOSS_CLIENT_KEY</code> 설정 후 재배포·재주문해주세요.
                  </>
                ) : !successUrl || !failUrl ? (
                  <>리턴 URL이 없습니다. <code className="text-[10px]">NEXT_PUBLIC_SITE_URL</code> 확인 후 주문을 다시
                    만들어주세요.</>
                ) : (
                  <>이 주문은 결제할 수 없는 상태입니다.</>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
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

function formatPaymentMethod(value: string) {
  switch (value) {
    case "CREDIT_CARD":
      return "신용카드";
    case "NAVER_PAY":
      return "네이버페이";
    case "TOSS_PAY":
      return "토스페이";
    case "KAKAO_PAY":
      return "카카오페이";
    default:
      return value;
  }
}
