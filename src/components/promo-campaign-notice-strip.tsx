"use client";

function formatKo(iso: string): string {
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

type State = "ended" | "upcoming";

export function PromoCampaignNoticeStrip({
  title,
  state,
  startsAtIso,
  endsAtIso,
}: {
  title: string;
  state: State;
  startsAtIso: string;
  endsAtIso: string;
}) {
  const label = title.length > 72 ? `${title.slice(0, 70)}…` : title;

  const headline = state === "ended" ? "종료된 공구" : "시작 전 공구";

  const detail =
    state === "ended" ? `종료 ${formatKo(endsAtIso)}` : `시작 ${formatKo(startsAtIso)}`;

  return (
    <div className="relative z-[2] border-b border-[rgba(139,103,63,0.22)] bg-[linear-gradient(90deg,#2a231c_0%,#3a3028_45%,#3a3028_55%,#2a231c_100%)] text-[11px] text-amber-50/95 antialiased sm:text-xs">
      <div className="mx-auto max-w-7xl px-4 py-2 sm:py-1.5 md:px-8">
        <div className="flex flex-col items-center justify-center gap-y-1 text-center">
          <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-0.5">
            <span className="shrink-0 rounded bg-amber-900/40 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-100/95">
              {headline}
            </span>
            <span className="max-w-full text-[12px] font-semibold leading-snug text-amber-50 sm:text-sm" title={title}>
              {label}
            </span>
          </div>
          <p className="text-[11px] text-amber-200/90 sm:text-xs">{detail}</p>
        </div>
      </div>
    </div>
  );
}

/** DB에 해당 ref 코드 행이 없을 때 */
export function PromoRefUnknownStrip({ code }: { code: string }) {
  return (
    <div className="relative z-[2] border-b border-[rgba(139,103,63,0.22)] bg-[linear-gradient(90deg,#2a231c_0%,#3a3028_45%,#3a3028_55%,#2a231c_100%)] text-[11px] text-amber-50/95 antialiased sm:text-xs">
      <div className="mx-auto max-w-7xl px-4 py-2 sm:py-1.5 md:px-8">
        <div className="flex flex-col items-center justify-center gap-y-0.5 text-center">
          <p className="text-[12px] font-medium text-amber-50 sm:text-sm">
            공구 링크 <span className="font-mono text-amber-100">ref={code}</span>
          </p>
          <p className="max-w-xl text-[11px] leading-relaxed text-amber-200/90 sm:text-xs">
            등록된 공구 코드가 없거나 삭제되었습니다. 관리자 「공구캠페인」에서 코드·기간·활성 여부를 확인해 주세요.
          </p>
        </div>
      </div>
    </div>
  );
}
