import { FulfillmentStatus, OrderStatus } from "@prisma/client";

type FulfillmentRow = {
  paymentStatus: OrderStatus;
  fulfillmentStatus: FulfillmentStatus | null;
  trackingNumber: string | null;
};

/** 관리자 목록·상세용 배송 단계 한글 */
export function adminFulfillmentLabel(row: FulfillmentRow): string {
  if (row.paymentStatus !== OrderStatus.PAID) {
    return "—";
  }
  const f = row.fulfillmentStatus;
  if (f === FulfillmentStatus.DELIVERED) return "배송완료";
  if (f === FulfillmentStatus.IN_TRANSIT) return "배송중";
  if (f === FulfillmentStatus.AWAITING_SHIP) return "발송준비";
  if (row.trackingNumber?.trim()) return "배송중";
  return "발송준비";
}
