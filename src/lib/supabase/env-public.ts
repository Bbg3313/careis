/**
 * Supabase 공개 연결 정보 (프로젝트 URL + anon 키).
 * Vercel에 NEXT_PUBLIC_* 만 넣지 않고 SUPABASE_URL 형태로 넣은 경우도 서버/미들웨어에서 인식합니다.
 * service_role 키는 여기에 넣지 마세요.
 */
export function getPublicSupabaseEnv(): { url: string; anon: string } {
  const url = (
    process.env.NEXT_PUBLIC_SUPABASE_URL ??
    process.env.SUPABASE_URL ??
    ""
  ).trim();
  const anon = (
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
    process.env.SUPABASE_ANON_KEY ??
    ""
  ).trim();
  return { url, anon };
}

export function hasPublicSupabaseEnv(): boolean {
  const { url, anon } = getPublicSupabaseEnv();
  return Boolean(url && anon);
}
