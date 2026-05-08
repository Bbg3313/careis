/** 휴대폰 번호: 숫자만 입력해도 010-1234-5678 형태로 표시 (최대 11자리) */
export function formatKoreanMobileInput(raw: string): string {
  const d = raw.replace(/\D/g, "").slice(0, 11);
  if (d.length <= 3) return d;
  if (d.length <= 7) return `${d.slice(0, 3)}-${d.slice(3)}`;
  return `${d.slice(0, 3)}-${d.slice(3, 7)}-${d.slice(7)}`;
}

/** 저장된 값(숫자만 또는 하이픈 포함)을 동일 규칙으로 표시 */
export function formatKoreanMobileDisplay(value: string): string {
  if (!value.trim()) return value;
  return formatKoreanMobileInput(value);
}
