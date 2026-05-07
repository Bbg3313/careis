import Link from "next/link";
import { Suspense } from "react";

import { AdminLoginForm } from "./admin-login-form";

export default function AdminLoginPage() {
  return (
    <div className="mx-auto max-w-lg space-y-8 py-10">
      <SupabaseSetupNotice />
      <Suspense fallback={<div className="h-48 animate-pulse rounded-2xl bg-stone-100" />}>
        <AdminLoginForm />
      </Suspense>
      <p className="text-center text-xs text-stone-500">
        <Link href="/" className="underline hover:text-stone-700">
          쇼핑몰로 돌아가기
        </Link>
      </p>
    </div>
  );
}

function SupabaseSetupNotice() {
  const ok = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim(),
  );
  if (ok) {
    return null;
  }
  return (
    <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
      <code className="text-xs">NEXT_PUBLIC_SUPABASE_URL</code> 와{" "}
      <code className="text-xs">NEXT_PUBLIC_SUPABASE_ANON_KEY</code> 를 .env에 넣은 뒤 다시 접속해주세요.
    </p>
  );
}
