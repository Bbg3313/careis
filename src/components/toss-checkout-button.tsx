"use client";

import { ANONYMOUS, loadTossPayments } from "@tosspayments/tosspayments-sdk";
import { useCallback, useState } from "react";

type TossCheckoutButtonProps = {
  clientKey: string;
  orderId: string;
  orderName: string;
  amount: number;
  customerName: string;
  successUrl: string;
  failUrl: string;
};

export function TossCheckoutButton({
  clientKey,
  orderId,
  orderName,
  amount,
  customerName,
  successUrl,
  failUrl,
}: TossCheckoutButtonProps) {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const onPay = useCallback(async () => {
    setErrorMessage(null);
    if (!clientKey) {
      setErrorMessage("클라이언트 키가 없습니다. NEXT_PUBLIC_TOSS_CLIENT_KEY를 확인해주세요.");
      return;
    }

    setLoading(true);
    try {
      const tossPayments = await loadTossPayments(clientKey);
      const payment = tossPayments.payment({ customerKey: ANONYMOUS });
      await payment.requestPayment({
        method: "CARD",
        amount: {
          currency: "KRW",
          value: amount,
        },
        orderId,
        orderName,
        successUrl,
        failUrl,
        customerName,
        card: {
          useEscrow: false,
          flowMode: "DEFAULT",
        },
      });
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "결제 요청을 시작하지 못했습니다.");
      setLoading(false);
    }
  }, [amount, clientKey, customerName, failUrl, orderId, orderName, successUrl]);

  return (
    <div className="space-y-3">
      {errorMessage ? (
        <p className="rounded-[16px] border border-red-200 bg-red-50 px-4 py-3 text-sm leading-7 text-red-800">{errorMessage}</p>
      ) : null}
      <button
        type="button"
        onClick={() => void onPay()}
        disabled={loading}
        className="btn-luxe-primary inline-flex w-full items-center justify-center rounded-full px-5 py-3 text-sm font-semibold disabled:opacity-60"
      >
        {loading ? "결제창 여는 중…" : "토스페이먼츠로 결제하기"}
      </button>
      <p className="text-xs leading-6 text-stone-500">
        테스트·라이브 모두 토스 개발자센터에서 발급한 <strong className="font-medium text-stone-700">클라이언트 키</strong>와
        같은 결제위젯 연동 쌍의 시크릿 키를 쓰세요. 배포 URL은 콘솔 &gt; 개발 정보 &gt; 리다이렉트 URL에 등록해야
        결제창이 열립니다.
      </p>
    </div>
  );
}
