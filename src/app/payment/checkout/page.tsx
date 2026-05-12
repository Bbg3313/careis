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
  const paymentChannel = typeof payload.channel === "string" ? payload.channel : order.paymentMethod;
  const paymentProvider = typeof payload.provider === "string" ? payload.provider : order.paymentProvider ?? "PG 연동 예정";
  const successUrl =
    typeof payload.successUrl === "string" ? payload.successUrl : null;
  const failUrl = typeof payload.failUrl === "string" ? payload.failUrl : null;

  const tossClientKey = getTossClientKey() ?? "";
  const tossSecretConfigured = Boolean(
    process.env.TOSS_SECRET_KEY?.trim() || process.env.TOSS_PAYMENTS_SECRET_KEY?.trim(),
  );
  /** 결제창(토스 SDK)은 클라이언트 키 + success/fail URL이면 열 수 있음. 시크릿은 리턴 후 승인에만 필요 */
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

  return (
    <div className="space-y-8 pb-24">
      <section className="rounded-[40px] bg-[linear-gradient(145deg,#fbf3eb_0%,#eef3fa_100%)] p-8 shadow-[0_24px_80px_rgba(73,53,26,0.05)] md:p-12">
        <p className="text-xs uppercase tracking-[0.3em] text-stone-500">Payment Checkout</p>
        <h1 className="headline-balance mt-4 text-4xl font-semibold text-stone-900 md:text-5xl">
          결제 정보를 확인해주세요.
        </h1>
        <p className="copy-pretty mt-4 max-w-3xl text-sm leading-8 text-stone-600 md:text-base">
          주문 정보와 결제수단을 다시 한 번 확인한 뒤 안전한 결제 단계로 이동합니다. 결제 완료 후
          주문번호 기준으로 주문 상태를 확인할 수 있습니다.
        </p>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <article className="rounded-[32px] border border-[rgba(116,88,59,0.12)] bg-white p-8 shadow-[0_18px_60px_rgba(73,53,26,0.05)]">
          <p className="text-sm font-semibold text-stone-900">주문 및 결제 정보</p>
          <div className="mt-6 space-y-4 text-sm text-stone-600">
            <InfoRow label="주문번호" value={order.orderNumber} />
            <InfoRow label="구매자" value={order.customerName} />
            <InfoRow label="연락처" value={formatKoreanMobileDisplay(order.phone)} />
            <InfoRow label="결제수단" value={formatPaymentMethod(order.paymentMethod)} />
            <InfoRow label="결제채널" value={paymentChannel} />
            <InfoRow label="결제상태" value={formatPaymentStatus(order.paymentStatus)} />
            <InfoRow label="총 결제 예정 금액" value={formatCurrency(order.totalAmount)} />
            <InfoRow label="결제대행사" value={paymentProvider} />
            <InfoRow label="배송지" value={order.address} />
          </div>

          <div className="mt-8 rounded-[28px] bg-[#f8f3ec] p-6">
            <p className="text-sm font-semibold text-stone-900">결제 진행 안내</p>
            <ul className="mt-4 space-y-2 text-sm leading-7 text-stone-600">
              <li>- 선택한 결제수단에 따라 안전한 외부 결제창 또는 간편결제 화면으로 이동합니다.</li>
              <li>- 결제 완료 후 주문 상태가 자동 반영되며, 결제 실패 시 다시 주문 단계로 돌아갈 수 있습니다.</li>
              <li>
                - 주문·결제·배송 문의는 고객센터 {BUSINESS_INFO.customerServicePhone} 또는 {BUSINESS_INFO.email}으로
                접수할 수 있습니다.
              </li>
              <li>- 고객센터 운영시간은 평일 10:00~17:00이며, 점심시간은 12:00~13:00, 주말·공휴일은 휴무입니다.</li>
              <li>- 구매 전 이용약관, 개인정보처리방침, 배송/교환/반품 정책을 다시 확인해주세요.</li>
            </ul>
          </div>

          {order.orderItems.length ? (
            <div className="mt-8 rounded-[28px] border border-stone-100 bg-white p-6">
              <p className="text-sm font-semibold text-stone-900">주문 상품</p>
              <div className="mt-4 space-y-3">
                {order.orderItems.map((item) => (
                  <div key={`${item.sku}-${item.id}`} className="flex items-start justify-between gap-4 border-b border-stone-100 pb-3 last:border-b-0 last:pb-0">
                    <div>
                      <p className="text-sm font-medium text-stone-900">{item.productNameSnapshot}</p>
                      <p className="mt-1 text-xs text-stone-500">{item.quantity}개</p>
                    </div>
                    <p className="text-sm font-medium text-stone-900">{formatCurrency(item.unitPrice * item.quantity)}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </article>

        <aside className="space-y-6 rounded-[32px] border border-[rgba(116,88,59,0.12)] bg-white p-8 shadow-[0_18px_60px_rgba(73,53,26,0.05)]">
          <div>
            <p className="text-sm font-semibold text-stone-900">결제 전 최종 확인</p>
            <p className="mt-2 text-xs leading-6 text-stone-500">사업자 정보와 구매 조건은 아래 정책 페이지에서 다시 확인할 수 있습니다.</p>
          </div>

          <div className="rounded-[24px] bg-[#f8f3ec] p-6 text-sm leading-7 text-stone-600">
            <p>
              상호: {BUSINESS_INFO.tradeName}
              <br />
              대표자: {BUSINESS_INFO.representativeName}
              <br />
              사업자등록번호: {BUSINESS_INFO.registrationNumber}
              <br />
              사업장 주소: {BUSINESS_INFO.addressDesktop}
              <br />
              고객센터(상점 전화): {BUSINESS_INFO.customerServicePhone}
              <br />
              통신판매업 신고번호: {BUSINESS_INFO.mailOrderReportNumber}
            </p>
          </div>

          <div className="grid gap-3">
            {checkoutUrl ? (
              <a
                href={checkoutUrl}
                className="btn-luxe-primary inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold"
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
                  <p className="rounded-[16px] border border-amber-200/80 bg-amber-50/90 px-4 py-3 text-xs leading-6 text-amber-950">
                    <strong className="font-semibold">운영 참고:</strong> 결제창은 열리지만, 결제 완료 후 자동
                    승인을 하려면 배포 환경에 <code className="text-[11px]">TOSS_SECRET_KEY</code>(또는{" "}
                    <code className="text-[11px]">TOSS_PAYMENTS_SECRET_KEY</code>) 테스트 시크릿 키도 반드시
                    설정해주세요. 토스 개발자센터 &gt; API 키 &gt; 시크릿 키(
                    <code className="text-[11px]">test_sk_</code>)와 클라이언트 키는 같은 결제위젯 연동
                    쌍이어야 합니다.
                  </p>
                ) : null}
              </div>
            ) : (
              <div className="rounded-[24px] border border-[rgba(169,125,77,0.16)] bg-[#fcf8f2] p-5 text-sm leading-7 text-stone-600">
                {!tossClientKey ? (
                  <>
                    토스 결제창을 열려면 배포 환경 변수에{" "}
                    <code className="text-xs">TOSS_CLIENT_KEY</code> 또는{" "}
                    <code className="text-xs">NEXT_PUBLIC_TOSS_CLIENT_KEY</code>(<code className="text-xs">test_ck_</code>
                    …, 동일 값)을 넣은 뒤 <strong className="text-stone-800">재배포</strong>하고{" "}
                    <strong className="text-stone-800">새로 주문</strong>해주세요. Vercel에서는{" "}
                    <code className="text-xs">TOSS_CLIENT_KEY</code>만 추가해도 서버가 키를 읽기 쉽습니다. 성공/실패
                    주소는 주문 시 서버가 자동으로 붙이며, 토스 콘솔 도메인과{" "}
                    <code className="text-xs">NEXT_PUBLIC_SITE_URL</code>·실제 접속 URL이 같아야 합니다.
                  </>
                ) : !successUrl || !failUrl ? (
                  <>
                    이 주문에 결제 리턴 URL이 없습니다. <code className="text-xs">NEXT_PUBLIC_SITE_URL</code>이
                    배포 도메인과 일치하는지 확인한 뒤 주문을 다시 생성해주세요.
                  </>
                ) : (
                  <>결제를 진행할 수 없는 상태입니다. 주문 상태를 확인하거나 고객센터로 문의해주세요.</>
                )}
              </div>
            )}
            <Link href="/policy/terms" className="btn-luxe-secondary inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold">
              이용약관 확인
            </Link>
            <Link href="/policy/privacy" className="btn-luxe-secondary inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold">
              개인정보처리방침 확인
            </Link>
            <Link href="/policy/shipping" className="btn-luxe-secondary inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold">
              배송/교환/반품 확인
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

function formatPaymentStatus(value: string) {
  switch (value) {
    case "PAID":
      return "결제 완료";
    case "CANCELLED":
      return "결제 취소";
    case "REFUNDED":
      return "환불 완료";
    case "PENDING":
      return "결제 대기";
    default:
      return value;
  }
}
