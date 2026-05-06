import { PaymentMethod } from "@prisma/client";
import { NextResponse } from "next/server";

import { confirmOrderPayment, failOrderPayment, refundOrderPayment } from "@/lib/orders";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Record<string, unknown>;
    const eventType = String(body.eventType ?? body.type ?? "");
    const orderNumber = String(body.orderNumber ?? body.orderId ?? "");

    if (!orderNumber) {
      throw new Error("orderNumber가 필요합니다.");
    }

    if (eventType === "payment.approved") {
      await confirmOrderPayment({
        orderNumber,
        amount: Number(body.amount ?? 0),
        paymentMethod: String(body.paymentMethod ?? "CREDIT_CARD") as PaymentMethod,
        provider: String(body.provider ?? "EXTERNAL_PG"),
        reference: body.reference ? String(body.reference) : null,
        token: body.token ? String(body.token) : null,
        payload: JSON.stringify(body),
      });
    } else if (eventType === "payment.refunded") {
      await refundOrderPayment(orderNumber, JSON.stringify(body));
    } else {
      await failOrderPayment({
        orderNumber,
        code: body.code ? String(body.code) : eventType || "PAYMENT_FAILED",
        message: body.message ? String(body.message) : "결제가 취소되었거나 승인되지 않았습니다.",
        payload: JSON.stringify(body),
      });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "웹훅 처리에 실패했습니다.",
      },
      { status: 400 },
    );
  }
}
