import Link from "next/link";

import { SiteLogo } from "@/components/site-logo";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/brand", label: "Brand" },
  { href: "/products", label: "Products" },
  { href: "/contact", label: "Contact" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-[rgba(116,88,59,0.08)] bg-[rgba(255,251,246,0.76)] backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <SiteLogo compact />

        <nav className="hidden items-center gap-7 text-sm text-stone-600 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="transition hover:text-stone-900"
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/contact"
            className="rounded-full border border-stone-900/10 bg-white/70 px-4 py-2 text-xs font-semibold tracking-[0.16em] text-stone-900"
          >
            B2B INQUIRY
          </Link>
          <Link
            href="/order?product=sun-pack"
            className="rounded-full bg-stone-900 px-4 py-2 text-xs font-semibold tracking-[0.16em] text-white"
          >
            REFERRAL BUY
          </Link>
        </nav>
      </div>
    </header>
  );
}
