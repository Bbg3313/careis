import type { Order, OrderItem, PaymentMethod } from "@prisma/client";
import * as XLSX from "xlsx";

import { adminFulfillmentLabel, adminPaymentStatusLabel } from "@/lib/admin-fulfillment";
import { formatDate } from "@/lib/utils";

export type OrderWithItems = Order & { orderItems: OrderItem[] };

const EXPORT_HEADERS = [
  "주문번호",
  "주문일시",
  "주문상태",
  "결제수단",
  "배송단계",
  "상품명",
  "수량",
  "단가",
  "주문금액",
  "레퍼럴코드",
  "고객명",
  "연락처",
  "우편번호",
  "주소",
  "요청사항",
] as const;

function paymentMethodLabel(method: PaymentMethod): string {
  switch (method) {
    case "CREDIT_CARD":
      return "신용카드";
    case "NAVER_PAY":
      return "네이버페이";
    case "TOSS_PAY":
      return "토스페이";
    case "KAKAO_PAY":
      return "카카오페이";
    default:
      return String(method);
  }
}

export async function buildOrdersWorkbook(orders: OrderWithItems[]) {
  const rows = orders.flatMap((order) =>
    order.orderItems.map((item) => ({
      주문번호: order.orderNumber,
      주문일시: formatDate(order.createdAt),
      주문상태: adminPaymentStatusLabel(order.paymentStatus),
      결제수단: paymentMethodLabel(order.paymentMethod),
      배송단계: adminFulfillmentLabel(order),
      상품명: item.productNameSnapshot,
      수량: item.quantity,
      단가: item.unitPrice,
      주문금액: item.unitPrice * item.quantity,
      레퍼럴코드: order.referralCode ?? "",
      고객명: order.customerName,
      연락처: order.phone,
      우편번호: order.postalCode,
      주소: order.address,
      요청사항: order.memo ?? "",
    })),
  );

  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.json_to_sheet(rows, {
    header: [...EXPORT_HEADERS],
  });
  XLSX.utils.book_append_sheet(workbook, worksheet, "orders");

  return XLSX.write(workbook, {
    type: "buffer",
    bookType: "xlsx",
  }) as Buffer;
}
