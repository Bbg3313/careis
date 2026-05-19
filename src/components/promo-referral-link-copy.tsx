"use client";

import { useEffect, useMemo, useState } from "react";

export function buildPromoRefUrl(origin: string, code: string) {
  const o = origin.replace(/\/$/, "");
  if (!o) return "";
  return `${o}/?ref=${encodeURIComponent(code)}`;
}

export function PromoReferralLinkCopy({
  baseUrlFromEnv,
  code,
  compact = false,
}: {
  /** 배포 시 쇼핑몰 도메인. 비어 있으면 브라우저 현재 origin 사용 */
  baseUrlFromEnv: string;
  code: string;
  compact?: boolean;
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const origin = useMemo(() => {
    const t = baseUrlFromEnv.trim().replace(/\/$/, "");
    if (t) return t;
    if (mounted && typeof window !== "undefined") return window.location.origin;
    return "";
  }, [baseUrlFromEnv, mounted]);

  const fullUrl = useMemo(() => {
    if (!origin) return "";
    return buildPromoRefUrl(origin, code);
  }, [origin, code]);

  const [copyState, setCopyState] = useState<"idle" | "done" | "err">("idle");

  async function onCopy() {
    if (!fullUrl) return;
    try {
      await navigator.clipboard.writeText(fullUrl);
      setCopyState("done");
      setTimeout(() => setCopyState("idle"), 2000);
    } catch {
      setCopyState("err");
      setTimeout(() => setCopyState("idle"), 2000);
    }
  }

  return (
    <div
      className={
        compact
          ? "flex w-full min-w-0 max-w-full flex-nowrap items-center gap-1.5"
          : "flex min-w-0 flex-col items-stretch gap-2 sm:flex-row sm:flex-wrap sm:items-center"
      }
    >
      <span
        className={
          compact
            ? "min-w-0 flex-1 truncate font-mono text-[13px] leading-snug text-stone-700"
            : "block min-w-0 max-w-full break-all font-mono text-xs text-stone-700"
        }
        title={fullUrl || undefined}
      >
        {fullUrl || "…"}
      </span>
      <button
        type="button"
        onClick={() => void onCopy()}
        disabled={!fullUrl}
        className={
          compact
            ? "shrink-0 rounded-md border border-stone-300 bg-white px-2 py-0.5 text-[11px] font-medium leading-none text-stone-700 transition hover:bg-stone-50 disabled:cursor-not-allowed disabled:opacity-40"
            : "shrink-0 rounded-full border border-stone-300 bg-white px-3 py-1 text-xs font-semibold text-stone-800 shadow-sm transition hover:bg-stone-50 disabled:cursor-not-allowed disabled:opacity-40"
        }
      >
        {copyState === "done" ? "됨" : copyState === "err" ? "실패" : "복사"}
      </button>
    </div>
  );
}
