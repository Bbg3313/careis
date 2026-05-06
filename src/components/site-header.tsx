import Link from "next/link";

import { SiteLogo } from "@/components/site-logo";

const navItems = [
  { href: "/#brand", label: "BRAND" },
  { href: "/#product", label: "PRODUCT" },
  { href: "/#inquiry", label: "INQUIRY" },
  { href: "/contact", label: "CONTACT" },
];

export function SiteHeader() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-transparent">
      <div className="mx-auto max-w-7xl px-5 py-3 md:px-6 lg:px-8 lg:py-4">
        <div className="flex items-center justify-between gap-4">
          <SiteLogo compact />

          <Link
            href="/contact"
            className="btn-luxe-primary inline-flex shrink-0 items-center px-4 py-2.5 text-[11px] tracking-[0.1em] sm:px-5 lg:hidden"
          >
            도입 문의
          </Link>

          <nav className="hidden items-center gap-6 text-[12px] tracking-[0.05em] text-stone-600 xl:gap-8 xl:text-[13px] lg:flex">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="whitespace-nowrap transition hover:text-stone-900"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/contact"
              className="btn-luxe-primary whitespace-nowrap px-6 py-2.5 text-[12px] tracking-[0.1em]"
            >
              도입 문의
            </Link>
          </nav>
        </div>

        <nav className="nav-strip mt-3 flex items-center gap-5 overflow-x-auto pt-3 text-[12px] tracking-[0.08em] text-stone-600 lg:hidden">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="shrink-0 whitespace-nowrap transition hover:text-stone-900"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
