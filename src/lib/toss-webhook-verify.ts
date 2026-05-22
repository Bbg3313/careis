import { createHmac, timingSafeEqual } from "node:crypto";

/** 보안키가 64자 hex이면 바이트로 디코드(토스 문서 권장), 아니면 UTF-8 바이트 */
function tossSecurityKeyBytes(secret: string): Buffer {
  const t = secret.trim();
  if (/^[0-9a-fA-F]{64}$/.test(t)) {
    return Buffer.from(t, "hex");
  }
  return Buffer.from(t, "utf8");
}

/**
 * `tosspayments-webhook-signature` 헤더가 있을 때만 검증합니다.
 * 일부 결제 웹훅은 문서상 서명 헤더가 없을 수 있어, 헤더가 없으면 통과합니다.
 * @see https://docs.tosspayments.com/reference/using-api/webhook-events
 */
export function verifyTossWebhookSignatureIfPresent(params: {
  rawBody: string;
  transmissionTime: string | null;
  signatureHeader: string | null;
  securityKey: string;
}): { ok: true } | { ok: false; reason: string } {
  const { rawBody, transmissionTime, signatureHeader, securityKey } = params;

  if (!signatureHeader?.trim() || !transmissionTime?.trim()) {
    return { ok: true };
  }

  const key = tossSecurityKeyBytes(securityKey);
  const expected = createHmac("sha256", key).update(`${rawBody}:${transmissionTime}`).digest();

  const parts = signatureHeader
    .split(",")
    .map((p) => p.trim())
    .filter(Boolean);

  for (const part of parts) {
    const m = /^v1:(.+)$/.exec(part);
    if (!m?.[1]) continue;
    let decoded: Buffer;
    try {
      decoded = Buffer.from(m[1], "base64");
    } catch {
      continue;
    }
    if (decoded.length === expected.length && timingSafeEqual(decoded, expected)) {
      return { ok: true };
    }
  }

  return { ok: false, reason: "웹훅 서명이 일치하지 않습니다." };
}
