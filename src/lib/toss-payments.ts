const TOSS_CONFIRM_URL = "https://api.tosspayments.com/v1/payments/confirm";

/** 서버 전용 시크릿 키 (test_sk_… / live_sk_…) */
export function getTossSecretKey(): string | null {
  return process.env.TOSS_SECRET_KEY?.trim() || process.env.TOSS_PAYMENTS_SECRET_KEY?.trim() || null;
}

export function getTossClientKey(): string | null {
  return process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY?.trim() || null;
}

export function isTossPaymentsConfigured(): boolean {
  return Boolean(getTossSecretKey() && getTossClientKey());
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

  const authorization = `Basic ${Buffer.from(`${secret}:`).toString("base64")}`;
  const response = await fetch(TOSS_CONFIRM_URL, {
    method: "POST",
    headers: {
      Authorization: authorization,
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
