import { OrderStatus } from "@prisma/client";
import { NextResponse } from "next/server";

import { confirmOrderPayment } from "@/lib/orders";
import { prisma } from "@/lib/db";
import { confirmTossPaymentOnServer, getTossSecretKey } from "@/lib/toss-payments";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Record<string, unknown>;
    const orderNumber = String(body.orderNumber ?? body.orderId ?? "").trim();
    const paymentKey = String(body.paymentKey ?? body.token ?? "").trim();

    if (!orderNumber) {
      throw new Error("주문번호가 필요합니다.");
    }

    const order = await prisma.order.findUnique({
      where: { orderNumber },
      include: { orderItems: true },
    });

    if (!order) {
      throw new Error("주문 정보를 찾을 수 없습니다.");
    }

    if (order.paymentStatus === OrderStatus.PAID) {
      return NextResponse.json({
        ok: true,
        orderNumber: order.orderNumber,
        paymentStatus: order.paymentStatus,
      });
    }

    const amount = order.totalAmount;
    if (!Number.isFinite(amount) || amount <= 0) {
      throw new Error("주문 금액이 올바르지 않습니다.");
    }

    const secret = getTossSecretKey();
    if (!secret) {
      throw new Error("토스 시크릿 키(TOSS_SECRET_KEY)가 없어 결제를 승인할 수 없습니다.");
    }

    if (!paymentKey) {
      throw new Error("paymentKey가 없습니다. 토스 결제 인증 후 리다이렉트를 확인해주세요.");
    }

    const tossResult = await confirmTossPaymentOnServer({
      paymentKey,
      orderId: orderNumber,
      amount,
    });

    const tossOrderId = typeof tossResult.orderId === "string" ? tossResult.orderId : "";
    if (tossOrderId && tossOrderId !== orderNumber) {
      throw new Error("토스 주문번호와 내부 주문번호가 일치하지 않습니다.");
    }

    const tossTotal =
      typeof tossResult.totalAmount === "number"
        ? tossResult.totalAmount
        : typeof tossResult.totalAmount === "string"
          ? Number(tossResult.totalAmount)
          : NaN;
    if (Number.isFinite(tossTotal) && tossTotal !== amount) {
      throw new Error("토스 승인 응답 금액이 주문 금액과 일치하지 않습니다.");
    }

    const updated = await confirmOrderPayment({
      orderNumber,
      amount,
      paymentMethod: order.paymentMethod,
      provider: "TOSS_PAYMENTS",
      reference: paymentKey,
      token: paymentKey,
      payload: JSON.stringify({ toss: tossResult, clientRequest: body }),
    });

    return NextResponse.json({
      ok: true,
      orderNumber: updated.orderNumber,
      paymentStatus: updated.paymentStatus,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "결제 승인 처리에 실패했습니다.",
      },
      { status: 400 },
    );
  }
}
