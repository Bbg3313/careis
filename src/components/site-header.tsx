import Link from "next/link";

import { SiteLogo } from "@/components/site-logo";

const navItems = [
  { href: "/#brand", label: "BRAND" },
  { href: "/#product", label: "PRODUCT" },
  { href: "/#inquiry", label: "SHOP" },
  { href: "/contact", label: "CONTACT" },
];

export function SiteHeader() {
  return (
    <header className="sticky inset-x-0 top-0 z-50 border-b border-[rgba(116,88,59,0.08)] bg-[rgba(250,248,244,0.86)] backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 py-2.5 md:px-6 lg:px-8 lg:py-4">
        <div className="flex items-center justify-between gap-2 sm:gap-3">
          <div className="flex min-w-0 shrink items-center gap-2.5 sm:gap-3 md:gap-3.5">
            <SiteLogo
              compact
              className="w-[52px] shrink-0 sm:w-[60px] md:w-[72px] lg:w-[84px]"
            />
            <span
              className="hidden h-9 w-px shrink-0 self-center rounded-full bg-[linear-gradient(180deg,#f2e0b8_0%,#d4b87a_40%,#c4a86a_100%)] sm:block sm:h-10 md:h-11"
              aria-hidden
            />
            <span className="display-font hidden min-w-0 select-none text-[12px] font-normal italic leading-snug tracking-[0.08em] text-[#a69062] antialiased sm:inline sm:text-[13px] md:text-[14px] lg:text-[15px] [text-rendering:geometricPrecision]">
              Dermacosmetic
            </span>
          </div>

          <nav className="flex min-w-0 flex-1 items-center justify-end gap-2.5 overflow-x-auto text-[10px] font-normal tracking-[0.08em] text-[#9c8f78] antialiased [-ms-overflow-style:none] [scrollbar-width:none] [text-rendering:geometricPrecision] sm:gap-3 sm:text-[11px] md:gap-4 md:text-[12px] md:tracking-[0.06em] lg:flex-initial lg:gap-8 lg:text-[13px] lg:tracking-[0.07em] [&::-webkit-scrollbar]:hidden">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="shrink-0 whitespace-nowrap transition hover:text-[#7d6e58]"
              >
                {item.label}
              </Link>
            ))}
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
