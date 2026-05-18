/**
 * 스마트택배(스윗트래커) 배송조회 API.
 * 환경변수 `SWEET_TRACKER_API_KEY` 필요 — https://tracking.sweettracker.co.kr
 */
export type SweetTrackerPollResult = {
  /** API 호출·파싱 성공 */
  httpOk: boolean;
  /** 택배사 기준 배송 완료로 판단 */
  deliveryComplete: boolean;
  /** 원본 level (있을 때) */
  level?: number | null;
  message?: string;
};

export async function fetchSweetTrackerDeliveryComplete(
  carrierCode: string,
  invoice: string,
): Promise<SweetTrackerPollResult> {
  const key = process.env.SWEET_TRACKER_API_KEY?.trim();
  if (!key) {
    return { httpOk: false, deliveryComplete: false, message: "SWEET_TRACKER_API_KEY 없음" };
  }
  const code = carrierCode.trim();
  const inv = invoice.trim();
  if (!code || !inv) {
    return { httpOk: false, deliveryComplete: false, message: "택배사코드·운송장 필요" };
  }

  const url = new URL("https://info.sweettracker.co.kr/api/v1/trackingInfo");
  url.searchParams.set("t_key", key);
  url.searchParams.set("t_code", code);
  url.searchParams.set("t_invoice", inv);

  try {
    const res = await fetch(url.toString(), { cache: "no-store" });
    const text = await res.text();
    if (!res.ok) {
      return { httpOk: false, deliveryComplete: false, message: text.slice(0, 200) };
    }
    const data = JSON.parse(text) as Record<string, unknown>;
    if (data.status === false) {
      return {
        httpOk: true,
        deliveryComplete: false,
        message: String(data.msg ?? "조회 실패"),
      };
    }
    const complete = Boolean(data.complete);
    const levelRaw = data.level;
    const level = typeof levelRaw === "number" ? levelRaw : Number(levelRaw);
    const levelNum = Number.isFinite(level) ? level : null;
    const deliveryComplete = complete || (levelNum != null && levelNum >= 6);
    return { httpOk: true, deliveryComplete, level: levelNum };
  } catch (e) {
    return {
      httpOk: false,
      deliveryComplete: false,
      message: e instanceof Error ? e.message : "fetch_error",
    };
  }
}
