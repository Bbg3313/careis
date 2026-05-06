"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type PaymentFailHandlerProps = {
  orderNumber: string;
  code: string;
  message: string;
};

export function PaymentFailHandler({ orderNumber, code, message }: PaymentFailHandlerProps) {
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    let aborted = false;

    async function saveFailure() {
      if (!orderNumber) return;

      await fetch("/api/payments/fail", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderNumber,
          code,
          message,
        }),
      });

      if (!aborted) {
        setSaved(true);
      }
    }

    void saveFailure();

    return () => {
      aborted = true;
    };
  }, [code, message, orderNumber]);

  return (
    <section className="rounded-[40px] bg-white p-10 text-center md:p-16">
      <p className="text-xs uppercase tracking-[0.34em] text-stone-500">Payment Failed</p>
      <h1 className="headline-balance mt-4 text-4xl font-semibold text-stone-900 md:text-5xl">
        결제가 완료되지 않았습니다.
      </h1>
      <p className="copy-pretty mt-4 text-sm leading-7 text-stone-600">
        {message}
        {saved ? " 주문 상태에도 실패 정보가 반영되었습니다." : ""}
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link
          href={orderNumber ? `/payment/checkout?orderNumber=${encodeURIComponent(orderNumber)}` : "/"}
          className="btn-luxe-primary rounded-full px-5 py-3 text-sm font-semibold"
        >
          다시 시도하기
        </Link>
        <Link href="/" className="btn-luxe-secondary rounded-full px-5 py-3 text-sm font-semibold">
          홈으로 이동
        </Link>
      </div>
    </section>
  );
}
