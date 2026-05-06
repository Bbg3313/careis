"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type PaymentReturnHandlerProps = {
  orderNumber: string;
  amount: number;
  paymentMethod: string;
  provider: string;
  reference: string | null;
  token: string | null;
};

export function PaymentReturnHandler({
  orderNumber,
  amount,
  paymentMethod,
  provider,
  reference,
  token,
}: PaymentReturnHandlerProps) {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let aborted = false;

    async function confirm() {
      try {
        const response = await fetch("/api/payments/confirm", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            orderNumber,
            amount,
            paymentMethod,
            provider,
            reference,
            token,
          }),
        });

        const data = (await response.json()) as { ok?: boolean; error?: string };

        if (!response.ok || !data.ok) {
          throw new Error(data.error ?? "결제 승인 처리에 실패했습니다.");
        }

        if (!aborted) {
          router.replace(`/order/complete?orderNumber=${encodeURIComponent(orderNumber)}&paymentStatus=PAID`);
        }
      } catch (error) {
        if (!aborted) {
          setErrorMessage(error instanceof Error ? error.message : "결제 승인 처리에 실패했습니다.");
        }
      }
    }

    void confirm();

    return () => {
      aborted = true;
    };
  }, [amount, orderNumber, paymentMethod, provider, reference, router, token]);

  if (errorMessage) {
    return (
      <section className="rounded-[40px] bg-white p-10 text-center md:p-16">
        <p className="text-xs uppercase tracking-[0.34em] text-stone-500">Payment Return</p>
        <h1 className="headline-balance mt-4 text-4xl font-semibold text-stone-900 md:text-5xl">
          결제 승인 처리에 실패했습니다.
        </h1>
        <p className="copy-pretty mt-4 text-sm leading-7 text-stone-600">{errorMessage}</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/" className="btn-luxe-secondary rounded-full px-5 py-3 text-sm font-semibold">
            홈으로 이동
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="rounded-[40px] bg-white p-10 text-center md:p-16">
      <p className="text-xs uppercase tracking-[0.34em] text-stone-500">Payment Return</p>
      <h1 className="headline-balance mt-4 text-4xl font-semibold text-stone-900 md:text-5xl">
        결제 승인 결과를 확인하고 있습니다.
      </h1>
      <p className="copy-pretty mt-4 text-sm leading-7 text-stone-600">
        PG 인증 결과를 주문 데이터에 반영한 뒤 완료 페이지로 이동합니다.
      </p>
    </section>
  );
}
