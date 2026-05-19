"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { PromoCountdownStrip } from "@/components/promo-countdown-strip";
import { referralCodeFromUrlForStorefront } from "@/lib/referral-browser";

/**
 * 현재 URL에 `?ref=`가 있을 때만 공구 타이머를 띄움(쿠키·localStorage 무시).
 * RSC `headers()`에 커스텀 헤더가 안 잡히는 환경에서도 URL 기준으로 동작하게 클라이언트에서 조회합니다.
 */
type StripCampaign = { id: string; endsAtIso: string; title: string };

export function PromoCountdownGate() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [campaigns, setCampaigns] = useState<StripCampaign[] | null>(null);

  useEffect(() => {
    const code = referralCodeFromUrlForStorefront(searchParams);
    if (!code) {
      setCampaigns(null);
      return;
    }

    let cancelled = false;
    fetch(`/api/promo-countdown-strip?ref=${encodeURIComponent(code)}`, { cache: "no-store" })
      .then(
        (r) =>
          r.json() as Promise<{
            ok?: boolean;
            campaigns?: StripCampaign[];
            /** 구버전 단일 객체 (배포 전후 호환) */
            endsAtIso?: string;
            title?: string;
          }>,
      )
      .then((data) => {
        if (cancelled) return;
        if (data.ok && Array.isArray(data.campaigns) && data.campaigns.length > 0) {
          setCampaigns(data.campaigns);
          return;
        }
        if (data.ok && data.endsAtIso && data.title) {
          setCampaigns([{ id: "legacy", endsAtIso: data.endsAtIso, title: data.title }]);
          return;
        }
        setCampaigns(null);
      })
      .catch(() => {
        if (!cancelled) setCampaigns(null);
      });

    return () => {
      cancelled = true;
    };
  }, [searchParams, pathname]);

  if (!campaigns?.length) return null;
  return (
    <>
      {campaigns.map((c) => (
        <PromoCountdownStrip key={c.id} endsAtIso={c.endsAtIso} title={c.title} />
      ))}
    </>
  );
}
