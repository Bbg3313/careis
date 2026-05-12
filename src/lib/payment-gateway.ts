import type { PaymentMethod } from "@prisma/client";

type GatewayChannel = "CARD" | "NAVER_PAY" | "TOSS_PAY" | "KAKAO_PAY";

type PaymentSessionInput = {
  orderNumber: string;
  amount: number;
  customerName: string;
  phone: string;
  paymentMethod: PaymentMethod;
  referralCode?: string | null;
  couponCode?: string | null;
  requestOrigin: string;
};

export type PaymentSession = {
  provider: string;
  channel: GatewayChannel;
  orderNumber: string;
  amount: number;
  customerName: string;
  phone: string;
  successUrl: string;
  failUrl: string;
  webhookUrl: string;
  metadata: {
    referralCode: string | null;
    couponCode: string | null;
  };
};

const channelMap: Record<PaymentMethod, GatewayChannel> = {
  CREDIT_CARD: "CARD",
  NAVER_PAY: "NAVER_PAY",
  TOSS_PAY: "TOSS_PAY",
  KAKAO_PAY: "KAKAO_PAY",
};

export function getRequestOrigin(request: Request) {
  const forwardedProto = request.headers.get("x-forwarded-proto");
  const forwardedHost = request.headers.get("x-forwarded-host");
  const host = forwardedHost ?? request.headers.get("host");

  if (host) {
    const proto =
      forwardedProto ??
      (/^(localhost|127\.0\.0\.1)(:|$)/i.test(host) ? "http" : "https");
    return `${proto}://${host}`;
  }

  return process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
}

function resolvePaymentProvider(): string {
  if (process.env.PG_PROVIDER?.trim()) {
    return process.env.PG_PROVIDER.trim();
  }
  /** 클라이언트 키만 있어도 결제창(위젯) 연동 대상으로 본다. 시크릿은 승인 API에만 필요 */
  if (process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY?.trim()) {
    return "TOSS_PAYMENTS";
  }
  return "EXTERNAL_PG";
}

export function buildPaymentSession(input: PaymentSessionInput): PaymentSession {
  const provider = resolvePaymentProvider();
  const successUrl = `${input.requestOrigin}/payment/return?orderNumber=${encodeURIComponent(input.orderNumber)}`;
  const failUrl = `${input.requestOrigin}/payment/fail?orderNumber=${encodeURIComponent(input.orderNumber)}`;
  const webhookUrl = `${input.requestOrigin}/api/payments/webhook`;

  return {
    provider,
    channel: channelMap[input.paymentMethod],
    orderNumber: input.orderNumber,
    amount: input.amount,
    customerName: input.customerName,
    phone: input.phone,
    successUrl,
    failUrl,
    webhookUrl,
    metadata: {
      referralCode: input.referralCode ?? null,
      couponCode: input.couponCode ?? null,
    },
  };
}
