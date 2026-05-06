"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import type { ProductContent } from "@/lib/product-data";
import { paymentMethods } from "@/lib/product-data";
import { formatCurrency } from "@/lib/utils";

type OrderFormProps = {
  product: ProductContent;
  referralCode: string | null;
  initialQuantity?: number;
};

export function OrderForm({ product, referralCode, initialQuantity = 1 }: OrderFormProps) {
  const router = useRouter();
  const [quantity, setQuantity] = useState(initialQuantity);
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [address, setAddress] = useState("");
  const [memo, setMemo] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<(typeof paymentMethods)[number]["value"]>(
    "CREDIT_CARD",
  );
  const [resolvedReferralCode, setResolvedReferralCode] = useState(referralCode);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const totalAmount = useMemo(() => product.price * quantity, [product.price, quantity]);

  useEffect(() => {
    if (referralCode) {
      setResolvedReferralCode(referralCode);
      return;
    }

    const cookieReferral = document.cookie
      .split("; ")
      .find((item) => item.startsWith("careis_referral_code="))
      ?.split("=")[1];
    const storedReferral = window.localStorage.getItem("careis_referral_code");

    setResolvedReferralCode(cookieReferral ?? storedReferral ?? null);
  }, [referralCode]);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setErrorMessage(null);

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productSlug: product.slug,
          quantity,
          customerName,
          phone,
          postalCode,
          address,
          memo,
          couponCode,
          paymentMethod,
          referralCode: resolvedReferralCode,
        }),
      });

      const data = (await response.json()) as { orderNumber?: string; error?: string };

      if (!response.ok || !data.orderNumber) {
        throw new Error(data.error ?? "주문 저장 중 문제가 발생했습니다.");
      }

      router.push(`/order/complete?orderNumber=${data.orderNumber}`);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "주문 처리에 실패했습니다.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
      <section className="space-y-6 rounded-[32px] border border-[rgba(116,88,59,0.12)] bg-white p-8">
        <div>
          <p className="text-sm font-semibold text-stone-900">주문자 정보</p>
          <p className="mt-2 text-sm text-stone-500">
            PG 연동 전 단계에서도 결제수단 선택과 주문 상태를 구조적으로 저장합니다.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="space-y-2 text-sm text-stone-700">
            <span>이름</span>
            <input
              required
              value={customerName}
              onChange={(event) => setCustomerName(event.target.value)}
              className="w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 outline-none"
            />
          </label>
          <label className="space-y-2 text-sm text-stone-700">
            <span>연락처</span>
            <input
              required
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              className="w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 outline-none"
            />
          </label>
        </div>

        <div className="grid gap-4 md:grid-cols-[180px_1fr]">
          <label className="space-y-2 text-sm text-stone-700">
            <span>우편번호</span>
            <input
              required
              value={postalCode}
              onChange={(event) => setPostalCode(event.target.value)}
              className="w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 outline-none"
            />
          </label>
          <label className="space-y-2 text-sm text-stone-700">
            <span>주소</span>
            <input
              required
              value={address}
              onChange={(event) => setAddress(event.target.value)}
              className="w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 outline-none"
            />
          </label>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="space-y-2 text-sm text-stone-700">
            <span>수량</span>
            <input
              type="number"
              min={1}
              max={10}
              value={quantity}
              onChange={(event) => setQuantity(Number(event.target.value))}
              className="w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 outline-none"
            />
          </label>
          <label className="space-y-2 text-sm text-stone-700">
            <span>쿠폰코드</span>
            <input
              value={couponCode}
              onChange={(event) => setCouponCode(event.target.value)}
              className="w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 outline-none"
            />
          </label>
        </div>

        <label className="space-y-2 text-sm text-stone-700">
          <span>배송 메모</span>
          <textarea
            value={memo}
            onChange={(event) => setMemo(event.target.value)}
            rows={4}
            className="w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 outline-none"
          />
        </label>

        <div className="space-y-3">
          <p className="text-sm font-medium text-stone-900">결제수단</p>
          <div className="grid gap-3 sm:grid-cols-2">
            {paymentMethods.map((method) => (
              <label
                key={method.value}
                className={`rounded-2xl border px-4 py-4 text-sm transition ${
                  paymentMethod === method.value
                    ? "border-[#a97d4d] bg-[linear-gradient(135deg,#b89156_0%,#9d7442_100%)] text-white shadow-[0_14px_30px_rgba(145,104,52,0.2)]"
                    : "border-stone-200 bg-stone-50 text-stone-700"
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value={method.value}
                  checked={paymentMethod === method.value}
                  onChange={() => setPaymentMethod(method.value)}
                  className="sr-only"
                />
                {method.label}
              </label>
            ))}
          </div>
          <p className="text-xs leading-6 text-stone-500">
            네이버페이, 신용카드, 토스페이, 카카오페이 선택 구조를 먼저 구현했습니다. 실제
            PG 연결 이후에는 선택한 결제수단에 맞는 결제창 및 콜백 처리만 추가하면 됩니다.
          </p>
        </div>
      </section>

      <aside className="space-y-6 rounded-[32px] border border-[rgba(116,88,59,0.12)] bg-[#f8f3ec] p-8">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.28em] text-stone-500">{product.englishName}</p>
          <h2 className="text-2xl font-semibold text-stone-900">{product.name}</h2>
          <p className="text-sm leading-6 text-stone-600">{product.tagline}</p>
        </div>

        <div className="rounded-[28px] bg-white p-6">
          <div className="flex items-center justify-between border-b border-stone-100 pb-4 text-sm text-stone-600">
            <span>상품 금액</span>
            <span>{formatCurrency(product.price)}</span>
          </div>
          <div className="flex items-center justify-between border-b border-stone-100 py-4 text-sm text-stone-600">
            <span>수량</span>
            <span>{quantity}개</span>
          </div>
          <div className="flex items-center justify-between pt-4 text-base font-semibold text-stone-900">
            <span>총 결제 예정 금액</span>
            <span>{formatCurrency(totalAmount)}</span>
          </div>
        </div>

        <div className="space-y-2 rounded-[28px] bg-white p-6 text-sm text-stone-600">
          <div className="flex items-center justify-between">
            <span>레퍼럴 코드</span>
            <strong className="text-stone-900">{resolvedReferralCode ?? "직접 유입"}</strong>
          </div>
          <div className="flex items-center justify-between">
            <span>결제 상태</span>
            <strong className="text-amber-700">PENDING 저장 후 PG 연동 대기</strong>
          </div>
        </div>

        {errorMessage ? <p className="text-sm text-red-600">{errorMessage}</p> : null}

        <button
          type="submit"
          disabled={submitting}
          className="btn-luxe-primary w-full rounded-full px-6 py-4 text-sm font-semibold disabled:opacity-60"
        >
          {submitting ? "주문 저장 중..." : "주문 저장하기"}
        </button>
      </aside>
    </form>
  );
}
