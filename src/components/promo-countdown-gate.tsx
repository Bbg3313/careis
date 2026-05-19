"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { PromoCountdownStrip } from "@/components/promo-countdown-strip";
import { REFERRAL_COOKIE_KEY, sanitizeReferralCode } from "@/lib/referral-code";

function refFromBrowserCookie(): string | null {
  if (typeof document === "undefined") return null;
  const raw = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${REFERRAL_COOKIE_KEY}=`))
    ?.slice(REFERRAL_COOKIE_KEY.length + 1);
  return sanitizeReferralCode(raw ? decodeURIComponent(raw) : null);
}

/**
 * `?ref=` 또는 레퍼럴 쿠키가 있을 때만 공구 타이머를 띄움.
 * RSC `headers()`에 커스텀 헤더가 안 잡히는 환경에서도 URL 기준으로 동작하게 클라이언트에서 조회합니다.
 */
export function PromoCountdownGate() {
  const searchParams = useSearchParams();
  const [payload, setPayload] = useState<{ endsAtIso: string; title: string } | null>(null);

  useEffect(() => {
    const fromUrl = sanitizeReferralCode(searchParams.get("ref"));
    const fromCookie = refFromBrowserCookie();
    const code = fromUrl ?? fromCookie;
    if (!code) {
      setPayload(null);
      return;
    }

    let cancelled = false;
    fetch(`/api/promo-countdown-strip?ref=${encodeURIComponent(code)}`, { cache: "no-store" })
      .then((r) => r.json() as Promise<{ ok?: boolean; endsAtIso?: string; title?: string }>)
      .then((data) => {
        if (cancelled) return;
        if (data.ok && data.endsAtIso && data.title) {
          setPayload({ endsAtIso: data.endsAtIso, title: data.title });
        } else {
          setPayload(null);
        }
      })
      .catch(() => {
        if (!cancelled) setPayload(null);
      });

    return () => {
      cancelled = true;
    };
  }, [searchParams]);

  if (!payload) return null;
  return <PromoCountdownStrip endsAtIso={payload.endsAtIso} title={payload.title} />;
}
