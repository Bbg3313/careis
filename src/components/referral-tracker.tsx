"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

const COOKIE_KEY = "careis_referral_code";
const STORAGE_KEY = "careis_referral_code";

export function ReferralTracker() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const ref = searchParams.get("ref")?.trim().toLowerCase();
    if (!ref) return;

    const sanitized = ref.replace(/[^a-z0-9_-]/g, "");
    if (!sanitized) return;

    document.cookie = `${COOKIE_KEY}=${sanitized}; path=/; max-age=${60 * 60 * 24 * 30}; samesite=lax`;
    window.localStorage.setItem(STORAGE_KEY, sanitized);
  }, [searchParams]);

  return null;
}
