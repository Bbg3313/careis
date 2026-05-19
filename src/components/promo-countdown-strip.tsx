"use client";

import { useEffect, useMemo, useState } from "react";

function pad2(n: number) {
  return n.toString().padStart(2, "0");
}

function formatRemaining(ms: number): string {
  if (ms <= 0) return "00:00:00";
  const totalSec = Math.floor(ms / 1000);
  const days = Math.floor(totalSec / 86400);
  const h = Math.floor((totalSec % 86400) / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  if (days > 0) {
    return `${days}일 ${pad2(h)}:${pad2(m)}:${pad2(s)}`;
  }
  return `${pad2(h)}:${pad2(m)}:${pad2(s)}`;
}

/** 모바일 2행용: 종료 일시 짧게 */
function formatEndsAtShortKo(iso: string): string {
  const d = new Date(iso);
  if (!Number.isFinite(d.getTime())) return "";
  return d.toLocaleString("ko-KR", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

export function PromoCountdownStrip({ endsAtIso, title }: { endsAtIso: string; title: string }) {
  const endMs = useMemo(() => new Date(endsAtIso).getTime(), [endsAtIso]);
  const [nowMs, setNowMs] = useState(() => Date.now());

  useEffect(() => {
    const id = window.setInterval(() => setNowMs(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);

  const remaining = endMs - nowMs;

  if (!Number.isFinite(endMs) || remaining <= 0) {
    return null;
  }

  const label = title.length > 72 ? `${title.slice(0, 70)}…` : title;

  return (
    <div className="relative z-[2] border-b border-[rgba(139,103,63,0.22)] bg-[linear-gradient(90deg,#2a231c_0%,#3a3028_45%,#3a3028_55%,#2a231c_100%)] text-[11px] text-amber-50/95 antialiased sm:text-xs">
      <div className="mx-auto max-w-7xl px-4 py-2 sm:py-1.5 md:px-8">
        {/* 1행: 관리자 「상단바 표시」(DB title)만 — 고정 접두어 없음 / 2행: 종료 일시 + 카운트다운 */}
        <div className="flex flex-col items-center justify-center gap-y-1">
          <div className="flex w-full min-w-0 items-center justify-center px-1">
            <span
              className="max-w-full text-center text-[12px] font-semibold leading-snug text-amber-50 sm:text-sm md:text-[15px]"
              title={title}
            >
              {label}
            </span>
          </div>
          <div className="flex w-full min-w-0 flex-wrap items-center justify-center gap-x-2 gap-y-0.5 text-center">
            <span className="max-w-full break-keep text-[11px] tabular-nums text-amber-200/90 sm:text-[12px]" title={`종료 ${formatEndsAtShortKo(endsAtIso)}`}>
              종료 {formatEndsAtShortKo(endsAtIso)}
            </span>
            <span className="text-amber-200/60" aria-hidden>
              ·
            </span>
            <span
              className="font-mono text-[14px] tabular-nums tracking-wide text-white sm:text-sm"
              suppressHydrationWarning
            >
              {formatRemaining(remaining)}
            </span>
            <span className="text-amber-100/85">남음</span>
          </div>
        </div>
      </div>
    </div>
  );
}
