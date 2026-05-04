import Link from "next/link";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/brand", label: "Brand" },
  { href: "/products", label: "Products" },
  { href: "/cart", label: "Cart" },
  { href: "/order", label: "Order" },
  { href: "/admin/orders", label: "Admin" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-[rgba(116,88,59,0.08)] bg-[rgba(255,251,246,0.76)] backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex flex-col">
          <span className="display-font text-3xl font-semibold tracking-[0.08em] text-stone-900">
            CAREIS
          </span>
          <span className="text-[10px] uppercase tracking-[0.34em] text-stone-500">
            Clinical Premium
          </span>
        </Link>

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
            href="/order?product=sun-pack"
            className="rounded-full bg-stone-900 px-4 py-2 text-xs font-semibold tracking-[0.16em] text-white"
          >
            BUY NOW
          </Link>
        </nav>
      </div>
    </header>
  );
}
