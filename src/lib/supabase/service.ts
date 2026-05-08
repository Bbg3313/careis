import { createClient } from "@supabase/supabase-js";

import { getPublicSupabaseEnv } from "@/lib/supabase/env-public";

/** 서버 전용: Storage 업로드·삭제 등 (환경변수 없으면 null) */
export function createSupabaseServiceRole() {
  const { url } = getPublicSupabaseEnv();
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!url || !key) {
    return null;
  }
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
