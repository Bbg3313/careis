"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { PromoCampaignNoticeStrip, PromoRefUnknownStrip } from "@/components/promo-campaign-notice-strip";
import { PromoCountdownStrip } from "@/components/promo-countdown-strip";
import { referralCodeForPromoStrip } from "@/lib/referral-browser";

type StripState = "live" | "ended" | "upcoming" | "disabled";

type StripCampaign = {
  id: string;
  endsAtIso: string;
  title: string;
  startsAtIso?: string;
  state?: StripState;
};

type GateView =
  | { kind: "none" }
  | { kind: "campaigns"; items: StripCampaign[] }
  | { kind: "unknown"; code: string }
  | { kind: "server_error" };

/**
 * 현재 URL에 `?ref=`가 있을 때만 공구 바를 조회합니다(쿠키만으로는 표시하지 않음).
 * 활성 기간이면 카운트다운, 아니면 종료·예정·비활성 안내, 코드 미등록 시 안내 막대를 띄웁니다.
 */
export function PromoCountdownGate() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [view, setView] = useState<GateView>({ kind: "none" });

  useEffect(() => {
    const code = referralCodeForPromoStrip(searchParams);
    if (!code) {
      setView({ kind: "none" });
      return;
    }

    let cancelled = false;

    fetch(`/api/promo-countdown-strip?ref=${encodeURIComponent(code)}`, { cache: "no-store" })
      .then(
        (r) =>
          r.json() as Promise<{
            ok?: boolean;
            reason?: string;
            campaigns?: StripCampaign[];
            endsAtIso?: string;
            title?: string;
          }>,
      )
      .then((data) => {
        if (cancelled) return;

        if (data.ok && Array.isArray(data.campaigns) && data.campaigns.length > 0) {
          setView({ kind: "campaigns", items: data.campaigns as StripCampaign[] });
          return;
        }

        if (data.ok && data.endsAtIso && data.title) {
          setView({
            kind: "campaigns",
            items: [{ id: "legacy", endsAtIso: data.endsAtIso, title: data.title, state: "live" }],
          });
          return;
        }

        if (data.ok === false) {
          if (data.reason === "SERVER") {
            setView({ kind: "server_error" });
            return;
          }
          setView({ kind: "unknown", code });
          return;
        }

        setView({ kind: "none" });
      })
      .catch(() => {
        if (!cancelled) setView({ kind: "server_error" });
      });

    return () => {
      cancelled = true;
    };
  }, [searchParams, pathname]);

  if (view.kind === "none") return null;

  if (view.kind === "unknown") {
    return <PromoRefUnknownStrip code={view.code} />;
  }

  if (view.kind === "server_error") {
    return (
      <div className="relative z-[2] border-b border-red-900/30 bg-stone-900 px-4 py-2 text-center text-[11px] text-red-100 sm:text-xs">
        공구 정보를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.
      </div>
    );
  }

  return (
    <>
      {view.items.map((c) => {
        const state = c.state ?? "live";
        if (state === "live") {
          return <PromoCountdownStrip key={c.id} endsAtIso={c.endsAtIso} title={c.title} />;
        }
        const starts = c.startsAtIso ?? c.endsAtIso;
        return (
          <PromoCampaignNoticeStrip
            key={c.id}
            title={c.title}
            state={state}
            startsAtIso={starts}
            endsAtIso={c.endsAtIso}
          />
        );
      })}
    </>
  );
}
