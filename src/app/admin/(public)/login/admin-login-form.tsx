"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

import { createSupabaseBrowser } from "@/lib/supabase/client";

export function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/admin";
  const paramError = searchParams.get("error");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setErrorMessage(null);
    setLoading(true);
    try {
      let supabase;
      try {
        supabase = createSupabaseBrowser();
      } catch {
        throw new Error("Supabase URL/Anon Key가 설정되지 않았습니다.");
      }
      const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
      if (error) {
        throw new Error(error.message);
      }
      router.replace(next);
      router.refresh();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "로그인에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={(e) => void onSubmit(e)} className="mx-auto max-w-md space-y-5 rounded-2xl border border-stone-200 bg-white p-8 shadow-sm">
      <div>
        <h1 className="text-xl font-semibold text-stone-900">관리자 로그인</h1>
        <p className="mt-2 text-sm text-stone-500">Supabase에 등록한 이메일·비밀번호로 로그인합니다.</p>
      </div>
      {paramError === "forbidden" ? (
        <p className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900">
          이 이메일은 관리자 목록(<code className="text-xs">ADMIN_ALLOWED_EMAILS</code>)에 없습니다.
        </p>
      ) : null}
      {errorMessage ? <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-800">{errorMessage}</p> : null}
      <label className="block text-sm">
        <span className="text-stone-600">이메일</span>
        <input
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 w-full rounded-xl border border-stone-200 px-3 py-2 text-stone-900 outline-none focus:border-[#b89156]"
          required
        />
      </label>
      <label className="block text-sm">
        <span className="text-stone-600">비밀번호</span>
        <input
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-1 w-full rounded-xl border border-stone-200 px-3 py-2 text-stone-900 outline-none focus:border-[#b89156]"
          required
        />
      </label>
      <button
        type="submit"
        disabled={loading}
        className="btn-luxe-primary inline-flex min-h-[48px] w-full items-center justify-center rounded-full px-6 py-3 text-sm font-semibold text-white disabled:opacity-60"
      >
        {loading ? "확인 중…" : "로그인"}
      </button>
    </form>
  );
}
