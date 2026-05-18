import type { Order } from "@prisma/client";

/** 관리자 목록용: 공구·레퍼럴·쿠폰 입력을 한 줄로 */
export function inflowSummary(order: Pick<Order, "appliedPromoCode" | "referralCode" | "couponCode">): string {
  const parts: string[] = [];
  if (order.appliedPromoCode) parts.push(`공구:${order.appliedPromoCode}`);
  if (order.referralCode) parts.push(`ref:${order.referralCode}`);
  if (order.couponCode?.trim()) {
    const c = order.couponCode.trim().toLowerCase();
    if (c !== (order.appliedPromoCode ?? "").toLowerCase()) {
      parts.push(`쿠폰:${order.couponCode.trim()}`);
    }
  }
  return parts.length > 0 ? parts.join(" · ") : "—";
}
