import { formatCurrency } from "@/lib/utils";
import type { StorefrontPromoOffer } from "@/lib/promo-pricing";

function looksLikeInternalOrTestPromo(code: string, title: string): boolean {
  const c = code.trim().toLowerCase();
  const t = title.trim().toLowerCase();
  if (c.startsWith("test_") || c.startsWith("test-")) return true;
  if (/^test\d/.test(c)) return true;
  if (t.includes("테스트")) return true;
  if (t.includes("test ") || t === "test") return true;
  return false;
}

function benefitLabel(offer: StorefrontPromoOffer): string {
  if (looksLikeInternalOrTestPromo(offer.code, offer.title)) {
    return `특별가 · 개당 ${formatCurrency(offer.discountAmount)} 할인`;
  }
  const head = offer.title.trim() || "공구 혜택";
  return `${head} · 개당 ${formatCurrency(offer.discountAmount)} 할인`;
}

/** 상세 판매가 / 총액 — 공구 ref가 있으면 정가 취소선 + 할인가 */
export function ProductStorefrontPrice({
  listPrice,
  offer,
  size = "lg",
}: {
  listPrice: number;
  offer: StorefrontPromoOffer | null;
  size?: "lg" | "xl";
}) {
  const priceClass = size === "xl" ? "text-2xl font-semibold" : "text-xl font-semibold";

  if (!offer) {
    return <span className={`${priceClass} text-stone-900`}>{formatCurrency(listPrice)}</span>;
  }

  return (
    <div className="space-y-1">
      <div className="flex flex-wrap items-baseline gap-x-2.5 gap-y-0.5">
        <span className="text-sm font-medium text-stone-400 line-through tabular-nums">
          {formatCurrency(offer.listPrice)}
        </span>
        <span className={`${priceClass} tabular-nums text-[#8b673f]`}>{formatCurrency(offer.salePrice)}</span>
      </div>
      <p className="text-[12px] font-medium leading-snug text-emerald-800">{benefitLabel(offer)}</p>
    </div>
  );
}
