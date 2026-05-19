/** 공구캠페인 UI·API: 분 단위까지만 표시(초 숨김), 저장 시 정각(1시간 단위). 입력 시각은 **한국(Asia/Seoul)** 기준으로 고정합니다. */

const SEOUL_TZ = "Asia/Seoul";

const DISPLAY_OPTS: Intl.DateTimeFormatOptions = {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
  timeZone: SEOUL_TZ,
};

export function formatPromoDateTimeKoNoSeconds(isoOrDate: string | Date): string {
  const d = typeof isoOrDate === "string" ? new Date(isoOrDate) : isoOrDate;
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString("ko-KR", DISPLAY_OPTS);
}

/** `input type="date"` 기본값용 — 브라우저 로컬 달력(레거시). 신규 폼은 `toKstDateAndHourForInput` 사용 권장 */
export function toLocalDateInputValue(d: Date): string {
  const x = new Date(d.getTime());
  x.setMinutes(0, 0, 0);
  x.setMilliseconds(0);
  const y = x.getFullYear();
  const m = String(x.getMonth() + 1).padStart(2, "0");
  const day = String(x.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/** 서울 기준 달력 날짜 + 0~23 시 (정각 저장과 맞춤) */
export function toKstDateAndHourForInput(isoOrDate: string | Date): { date: string; hour: string } {
  const d = typeof isoOrDate === "string" ? new Date(isoOrDate) : isoOrDate;
  if (Number.isNaN(d.getTime())) return { date: "", hour: "0" };
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: SEOUL_TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    hour12: false,
  }).formatToParts(d);
  const v = (t: Intl.DateTimeFormatPart["type"]) => parts.find((p) => p.type === t)?.value ?? "";
  const date = `${v("year")}-${v("month")}-${v("day")}`;
  const h = Number.parseInt(v("hour"), 10);
  return { date, hour: Number.isFinite(h) ? String(h) : "0" };
}

/**
 * 관리자가 고른 날짜·시(정각)를 **한국 시간**으로 해석한 ISO 문자열.
 * 서버(Vercel UTC)에서도 동일한 순간으로 파싱되도록 `+09:00`을 붙입니다.
 */
export function localDateAndHourToDatetimeLocal(dateStr: string, hourStr: string): string | null {
  const d = dateStr.trim();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(d)) return null;
  const h = Number.parseInt(String(hourStr).trim(), 10);
  if (!Number.isFinite(h) || h < 0 || h > 23) return null;
  return `${d}T${String(h).padStart(2, "0")}:00:00+09:00`;
}

export function floorDateToHour(d: Date): Date {
  const x = new Date(d.getTime());
  x.setMinutes(0, 0, 0);
  x.setMilliseconds(0);
  return x;
}
