import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { REFERRAL_COOKIE_AGE, REFERRAL_COOKIE_KEY, sanitizeReferralCode } from "@/lib/referral";

export function middleware(request: NextRequest) {
  const ref = sanitizeReferralCode(request.nextUrl.searchParams.get("ref"));
  const response = NextResponse.next();

  if (ref) {
    response.cookies.set({
      name: REFERRAL_COOKIE_KEY,
      value: ref,
      maxAge: REFERRAL_COOKIE_AGE,
      path: "/",
      sameSite: "lax",
    });
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
