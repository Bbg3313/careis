import Link from "next/link";

import type { ProductContent } from "@/lib/product-data";
import { formatCurrency } from "@/lib/utils";

function primaryCtaClasses(theme: ProductContent["theme"]) {
  if (theme === "cool") {
    return [
      "bg-gradient-to-br from-indigo-600 via-indigo-600 to-violet-700",
      "text-white shadow-[0_14px_36px_rgba(67,56,202,0.45)]",
      "hover:brightness-[1.05] active:brightness-[0.98]",
    ].join(" ");
  }
  return [
    "bg-gradient-to-br from-rose-600 via-rose-600 to-orange-700",
    "text-white shadow-[0_14px_36px_rgba(225,29,72,0.38)]",
    "hover:brightness-[1.05] active:brightness-[0.98]",
  ].join(" ");
}

export function MobileProductStickyCta({ product }: { product: ProductContent }) {
  const orderHref = `/order?product=${product.slug}`;
  const cartHref = `/cart?product=${product.slug}`;
  const pct = product.promoMaxDiscountPercent;
  const primaryLine =
    pct != null && pct > 0
      ? `최대 ${pct}% 할인받고 구매하기`
      : "지금 바로 구매하기";

  return (
    <div
      className="pointer-events-auto fixed inset-x-0 bottom-0 z-[45] border-t border-stone-200/95 bg-[#faf8f4]/[0.97] px-4 pt-3 shadow-[0_-16px_48px_rgba(30,24,18,0.12)] backdrop-blur-lg lg:hidden"
      style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}
      role="region"
      aria-label="모바일 구매"
    >
      <div className="mx-auto w-full max-w-lg space-y-2.5 pb-1">
        <div className="flex min-w-0 items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="truncate text-[12px] font-medium text-stone-500">{product.name}</p>
            <p className="mt-0.5 text-xl font-bold tabular-nums tracking-tight text-stone-900">
              {formatCurrency(product.price)}
            </p>
          </div>
          <Link
            href={cartHref}
            className="shrink-0 rounded-full border border-stone-300/90 bg-white px-3.5 py-2 text-[12px] font-semibold text-stone-800 shadow-sm transition hover:border-stone-400 hover:bg-stone-50"
          >
            장바구니
          </Link>
        </div>

        <Link
          href={orderHref}
          className={`flex min-h-[52px] w-full items-center justify-center rounded-2xl px-4 py-3.5 text-center text-[15px] font-bold leading-snug tracking-[-0.02em] transition ${primaryCtaClasses(product.theme)}`}
        >
          {primaryLine}
        </Link>

        {pct != null && pct > 0 && product.promoMaxDiscountNote ? (
          <p className="text-center text-[10px] leading-relaxed text-stone-500">{product.promoMaxDiscountNote}</p>
        ) : null}
      </div>
    </div>
  );
}
