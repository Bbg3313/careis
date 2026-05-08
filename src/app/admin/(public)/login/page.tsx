import Link from "next/link";
import { headers } from "next/headers";
import { Suspense } from "react";

import { getPublicSupabaseEnv } from "@/lib/supabase/env-public";

import { AdminLoginForm } from "./admin-login-form";

export default async function AdminLoginPage() {
  const { url: supabaseUrl, anon: supabaseAnonKey } = getPublicSupabaseEnv();
  const ok = Boolean(supabaseUrl && supabaseAnonKey);

  const headerList = await headers();
  const host =
    headerList.get("x-forwarded-host") ?? headerList.get("host") ?? "";

  return (
    <div className="mx-auto max-w-lg space-y-8 py-10">
      {!ok ? <SupabaseEnvMissingBanner host={host} /> : null}
      <Suspense fallback={<div className="h-48 animate-pulse rounded-2xl bg-stone-100" />}>
        <AdminLoginForm supabaseUrl={supabaseUrl} supabaseAnonKey={supabaseAnonKey} />
      </Suspense>
      <p className="text-center text-xs text-stone-500">
        <Link href="/" className="underline hover:text-stone-700">
          쇼핑몰로 돌아가기
        </Link>
      </p>
    </div>
  );
}

function SupabaseEnvMissingBanner({ host }: { host: string }) {
  return (
    <div className="space-y-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-4 text-sm text-amber-950">
      <p className="font-medium">Supabase 연결 정보를 서버에서 읽지 못했습니다.</p>
      <p className="text-xs leading-relaxed text-amber-950/90">
        아래 이름 중 <strong>한 세트</strong>를 Vercel(또는 호스트) <strong>Production</strong> 환경변수에 넣고{" "}
        <strong>재배포</strong>하세요.
      </p>
      <ul className="list-inside list-disc space-y-1 font-mono text-[11px] text-amber-950/85">
        <li>NEXT_PUBLIC_SUPABASE_URL + NEXT_PUBLIC_SUPABASE_ANON_KEY</li>
        <li className="list-none pl-4 text-stone-600">또는 SUPABASE_URL + SUPABASE_ANON_KEY (동일 값)</li>
      </ul>
      <p className="text-xs text-amber-950/85">
        Vercel → 해당 프로젝트 → Settings → Environment Variables → 이름 오타 없는지, Production에 체크됐는지 확인 후{" "}
        Deployments에서 Redeploy.
      </p>
      <p className="border-t border-amber-200/80 pt-2 text-[11px] text-amber-950/75">
        지금 접속 호스트: <code className="rounded bg-white/70 px-1.5 py-0.5">{host || "—"}</code>
      </p>
    </div>
  );
}
