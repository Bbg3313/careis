"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { createSupabaseBrowser } from "@/lib/supabase/client";

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
      <div className="flex flex-wrap items-center gap-5 text-sm font-medium">
        <Link href="/admin" className="text-stone-900">
          대시보드
        </Link>
        <Link href="/admin/orders" className="text-stone-600 hover:text-stone-900">
          주문 목록
        </Link>
        <Link href="/admin/product-detail" className="text-stone-600 hover:text-stone-900">
          상세 이미지
        </Link>
        <Link href="/admin/promos" className="text-stone-600 hover:text-stone-900">
          공구·프로모
        </Link>
        <a
          href="/api/admin/orders/export"
          className="text-stone-600 hover:text-stone-900"
        >
          엑셀 다운로드
        </a>
        <Link href="/" className="text-stone-400 hover:text-stone-700">
          쇼핑몰
        </Link>
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
