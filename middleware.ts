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
  matcher: [
    // 정적 자산·이미지·미디어는 미들웨어 미적용 (_next 전체 포함해 /_next/image 등 확실히 제외)
    "/((?!_next/|favicon.ico|images/|media/|branding/).*)",
  ],
};
