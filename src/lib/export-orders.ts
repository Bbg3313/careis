import * as XLSX from "xlsx";

import { getOrders } from "@/lib/orders";
import { formatDate } from "@/lib/utils";

export async function buildOrdersWorkbook() {
  const orders = await getOrders();

  const rows = orders.flatMap((order) =>
    order.orderItems.map((item) => ({
      주문번호: order.orderNumber,
      주문일시: formatDate(order.createdAt),
      주문상태: order.paymentStatus,
      결제수단: order.paymentMethod,
      PG사: order.paymentProvider ?? "",
      결제참조값: order.paymentReference ?? "",
      고객명: order.customerName,
      연락처: order.phone,
      우편번호: order.postalCode,
      주소: order.address,
      택배사: order.carrier ?? "",
      운송장번호: order.trackingNumber ?? "",
      발송일시: order.shippedAt ? formatDate(order.shippedAt) : "",
      관리자메모: order.adminNote ?? "",
      상품명: item.productNameSnapshot,
      SKU: item.sku,
      수량: item.quantity,
      단가: item.unitPrice,
      주문금액: order.totalAmount,
      레퍼럴코드: order.referralCode ?? "",
      적용프로모: order.appliedPromoCode ?? "",
      쿠폰코드: order.couponCode ?? "",
      결제실패코드: order.paymentFailureCode ?? "",
      결제실패메시지: order.paymentFailureMessage ?? "",
      요청사항: order.memo ?? "",
    })),
  );

  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.json_to_sheet(rows);
  XLSX.utils.book_append_sheet(workbook, worksheet, "orders");

  return XLSX.write(workbook, {
    type: "buffer",
    bookType: "xlsx",
  });
}
