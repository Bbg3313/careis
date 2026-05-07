import type { User } from "@supabase/supabase-js";

import { createSupabaseServer } from "@/lib/supabase/server";

export async function getAdminSessionUser() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) {
    return null;
  }

  const supabase = await createSupabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

export function assertAllowedAdminEmail(user: User) {
  const raw = process.env.ADMIN_ALLOWED_EMAILS?.trim();
  if (!raw) {
    return;
  }
  const allowed = raw
    .split(",")
    .map((entry) => entry.trim().toLowerCase())
    .filter(Boolean);
  const email = user.email?.toLowerCase() ?? "";
  if (!email || !allowed.includes(email)) {
    throw new Error("이 계정은 관리자로 등록되어 있지 않습니다.");
  }
}

export async function requireAdminUser(): Promise<User | null> {
  const has = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim());
  if (!has) {
    return null;
  }

  const user = await getAdminSessionUser();
  if (!user) {
    throw new Error("로그인이 필요합니다.");
  }
  assertAllowedAdminEmail(user);
  return user;
}
