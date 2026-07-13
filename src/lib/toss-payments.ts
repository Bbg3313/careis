const TOSS_CONFIRM_URL = "https://api.tosspayments.com/v1/payments/confirm";
const TOSS_API_BASE = "https://api.tosspayments.com";

/** 서버 전용 시크릿 키 (test_sk_… / live_sk_…) */
export function getTossSecretKey(): string | null {
  return process.env.TOSS_SECRET_KEY?.trim() || process.env.TOSS_PAYMENTS_SECRET_KEY?.trim() || null;
}

/**
 * 브라우저·서버 공통 클라이언트 키.
 * 본 프로젝트 결제창 SDK(`loadTossPayments`)는 API 개별 연동 키(test_ck_/live_ck_)만 지원합니다. *_gck_ 는 결제위젯용이라 사용할 수 없습니다.
 * Vercel 등에서 NEXT_PUBLIC_가 빌드에 비어 박히는 경우를 피하려면 TOSS_CLIENT_KEY에 동일 값을 넣으면
 * 서버(결제 페이지·prepare)가 런타임에 확실히 읽을 수 있습니다.
 */
export function getTossClientKey(): string | null {
  return (
    process.env.TOSS_CLIENT_KEY?.trim() ||
    process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY?.trim() ||
    null
  );
}

export function isTossPaymentsConfigured(): boolean {
  return Boolean(getTossSecretKey() && getTossClientKey());
}

/**
 * 개발자센터의 웹훅 서명·일부 고보안 API용 보안키(보통 64자리 16진수).
 * 결제 승인 API에는 `TOSS_SECRET_KEY`(시크릿 키)를 쓰고, 본 값은 웹훅 HMAC 검증 등에 사용합니다.
 */
export function getTossWebhookSecurityKey(): string | null {
  return (
    process.env.TOSS_WEBHOOK_SECURITY_KEY?.trim() ||
    process.env.TOSS_SECURITY_KEY?.trim() ||
    null
  );
}

function tossAuthorizationHeader(secret: string) {
  return `Basic ${Buffer.from(`${secret}:`).toString("base64")}`;
}

export type TossConfirmResult = Record<string, unknown>;

/**
 * 결제 인증 성공 후 토스 서버에 최종 승인 요청.
 * @see https://docs.tosspayments.com/reference#%EA%B2%B0%EC%A0%9C-%EC%8A%B9%EC%9D%B8
 */
export async function confirmTossPaymentOnServer(params: {
  paymentKey: string;
  orderId: string;
  amount: number;
}): Promise<TossConfirmResult> {
  const secret = getTossSecretKey();
  if (!secret) {
    throw new Error("TOSS_SECRET_KEY(또는 TOSS_PAYMENTS_SECRET_KEY)가 설정되지 않았습니다.");
  }

  const response = await fetch(TOSS_CONFIRM_URL, {
    method: "POST",
    headers: {
      Authorization: tossAuthorizationHeader(secret),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      paymentKey: params.paymentKey,
      orderId: params.orderId,
      amount: params.amount,
    }),
  });

  const data = (await response.json()) as TossConfirmResult & { message?: string; code?: string };

  if (!response.ok) {
    const msg =
      typeof data.message === "string"
        ? data.message
        : typeof data.code === "string"
          ? data.code
          : "토스 결제 승인에 실패했습니다.";
    throw new Error(msg);
  }

  return data;
}

/**
 * 승인된 결제 전액(또는 부분) 취소.
 * @see https://docs.tosspayments.com/guides/v2/cancel-payment
 */
export async function cancelTossPaymentOnServer(params: {
  paymentKey: string;
  cancelReason: string;
  /** 생략 시 전액 취소 */
  cancelAmount?: number;
  idempotencyKey?: string;
}): Promise<TossConfirmResult> {
  const secret = getTossSecretKey();
  if (!secret) {
    throw new Error("TOSS_SECRET_KEY(또는 TOSS_PAYMENTS_SECRET_KEY)가 설정되지 않았습니다.");
  }

  const reason = params.cancelReason.trim().slice(0, 200);
  if (!reason) {
    throw new Error("결제 취소 사유를 입력해 주세요.");
  }

  const paymentKey = encodeURIComponent(params.paymentKey.trim());
  const headers: Record<string, string> = {
    Authorization: tossAuthorizationHeader(secret),
    "Content-Type": "application/json",
  };
  if (params.idempotencyKey?.trim()) {
    headers["Idempotency-Key"] = params.idempotencyKey.trim().slice(0, 300);
  }

  const body: Record<string, string | number> = { cancelReason: reason };
  if (typeof params.cancelAmount === "number" && Number.isFinite(params.cancelAmount)) {
    body.cancelAmount = params.cancelAmount;
  }

  const response = await fetch(`${TOSS_API_BASE}/v1/payments/${paymentKey}/cancel`, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });

  const data = (await response.json()) as TossConfirmResult & { message?: string; code?: string };

  if (!response.ok) {
    const msg =
      typeof data.message === "string"
        ? data.message
        : typeof data.code === "string"
          ? data.code
          : "토스 결제 취소에 실패했습니다.";
    throw new Error(msg);
  }

  return data;
}
