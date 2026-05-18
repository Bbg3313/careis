"use client";

import Image from "next/image";
import Link from "next/link";
import Script from "next/script";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { paymentMethods, products, type ProductSlug } from "@/lib/product-data";
import { productVisuals } from "@/lib/site-assets";
import { formatKoreanMobileInput } from "@/lib/phone-format";
import { formatCurrency } from "@/lib/utils";

type OrderFormProps = {
  referralCode: string | null;
  initialItems?: Array<{ productSlug: ProductSlug; quantity: number }>;
};

type SelectedItemState = Record<ProductSlug, { selected: boolean; quantity: number }>;
type AgreementState = {
  terms: boolean;
  privacy: boolean;
  shipping: boolean;
  paymentDelegation: boolean;
};

const AGREEMENT_KEYS = ["terms", "privacy", "shipping", "paymentDelegation"] as const satisfies readonly (keyof AgreementState)[];

function agreementsAllChecked(state: AgreementState) {
  return AGREEMENT_KEYS.every((key) => state[key]);
}

/** 시드·QA용 등 고객에게 그대로 노출하기 부적절한 캠페인 */
function looksLikeInternalOrTestPromo(code: string, title: string): boolean {
  const c = code.trim().toLowerCase();
  const t = title.trim().toLowerCase();
  if (c.startsWith("test_") || c.startsWith("test-")) return true;
  if (/^test\d/.test(c)) return true;
  if (t.includes("테스트")) return true;
  if (t.includes("test ") || t === "test") return true;
  return false;
}

function customerPromoBenefitCopy(applied: { code: string; title: string }): { headline: string; sub?: string } {
  if (looksLikeInternalOrTestPromo(applied.code, applied.title)) {
    return {
      headline: "특별 할인가가 적용된 주문이에요",
      sub: "공구·이벤트 혜택이 정상적으로 반영되었습니다.",
    };
  }
  const head = applied.title.trim() || "특별 혜택";
  return { headline: `${head} 혜택이 적용되었어요` };
}

function customerBenefitStatusLabel(
  applied: { code: string; title: string } | null | undefined,
  referral: string | null,
): string {
  if (applied) return "특별 할인가 적용";
  if (referral) return "코드 반영됨";
  return "일반 주문";
}

declare global {
  interface Window {
    daum?: {
      Postcode: new (options: {
        oncomplete: (data: {
          zonecode: string;
          roadAddress: string;
          jibunAddress: string;
          userSelectedType: "R" | "J";
          bname: string;
          buildingName: string;
          apartment: "Y" | "N";
        }) => void;
      }) => {
        open: () => void;
      };
    };
  }
}

type QuoteOk = {
  ok: true;
  lines: Array<{
    productSlug: ProductSlug;
    quantity: number;
    listUnitPrice: number;
    unitPrice: number;
    lineTotal: number;
    name: string;
    englishName: string;
  }>;
  listTotal: number;
  totalAmount: number;
  appliedPromo: { code: string; title: string } | null;
};

