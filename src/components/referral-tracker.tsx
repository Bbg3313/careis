"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

import { REFERRAL_COOKIE_AGE, REFERRAL_COOKIE_KEY, sanitizeReferralCode } from "@/lib/referral-code";

const STORAGE_KEY = REFERRAL_COOKIE_KEY;

export function ReferralTracker() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const sanitized = sanitizeReferralCode(searchParams.get("ref"));
    if (!sanitized) return;

    document.cookie = `${REFERRAL_COOKIE_KEY}=${sanitized}; path=/; max-age=${REFERRAL_COOKIE_AGE}; samesite=lax`;
    window.localStorage.setItem(STORAGE_KEY, sanitized);
  }, [searchParams]);

  return null;
}
