import type { User } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

import { createSupabaseServer } from "@/lib/supabase/server";
import { hasPublicSupabaseEnv } from "@/lib/supabase/env-public";

export async function getAdminSessionUser() {
  if (!hasPublicSupabaseEnv()) {
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
  if (!hasPublicSupabaseEnv()) {
    return null;
  }

  const user = await getAdminSessionUser();
  if (!user) {
    throw new Error("로그인이 필요합니다.");
  }
  assertAllowedAdminEmail(user);
  return user;
}

/** Supabase 인증이 켜진 환경에서 관리자 API 보호. 허용 시 `null`, 차단 시 `NextResponse` */
export async function guardAdminApi(): Promise<NextResponse | null> {
  if (!hasPublicSupabaseEnv()) {
    return null;
  }

  const user = await getAdminSessionUser();
  if (!user) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    assertAllowedAdminEmail(user);
  } catch {
    return NextResponse.json({ ok: false, error: "Forbidden" }, { status: 403 });
  }

  return null;
}
