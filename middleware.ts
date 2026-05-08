import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { REFERRAL_COOKIE_AGE, REFERRAL_COOKIE_KEY, sanitizeReferralCode } from "@/lib/referral";
import { hasPublicSupabaseEnv } from "@/lib/supabase/env-public";
import { refreshSupabaseSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  const { response: supabaseResponse, user } = await refreshSupabaseSession(request);

  const ref = sanitizeReferralCode(request.nextUrl.searchParams.get("ref"));
  if (ref) {
    supabaseResponse.cookies.set({
      name: REFERRAL_COOKIE_KEY,
      value: ref,
      maxAge: REFERRAL_COOKIE_AGE,
      path: "/",
      sameSite: "lax",
    });
  }

  const path = request.nextUrl.pathname;
  const isAdminLogin = path === "/admin/login";
  const isAdminArea = path.startsWith("/admin");

  if (isAdminArea && !isAdminLogin) {
    const hasSupabase = hasPublicSupabaseEnv();
    if (hasSupabase && !user) {
      const login = new URL("/admin/login", request.url);
      login.searchParams.set("next", `${path}${request.nextUrl.search}`);
      return NextResponse.redirect(login);
    }
  }

  if (path.startsWith("/api/admin")) {
    const hasSupabase = hasPublicSupabaseEnv();
    if (hasSupabase && !user) {
      return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/|favicon.ico|images/|media/|branding/).*)",
  ],
};
