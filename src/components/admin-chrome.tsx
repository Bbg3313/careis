"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTransition } from "react";

import { createSupabaseBrowser } from "@/lib/supabase/client";

const NAV: Array<{ href: string; label: string; match?: "exact" | "prefix"; pill?: boolean }> = [
  { href: "/admin", label: "대시보드", match: "exact" },
  { href: "/admin/sales", label: "매출", match: "prefix" },
  { href: "/admin/orders", label: "주문 목록", match: "prefix" },
  { href: "/admin/product-detail", label: "상세 이미지", match: "prefix" },
  { href: "/admin/promos", label: "공구캠페인", match: "prefix" },
  { href: "/admin/orders/export?tab=general", label: "주문 엑셀", match: "prefix", pill: true },
];

function navActive(pathname: string, href: string, match: "exact" | "prefix" = "prefix") {
  const path = href.split("?")[0]!;
  if (match === "exact") return pathname === path;
  if (path === "/admin/orders/export") {
    return pathname.startsWith("/admin/orders/export");
  }
  if (path === "/admin/orders") {
    return (
      pathname === "/admin/orders" ||
      (pathname.startsWith("/admin/orders/") && !pathname.startsWith("/admin/orders/export"))
    );
  }
  return pathname === path || pathname.startsWith(`${path}/`);
}

export function AdminChrome({
  email,
  supabaseUrl,
  supabaseAnonKey,
}: {
  email: string | null;
  supabaseUrl?: string;
  supabaseAnonKey?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [pending, startTransition] = useTransition();

  async function logout() {
    try {
      const sb = createSupabaseBrowser(supabaseUrl, supabaseAnonKey);
      await sb.auth.signOut();
    } catch {
      /* Supabase 미설정 시 */
    }
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <header className="mb-8 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-stone-200 bg-white px-5 py-4 shadow-sm">
      <div className="flex flex-wrap items-center gap-2 text-sm font-medium sm:gap-3">
        {NAV.map((item) => {
          const active = navActive(pathname, item.href, item.match);
          const className = item.pill
            ? `rounded-full border px-3 py-1.5 transition ${
                active
                  ? "border-[#8b673f] bg-[#8b673f] text-white"
                  : "border-[#b89156]/40 bg-[#faf8f5] text-stone-800 hover:bg-[#f3efe8]"
              }`
            : `rounded-full px-3 py-1.5 transition ${
                active ? "bg-stone-900 text-white" : "text-stone-600 hover:bg-stone-100 hover:text-stone-900"
              }`;
          return (
            <Link
              key={item.href}
              href={item.href}
              prefetch
              className={className}
              onClick={(e) => {
                if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
                e.preventDefault();
                startTransition(() => {
                  router.push(item.href);
                });
              }}
            >
              {item.label}
            </Link>
          );
        })}
        <Link href="/" prefetch={false} className="rounded-full px-3 py-1.5 text-stone-400 hover:text-stone-700">
          쇼핑몰
        </Link>
        {pending ? (
          <span className="ml-1 text-xs font-normal text-[#8b673f]" aria-live="polite">
            이동 중…
          </span>
        ) : null}
      </div>
      <div className="flex items-center gap-3 text-xs">
        {email ? <span className="text-stone-500">{email}</span> : <span className="text-amber-800">로컬: 인증 없음</span>}
        <button
          type="button"
          onClick={() => void logout()}
          className="rounded-full border border-stone-200 bg-white px-3 py-1.5 text-stone-700 hover:bg-stone-50"
        >
          로그아웃
        </button>
      </div>
    </header>
  );
}
