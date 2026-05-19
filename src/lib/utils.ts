export function formatCurrency(amount: number) {
  return new Intl.NumberFormat("ko-KR", {
    style: "currency",
    currency: "KRW",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

const KST: Intl.DateTimeFormatOptions = {
  timeZone: "Asia/Seoul",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
};

/** 주문·관리 화면용: DB UTC 시각을 **한국(Asia/Seoul)** 달력·24시로 표시 */
export function formatDate(date: Date | string) {
  const d = new Date(date);
  if (!Number.isFinite(d.getTime())) return "—";
  return new Intl.DateTimeFormat("ko-KR", KST).format(d);
}
