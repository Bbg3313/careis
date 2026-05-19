/** 공구캠페인 UI·API: 분 단위까지만 표시(초 숨김), 저장 시 정각(1시간 단위)으로 맞춤 */

const DISPLAY_OPTS: Intl.DateTimeFormatOptions = {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
};

export function formatPromoDateTimeKoNoSeconds(isoOrDate: string | Date): string {
  const d = typeof isoOrDate === "string" ? new Date(isoOrDate) : isoOrDate;
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString("ko-KR", DISPLAY_OPTS);
}

/** `datetime-local` 기본값용 — 브라우저 현지 기준, 분·초·ms 는 0 */
export function toLocalDatetimeLocalHourString(d: Date): string {
  const x = new Date(d.getTime());
  x.setMinutes(0, 0, 0);
  x.setMilliseconds(0);
  const y = x.getFullYear();
  const m = String(x.getMonth() + 1).padStart(2, "0");
  const day = String(x.getDate()).padStart(2, "0");
  const h = String(x.getHours()).padStart(2, "0");
  return `${y}-${m}-${day}T${h}:00`;
}

export function floorDateToHour(d: Date): Date {
  const x = new Date(d.getTime());
  x.setMinutes(0, 0, 0);
  x.setMilliseconds(0);
  return x;
}
