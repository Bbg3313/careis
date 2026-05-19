"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { PromoCountdownStrip } from "@/components/promo-countdown-strip";
import { referralCodeForPromoStrip } from "@/lib/referral-browser";

/**
 * `?ref=` 또는 미들웨어/ReferralTracker가 심은 **레퍼럴 쿠키**로 공구 타이머를 조회합니다.
 * (내부 링크로 `ref` 쿼리가 빠져도 쿠키가 있으면 타이머를 유지합니다.)
 */
type StripCampaign = { id: string; endsAtIso: string; title: string };

export function PromoCountdownGate() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [campaigns, setCampaigns] = useState<StripCampaign[] | null>(null);

  useEffect(() => {
    const code = referralCodeForPromoStrip(searchParams);
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
