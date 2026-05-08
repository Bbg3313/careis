import { createBrowserClient } from "@supabase/ssr";

/** 서버에서 넘긴 값이 있으면 우선 (배포 후 환경변수만 추가한 경우 등 런타임 설정 반영) */
export function createSupabaseBrowser(urlArg?: string | null, anonArg?: string | null) {
  const url = (urlArg ?? process.env.NEXT_PUBLIC_SUPABASE_URL)?.trim();
  const anon = (anonArg ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)?.trim();
  if (!url || !anon) {
    throw new Error("NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY 가 필요합니다.");
  }
  return createBrowserClient(url, anon);
}
