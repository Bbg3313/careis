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

  const label = title.length > 36 ? `${title.slice(0, 34)}…` : title;

  return (
    <div className="border-b border-[rgba(139,103,63,0.22)] bg-[linear-gradient(90deg,#2a231c_0%,#3a3028_45%,#3a3028_55%,#2a231c_100%)] text-[11px] text-amber-50/95 antialiased sm:text-xs">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-2 gap-y-1 px-4 py-1.5 sm:gap-x-3 md:px-8">
        <span className="hidden font-medium text-amber-100/90 sm:inline">공구 종료까지</span>
        <span className="max-w-[min(100%,14rem)] truncate text-center font-medium text-amber-50 sm:max-w-[min(100%,20rem)]">
          {label}
        </span>
        <span className="text-amber-200/70" aria-hidden>
          ·
        </span>
        <span className="font-mono text-[13px] tabular-nums tracking-wide text-white sm:text-sm" suppressHydrationWarning>
          {formatRemaining(remaining)}
        </span>
        <span className="text-amber-100/85">남음</span>
      </div>
    </div>
  );
}
