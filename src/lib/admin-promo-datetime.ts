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

/** `input type="date"` 기본값용 */
export function toLocalDateInputValue(d: Date): string {
  const x = new Date(d.getTime());
  x.setMinutes(0, 0, 0);
  x.setMilliseconds(0);
  const y = x.getFullYear();
  const m = String(x.getMonth() + 1).padStart(2, "0");
  const day = String(x.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/** 프로모션 폼: 날짜 + 시(0~23) → API용 `YYYY-MM-DDTHH:00` */
export function localDateAndHourToDatetimeLocal(dateStr: string, hourStr: string): string | null {
  const d = dateStr.trim();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(d)) return null;
  const h = Number.parseInt(String(hourStr).trim(), 10);
  if (!Number.isFinite(h) || h < 0 || h > 23) return null;
  return `${d}T${String(h).padStart(2, "0")}:00`;
}

export function floorDateToHour(d: Date): Date {
  const x = new Date(d.getTime());
  x.setMinutes(0, 0, 0);
  x.setMilliseconds(0);
  return x;
}