export function OrderForm({ referralCode, initialItems = [] }: OrderFormProps) {
  const router = useRouter();
  const [selectedItems, setSelectedItems] = useState<SelectedItemState>(() => {
    return {
      "sun-pack": {
        selected: initialItems.some((item) => item.productSlug === "sun-pack"),
        quantity: initialItems.find((item) => item.productSlug === "sun-pack")?.quantity ?? 1,
      },
      illuminator: {
        selected: initialItems.some((item) => item.productSlug === "illuminator"),
        quantity: initialItems.find((item) => item.productSlug === "illuminator")?.quantity ?? 1,
      },
    };
  });
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [address, setAddress] = useState("");
  const [addressDetail, setAddressDetail] = useState("");
  const [memo, setMemo] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<(typeof paymentMethods)[number]["value"]>(
    "CREDIT_CARD",
  );
  const [agreements, setAgreements] = useState<AgreementState>({
    terms: false,
    privacy: false,
    shipping: false,
    paymentDelegation: false,
  });
  const agreementsMasterRef = useRef<HTMLInputElement>(null);
  const [resolvedReferralCode, setResolvedReferralCode] = useState(referralCode);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [quote, setQuote] = useState<QuoteOk | null>(null);
  const [quoteLoading, setQuoteLoading] = useState(false);

  const orderSummaryLines = useMemo(() => {
    return products
      .filter((product) => selectedItems[product.slug].selected)
      .map((product) => {
        const q = quote?.lines?.find((l) => l.productSlug === product.slug);
        const quantity = selectedItems[product.slug].quantity;
        const listUnit = q?.listUnitPrice ?? product.price;
        const unit = q?.unitPrice ?? product.price;
        const lineTotal = unit * quantity;
        return {
          productSlug: product.slug,
          name: product.name,
          englishName: product.englishName,
          quantity,
          listUnit,
          unit,
          lineTotal,
        };
      });
  }, [selectedItems, quote]);

  const listSubtotal = useMemo(
    () => orderSummaryLines.reduce((sum, item) => sum + item.listUnit * item.quantity, 0),
    [orderSummaryLines],
  );

  const totalAmount = useMemo(
    () => orderSummaryLines.reduce((sum, item) => sum + item.lineTotal, 0),
    [orderSummaryLines],
  );

  const appliedPromoBenefit = useMemo(() => {
    if (!quote?.appliedPromo) return null;
    return customerPromoBenefitCopy(quote.appliedPromo);
  }, [quote?.appliedPromo]);

  const discountAmount = useMemo(
    () => (listSubtotal > totalAmount ? listSubtotal - totalAmount : 0),
    [listSubtotal, totalAmount],
  );

  useEffect(() => {
    const items = products
      .filter((product) => selectedItems[product.slug].selected)
      .map((product) => ({
        productSlug: product.slug,
        quantity: selectedItems[product.slug].quantity,
      }));

    if (items.length === 0) {
      setQuote(null);
      return;
    }

    const controller = new AbortController();
    const timer = window.setTimeout(() => {
      void (async () => {
        setQuoteLoading(true);
        try {
          const response = await fetch("/api/order-quote", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            signal: controller.signal,
            body: JSON.stringify({
              items,
              referralCode: resolvedReferralCode,
              couponCode: couponCode.trim(),
            }),
          });
          const data = (await response.json()) as QuoteOk | { ok: false; error?: string };
          if (!controller.signal.aborted && response.ok && data && "ok" in data && data.ok) {
            setQuote(data);
          } else if (!controller.signal.aborted) {
            setQuote(null);
          }
        } catch {
          if (!controller.signal.aborted) {
            setQuote(null);
          }
        } finally {
          if (!controller.signal.aborted) {
            setQuoteLoading(false);
          }
        }
      })();
    }, 280);

    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [selectedItems, resolvedReferralCode, couponCode]);

  const fullAddress = useMemo(
    () => [address, addressDetail.trim()].filter(Boolean).join(" "),
    [address, addressDetail],
  );

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

  useEffect(() => {
    const el = agreementsMasterRef.current;
    if (!el) return;
    const selectedCount = AGREEMENT_KEYS.filter((key) => agreements[key]).length;
    el.indeterminate = selectedCount > 0 && selectedCount < AGREEMENT_KEYS.length;
  }, [agreements]);

  function openAddressSearch() {
    setErrorMessage(null);

    if (!window.daum?.Postcode) {
      setErrorMessage("주소 검색 서비스를 불러오지 못했습니다. 잠시 후 다시 시도해주세요.");
      return;
    }

    new window.daum.Postcode({
      oncomplete: (data) => {
        const baseAddress = data.userSelectedType === "R" ? data.roadAddress : data.jibunAddress;
        const extras =
          data.userSelectedType === "R"
            ? [data.bname, data.buildingName].filter(Boolean).join(", ")
            : "";
        const resolvedAddress = extras ? `${baseAddress} (${extras})` : baseAddress;

        setPostalCode(data.zonecode.trim());
        setAddress(resolvedAddress);
      },
    }).open();
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (orderSummaryLines.length === 0) {
      setErrorMessage("구매할 상품을 최소 1개 이상 선택해주세요.");
      return;
    }

    if (!postalCode || !address) {
      setErrorMessage("Daum 주소찾기로 배송지를 먼저 선택해주세요.");
      return;
    }

    if (!agreements.terms || !agreements.privacy || !agreements.shipping || !agreements.paymentDelegation) {
      setErrorMessage("필수 약관 및 개인정보 관련 동의 항목을 모두 확인해주세요.");
      return;
    }

    setSubmitting(true);
    setErrorMessage(null);

    try {
      const response = await fetch("/api/payments/prepare", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: orderSummaryLines.map((item) => ({
            productSlug: item.productSlug,
            quantity: item.quantity,
          })),
          customerName,
          phone,
          postalCode,
          address: fullAddress,
          memo,
          couponCode,
          paymentMethod,
          referralCode: resolvedReferralCode,
        }),
      });

      const data = (await response.json()) as {
        orderNumber?: string;
        error?: string;
        nextAction?: { type?: string; url?: string };
      };

      if (!response.ok || !data.orderNumber) {
        throw new Error(data.error ?? "주문 저장 중 문제가 발생했습니다.");
      }

      if (data.nextAction?.type === "REDIRECT" && data.nextAction.url) {
        router.push(data.nextAction.url);
        return;
      }

      router.push(`/order/complete?orderNumber=${data.orderNumber}&paymentStatus=PENDING`);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "주문 처리에 실패했습니다.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <Script src="//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js" strategy="afterInteractive" />
      <form onSubmit={onSubmit} className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:gap-8">
      <section className="space-y-6 rounded-[28px] border border-[rgba(116,88,59,0.12)] bg-white p-5 md:rounded-[32px] md:p-8">
        <div>
          <p className="text-sm font-semibold text-stone-900">상품 선택</p>
          <p className="mt-2 text-sm text-stone-500">선팩과 일루미네이터 중 원하는 제품만 골라 주문할 수 있습니다.</p>
        </div>

        <div className="grid gap-4">
          {products.map((product) => {
            const itemState = selectedItems[product.slug];

            return (
              <div
                key={product.slug}
                className={`rounded-[24px] border p-4 transition md:rounded-[28px] md:p-5 ${
                  itemState.selected
                    ? "border-[#b89156] bg-[linear-gradient(145deg,#fffaf3_0%,#f8efe3_100%)] shadow-[0_18px_48px_rgba(145,104,52,0.08)]"
                    : "border-stone-200 bg-stone-50"
                }`}
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:items-start sm:text-left md:gap-5">
                    <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-[20px] border border-[rgba(184,145,86,0.12)] bg-white shadow-[0_10px_30px_rgba(89,63,28,0.05)] md:h-28 md:w-28 md:rounded-[24px]">
                      <Image
                        src={productVisuals[product.slug].card}
                        alt={productVisuals[product.slug].alt}
                        fill
                        className="object-contain p-3"
                        sizes="112px"
                      />
                    </div>
                    <div className="space-y-2">
                      <p className="text-[11px] uppercase tracking-[0.18em] text-stone-500">{product.englishName}</p>
                      <h2 className="text-[26px] font-semibold text-stone-900 md:text-2xl">{product.name}</h2>
                      <p className="copy-pretty max-w-xl text-sm leading-6 text-stone-600 md:leading-7">{product.tagline}</p>
                      {itemState.selected ? (
                        <div className="space-y-1">
                          {quoteLoading ? <p className="text-xs text-stone-500">가격 확인 중…</p> : null}
                          {(() => {
                            const line = quote?.lines?.find((l) => l.productSlug === product.slug);
                            const list = line?.listUnitPrice ?? product.price;
                            const unit = line?.unitPrice ?? product.price;
                            return unit < list ? (
                              <p className="text-base font-semibold text-stone-900">
                                <span className="text-sm font-normal text-stone-400 line-through">{formatCurrency(list)}</span>{" "}
                                {formatCurrency(unit)}
                                <span className="ml-1 text-xs font-normal text-emerald-800">공구가</span>
                              </p>
                            ) : (
                              <p className="text-base font-semibold text-stone-900">{formatCurrency(unit)}</p>
                            );
                          })()}
                        </div>
                      ) : (
                        <p className="text-base font-semibold text-stone-500">{formatCurrency(product.price)}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between md:flex-col md:items-end">
                    <button
                      type="button"
                      onClick={() =>
                        setSelectedItems((current) => ({
                          ...current,
                          [product.slug]: {
                            ...current[product.slug],
                            selected: !current[product.slug].selected,
                          },
                        }))
                      }
                      className={`rounded-full px-4 py-2 text-sm font-semibold transition sm:min-w-[112px] ${
                        itemState.selected ? "btn-luxe-primary" : "btn-luxe-secondary"
                      }`}
                    >
                      {itemState.selected ? "선택됨" : "상품 선택"}
                    </button>

                    <label className="space-y-2 text-sm text-stone-700">
                      <span>수량</span>
                      <input
                        type="number"
                        min={1}
                        max={10}
                        value={itemState.quantity}
                        disabled={!itemState.selected}
                        onChange={(event) =>
                          setSelectedItems((current) => ({
                            ...current,
                            [product.slug]: {
                              ...current[product.slug],
                              quantity: Math.min(10, Math.max(1, Number(event.target.value) || 1)),
                            },
                          }))
                        }
                        className="w-full min-w-[112px] rounded-2xl border border-stone-200 bg-white px-4 py-3 outline-none disabled:opacity-50 sm:w-28"
                      />
                    </label>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div>
          <p className="text-sm font-semibold text-stone-900">주문자 정보</p>
          <p className="mt-2 text-sm text-stone-500">
            배송에 필요한 정보를 입력하고 결제수단을 선택해주세요.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="space-y-2 text-sm text-stone-700">
            <span>
              이름 <strong className="text-[#a97d4d]">*</strong>
            </span>
            <input
              required
              value={customerName}
              onChange={(event) => setCustomerName(event.target.value)}
              className="w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 outline-none"
            />
          </label>
          <label className="space-y-2 text-sm text-stone-700">
            <span>
              연락처 <strong className="text-[#a97d4d]">*</strong>
            </span>
            <input
              required
              type="tel"
              inputMode="numeric"
              autoComplete="tel"
              placeholder="010-0000-0000"
              value={phone}
              onChange={(event) => setPhone(formatKoreanMobileInput(event.target.value))}
              className="w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 outline-none"
            />
          </label>
        </div>

        <div className="grid gap-4">
          <label className="space-y-2 text-sm text-stone-700">
            <span>
              배송지 주소 <strong className="text-[#a97d4d]">*</strong>
            </span>
            <div className="flex flex-col gap-3">
              <div className="flex flex-wrap items-stretch gap-2 sm:items-center">
                <input
                  readOnly
                  value={postalCode}
                  placeholder="우편번호"
                  aria-label="우편번호"
                  className="w-full min-w-[7rem] max-w-[10rem] rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-stone-900 outline-none placeholder:text-stone-400 sm:w-36"
                />
                <button
                  type="button"
                  onClick={openAddressSearch}
                  className="btn-luxe-secondary shrink-0 rounded-full px-5 py-3 text-sm font-semibold"
                >
                  주소찾기
                </button>
              </div>
              <input
                required
                readOnly
                value={address}
                placeholder="주소찾기로 검색한 도로명·지번 주소가 여기에 표시됩니다."
                className="w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 outline-none"
              />
            </div>
          </label>

          <label className="space-y-2 text-sm text-stone-700">
            <span>상세 주소</span>
            <input
              value={addressDetail}
              onChange={(event) => setAddressDetail(event.target.value)}
              placeholder="상세 주소를 입력해주세요."
              className="w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 outline-none"
            />
          </label>
        </div>

        <details className="rounded-2xl border border-stone-200 bg-stone-50/60 px-4 py-3 text-sm text-stone-700 open:bg-stone-50">
          <summary className="cursor-pointer select-none text-[15px] font-medium leading-7 text-stone-900 [&::-webkit-details-marker]:hidden [&::marker]:content-none">
            할인·공구 코드{" "}
            <span className="font-normal text-stone-500">(선택 — 전용 링크로 오셨다면 비워 두셔도 됩니다)</span>
          </summary>
          <div className="mt-4 space-y-2 border-t border-stone-200/90 pt-4">
            <label className="block space-y-2 text-stone-700">
              <span className="text-xs font-medium text-stone-600">코드 입력</span>
              <input
                value={couponCode}
                onChange={(event) => setCouponCode(event.target.value)}
                placeholder="문자·메시지로 받은 코드만 입력"
                className="w-full rounded-2xl border border-stone-200 bg-white px-4 py-3 outline-none"
              />
              <span className="block text-xs leading-5 text-stone-500">
                인플루 전용 주소로 들어오시면 같은 코드가 자동으로 반영됩니다. 코드만 따로 받으신 경우에만 적어 주세요. 여기 입력한 값은 링크로 넘어온 값보다 우선합니다.
              </span>
            </label>
          </div>
        </details>

        <label className="space-y-2 text-sm text-stone-700">
          <span>배송 메모</span>
          <textarea
            value={memo}
            onChange={(event) => setMemo(event.target.value)}
            rows={2}
            className="min-h-0 w-full resize-y rounded-2xl border border-stone-200 bg-stone-50 px-3 py-2 text-sm leading-6 outline-none"
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
            네이버페이, 신용카드, 토스페이, 카카오페이 중 원하는 방식으로 결제를 진행할 수 있습니다.
          </p>
        </div>
      </section>

      <aside className="space-y-6 rounded-[28px] border border-[rgba(116,88,59,0.12)] bg-[#f8f3ec] p-5 md:rounded-[32px] md:p-8">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.28em] text-stone-500">Order Summary</p>
          <h2 className="headline-balance text-2xl font-semibold text-stone-900">선택한 상품 확인</h2>
          <p className="copy-pretty text-sm leading-6 text-stone-600">한 개만 선택하거나 두 제품을 함께 담아 결제를 진행할 수 있습니다.</p>
        </div>

        <div className="rounded-[24px] bg-white p-5 md:rounded-[28px] md:p-6">
          {orderSummaryLines.length === 0 ? (
            <p className="text-sm leading-7 text-stone-500">아직 선택한 상품이 없습니다. 왼쪽에서 상품을 선택해주세요.</p>
          ) : (
            <div className="space-y-4">
              {orderSummaryLines.map((item) => (
                <div key={item.productSlug} className="border-b border-stone-100 pb-4 last:border-b-0 last:pb-0">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold text-stone-900">{item.name}</p>
                      <p className="mt-1 text-xs uppercase tracking-[0.14em] text-stone-500">{item.englishName}</p>
                    </div>
                    <div className="text-right text-sm text-stone-600">
                      <p>{item.quantity}개</p>
                      <p className="mt-1 font-medium text-stone-900">
                        {item.unit < item.listUnit ? (
                          <>
                            <span className="mr-1 text-xs font-normal text-stone-400 line-through">
                              {formatCurrency(item.listUnit * item.quantity)}
                            </span>
                            {formatCurrency(item.lineTotal)}
                          </>
                        ) : (
                          formatCurrency(item.lineTotal)
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {appliedPromoBenefit ? (
            <div
              role="status"
              className="mt-4 rounded-2xl border border-emerald-200/90 bg-gradient-to-br from-emerald-50 via-white to-white px-4 py-3.5 shadow-[0_1px_0_rgba(16,185,129,0.06)]"
            >
              <p className="text-[15px] font-semibold leading-7 text-emerald-950 [text-wrap:balance]">
                {appliedPromoBenefit.headline}
              </p>
              {appliedPromoBenefit.sub ? (
                <p className="mt-1.5 text-xs leading-6 text-emerald-900/85">{appliedPromoBenefit.sub}</p>
              ) : null}
            </div>
          ) : null}

          {discountAmount > 0 ? (
            <div className="mt-4 flex flex-wrap items-baseline justify-between gap-x-3 gap-y-2 border-t border-stone-100 pt-4 text-sm text-emerald-800">
              <span className="min-w-0 flex-1 text-[15px] font-medium leading-7 [overflow-wrap:anywhere]">
                혜택으로 절약된 금액
              </span>
              <span className="shrink-0 whitespace-nowrap text-right text-[15px] font-semibold tabular-nums leading-7 tracking-tight">
                −{formatCurrency(discountAmount)}
              </span>
            </div>
          ) : null}

          <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-2 pt-4 text-base font-semibold text-stone-900">
            <span className="min-w-0 flex-1 leading-7 [overflow-wrap:anywhere]">총 결제 예정 금액</span>
            <span className="flex shrink-0 items-baseline gap-2 leading-7">
              {quoteLoading ? <span className="text-xs font-normal text-stone-500">확인 중</span> : null}
              {formatCurrency(totalAmount)}
            </span>
          </div>
        </div>

        <div className="space-y-3 rounded-[24px] bg-white p-5 text-sm text-stone-600 md:rounded-[28px] md:p-6">
          <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1.5">
            <span className="shrink-0 leading-7 text-stone-600">혜택 안내</span>
            <strong className="max-w-full text-right text-[15px] font-semibold leading-7 text-stone-900 sm:max-w-[70%] [overflow-wrap:anywhere]">
              {customerBenefitStatusLabel(quote?.appliedPromo, resolvedReferralCode)}
            </strong>
          </div>
          <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1.5">
            <span className="shrink-0 leading-7 text-stone-600">결제 상태</span>
            <strong className="leading-7 text-amber-700">결제 진행 전</strong>
          </div>
        </div>

        <div className="space-y-4 rounded-[24px] border border-[rgba(169,125,77,0.16)] bg-[#fcf8f2] p-5 md:rounded-[28px] md:p-6">
          <div>
            <p className="text-sm font-semibold text-stone-900">구매 동의</p>
            <p className="mt-2 text-xs leading-6 text-stone-500">
              비회원 주문 결제를 진행하려면 아래 필수 항목을 모두 확인해주세요.
            </p>
          </div>

          <div className="space-y-3">
            <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-[rgba(169,125,77,0.28)] bg-white p-4 text-sm font-medium text-stone-900 shadow-[0_8px_22px_rgba(145,104,52,0.06)]">
              <input
                ref={agreementsMasterRef}
                type="checkbox"
                checked={agreementsAllChecked(agreements)}
                onChange={(event) => {
                  const next = event.target.checked;
                  setAgreements({
                    terms: next,
                    privacy: next,
                    shipping: next,
                    paymentDelegation: next,
                  });
                }}
                className="mt-0.5 h-4 w-4 shrink-0 rounded border-stone-300 text-[#a97d4d] focus:ring-[#a97d4d]"
              />
              <span className="leading-6">
                <strong className="text-stone-900">[필수]</strong> 위 구매·결제·개인정보 관련 항목을 모두 확인했으며, 전체 동의합니다.
              </span>
            </label>

            <label className="flex items-start gap-3 text-sm text-stone-700">
              <input
                type="checkbox"
                checked={agreements.terms}
                onChange={(event) =>
                  setAgreements((current) => ({
                    ...current,
                    terms: event.target.checked,
                  }))
                }
                className="mt-1 h-4 w-4 rounded border-stone-300 text-[#a97d4d] focus:ring-[#a97d4d]"
              />
              <span className="leading-6">
                <strong className="text-stone-900">[필수]</strong> 비회원 구매조건 및{" "}
                <Link href="/policy/terms" target="_blank" className="underline underline-offset-4">
                  이용약관
                </Link>
                을 확인했습니다.
              </span>
            </label>

            <label className="flex items-start gap-3 text-sm text-stone-700">
              <input
                type="checkbox"
                checked={agreements.privacy}
                onChange={(event) =>
                  setAgreements((current) => ({
                    ...current,
                    privacy: event.target.checked,
                  }))
                }
                className="mt-1 h-4 w-4 rounded border-stone-300 text-[#a97d4d] focus:ring-[#a97d4d]"
              />
              <span className="leading-6">
                <strong className="text-stone-900">[필수]</strong> 주문·결제·배송 처리를 위한{" "}
                <Link href="/policy/privacy" target="_blank" className="underline underline-offset-4">
                  개인정보 수집 및 이용
                </Link>
                에 동의합니다.
              </span>
            </label>

            <label className="flex items-start gap-3 text-sm text-stone-700">
              <input
                type="checkbox"
                checked={agreements.shipping}
                onChange={(event) =>
                  setAgreements((current) => ({
                    ...current,
                    shipping: event.target.checked,
                  }))
                }
                className="mt-1 h-4 w-4 rounded border-stone-300 text-[#a97d4d] focus:ring-[#a97d4d]"
              />
              <span className="leading-6">
                <strong className="text-stone-900">[필수]</strong>{" "}
                <Link href="/policy/shipping" target="_blank" className="underline underline-offset-4">
                  배송/교환/반품 정책
                </Link>
                을 확인했습니다.
              </span>
            </label>

            <label className="flex items-start gap-3 text-sm text-stone-700">
              <input
                type="checkbox"
                checked={agreements.paymentDelegation}
                onChange={(event) =>
                  setAgreements((current) => ({
                    ...current,
                    paymentDelegation: event.target.checked,
                  }))
                }
                className="mt-1 h-4 w-4 rounded border-stone-300 text-[#a97d4d] focus:ring-[#a97d4d]"
              />
              <span className="leading-6">
                <strong className="text-stone-900">[필수]</strong> 결제 처리 및 상품 배송을 위한 개인정보의{" "}
                <Link href="/policy/privacy" target="_blank" className="underline underline-offset-4">
                  제3자 제공 및 처리위탁
                </Link>
                에 동의합니다.
              </span>
            </label>
          </div>
        </div>

        {errorMessage ? <p className="text-sm text-red-600">{errorMessage}</p> : null}

        <button
          type="submit"
          disabled={submitting}
          className="btn-luxe-primary w-full rounded-full px-6 py-4 text-sm font-semibold disabled:opacity-60"
        >
          {submitting ? "결제 준비 중..." : "결제 진행하기"}
        </button>
      </aside>
      </form>
    </>
  );
}
