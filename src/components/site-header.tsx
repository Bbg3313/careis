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
          <SiteLogo
            compact
            className="w-[72px] shrink-0 sm:w-[84px] md:w-[100px] lg:w-[132px]"
          />

          <nav className="flex min-w-0 flex-1 items-center justify-end gap-2.5 overflow-x-auto text-[10px] tracking-[0.06em] text-stone-600 [-ms-overflow-style:none] [scrollbar-width:none] sm:gap-3 sm:text-[11px] md:gap-4 md:text-[12px] lg:flex-initial lg:gap-8 lg:text-[13px] lg:tracking-[0.05em] [&::-webkit-scrollbar]:hidden">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="shrink-0 whitespace-nowrap transition hover:text-stone-900"
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
