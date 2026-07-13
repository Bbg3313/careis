import { formatCurrency } from "@/lib/utils";

/** 단순 변심 환불 시 차감하는 배송비(원) — 발송 후 반품 */
export const CHANGE_OF_MIND_SHIPPING_FEE = 6_000;

export function formatChangeOfMindShippingFee() {
  return formatCurrency(CHANGE_OF_MIND_SHIPPING_FEE);
}

/** 결제금액에서 단순변심 배송비를 뺀 환불액. 결제액이 배송비 이하면 0 */
export function refundAmountAfterChangeOfMindFee(paidAmount: number): number {
  const paid = Math.max(0, Math.floor(paidAmount));
  return Math.max(0, paid - CHANGE_OF_MIND_SHIPPING_FEE);
}

export type RefundReasonCategory = "change_of_mind" | "defect";

export function refundReasonCategoryLabel(category: RefundReasonCategory): string {
  return category === "change_of_mind" ? "단순 변심" : "상품 하자·오배송";
}

export function parseRefundReasonCategory(value: FormDataEntryValue | string | null | undefined): RefundReasonCategory {
  return String(value ?? "").trim() === "defect" ? "defect" : "change_of_mind";
}
