import Link from "next/link";
import { Suspense } from "react";

import { PromoCountdownGate } from "@/components/promo-countdown-gate";
import { SiteLogo } from "@/components/site-logo";

const navItems = [
  { href: "/#brand", label: "BRAND" },
  { href: "/#product", label: "PRODUCT" },
  { href: "/#inquiry", label: "SHOP" },
  { href: "/contact", label: "CONTACT" },
];

export function SiteHeader({ showStorefrontPromoGate = false }: { showStorefrontPromoGate?: boolean }) {
  return (
    <header className="sticky inset-x-0 top-0 z-50 border-b border-[rgba(116,88,59,0.08)] bg-[rgba(250,248,244,0.86)] backdrop-blur-xl">
      {showStorefrontPromoGate ? (
        <Suspense fallback={null}>
          <PromoCountdownGate />
        </Suspense>
      ) : null}
      <div className="mx-auto max-w-7xl px-4 py-2.5 md:px-6 lg:px-8 lg:py-4">
        <div className="flex items-center justify-between gap-2 sm:gap-3">
          <div className="flex min-w-0 shrink items-center gap-2.5 sm:gap-3 md:gap-3.5">
            <SiteLogo
              compact
              className="w-[52px] shrink-0 sm:w-[60px] md:w-[72px] lg:w-[84px]"
            />
            <span
              className="hidden h-9 w-px shrink-0 self-center rounded-full bg-[linear-gradient(180deg,#efe4d4_0%,#d4c4a8_50%,#c5b391_100%)] sm:block sm:h-10 md:h-11"
              aria-hidden
            />
            <span className="display-font hidden min-w-0 select-none text-[10px] font-light not-italic uppercase leading-normal tracking-[0.26em] text-[#c5b391] antialiased sm:inline sm:text-[11px] sm:tracking-[0.28em] md:text-[12px] md:tracking-[0.3em] lg:text-[13px] [text-rendering:geometricPrecision]">
              Dermacosmetic
            </span>
          </div>

          <nav className="flex min-w-0 flex-1 items-center justify-end gap-2.5 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] sm:gap-3 md:gap-4 lg:flex-initial lg:gap-8 [&::-webkit-scrollbar]:hidden">
            <div className="display-font flex min-w-0 flex-1 items-center justify-end gap-2.5 overflow-x-auto text-[9px] font-light uppercase tracking-[0.22em] text-[#c5b391] antialiased [text-rendering:geometricPrecision] sm:gap-3 sm:text-[10px] sm:tracking-[0.24em] md:gap-5 md:text-[11px] md:tracking-[0.26em] lg:gap-8 lg:text-[12px] lg:tracking-[0.28em]">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="shrink-0 whitespace-nowrap transition hover:text-[#a69678]"
                >
                  {item.label}
                </Link>
              ))}
            </div>
            <Link
              href="/order"
              className="btn-luxe-primary hidden shrink-0 whitespace-nowrap px-5 py-2.5 text-[12px] tracking-[0.1em] lg:inline-flex"
            >
              구매하기
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
