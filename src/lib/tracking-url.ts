/** 네이버 통합검색으로 송장 조회 (택배사 API 없이 최소 구현) */
export function trackingLookupUrl(carrier: string | null | undefined, trackingNumber: string | null | undefined) {
  const n = trackingNumber?.trim();
  if (!n) return null;
  const q = [carrier?.trim(), n].filter(Boolean).join(" ");
  return `https://search.naver.com/search.naver?where=nexearch&sm=top_hty&fbm=0&ie=utf8&query=${encodeURIComponent(q)}`;
}
