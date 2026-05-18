import { FulfillmentStatus, OrderStatus } from "@prisma/client";

type FulfillmentRow = {
  paymentStatus: OrderStatus;
  fulfillmentStatus: FulfillmentStatus | null;
  trackingNumber: string | null;
};

/** 결제 상태 한글 (관리자 목록·대시보드) */
export function adminPaymentStatusLabel(status: OrderStatus): string {
  switch (status) {
    case OrderStatus.PENDING:
      return "결제 대기";
    case OrderStatus.PAID:
      return "결제완료";
    case OrderStatus.CANCELLED:
      return "취소";
    case OrderStatus.REFUNDED:
      return "환불";
    default:
      return String(status);
  }
}

/** 결제 + 배송을 한 줄로 (대시보드 최근 주문 등) */
export function adminOrderProgressLabel(row: FulfillmentRow): string {
  if (row.paymentStatus !== OrderStatus.PAID) {
    return adminPaymentStatusLabel(row.paymentStatus);
  }
  return `결제완료 · ${adminFulfillmentLabel(row)}`;
}

/** `fulfillment` 쿼리와 동일한 기준으로 주문 목록 필터 */
export function orderMatchesAdminFulfillmentFilter(row: FulfillmentRow, fulfillment: string | undefined): boolean {
  if (!fulfillment) return true;
  if (row.paymentStatus !== OrderStatus.PAID) return false;
  if (fulfillment === "DELIVERED") {
    return row.fulfillmentStatus === FulfillmentStatus.DELIVERED;
  }
  if (row.fulfillmentStatus === FulfillmentStatus.DELIVERED) return false;

  const hasTrack = Boolean(row.trackingNumber?.trim());
  const inTransit = row.fulfillmentStatus === FulfillmentStatus.IN_TRANSIT || hasTrack;

  if (fulfillment === "IN_TRANSIT") return inTransit;
  if (fulfillment === "AWAITING_SHIP") return !inTransit;
  return true;
}

/** 관리자 목록·상세용 배송 단계 한글 */
export function adminFulfillmentLabel(row: FulfillmentRow): string {
  if (row.paymentStatus !== OrderStatus.PAID) {
    return "—";
  }
  const f = row.fulfillmentStatus;
  if (f === FulfillmentStatus.DELIVERED) return "배송완료";
  if (f === FulfillmentStatus.IN_TRANSIT) return "배송중";
  if (f === FulfillmentStatus.AWAITING_SHIP) return "배송전";
  if (row.trackingNumber?.trim()) return "배송중";
  return "배송전";
}
