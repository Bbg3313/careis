import { PaymentMethod } from "@prisma/client";
import { NextResponse } from "next/server";

import { buildPaymentSession, getRequestOrigin } from "@/lib/payment-gateway";
import { createOrder, setOrderPaymentRequested } from "@/lib/orders";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Record<string, unknown>;
    const order = await createOrder({
      productSlug: String(body.productSlug ?? "") as "sun-pack" | "illuminator",
      quantity: Number(body.quantity ?? 1),
      customerName: String(body.customerName ?? ""),
      phone: String(body.phone ?? ""),
      postalCode: String(body.postalCode ?? ""),
      address: String(body.address ?? ""),
      memo: String(body.memo ?? ""),
      couponCode: String(body.couponCode ?? ""),
      paymentMethod: String(body.paymentMethod ?? "CREDIT_CARD") as PaymentMethod,
      referralCode: body.referralCode ? String(body.referralCode) : null,
    });

    const requestOrigin = getRequestOrigin(request);
    const paymentSession = buildPaymentSession({
      orderNumber: order.orderNumber,
      amount: order.totalAmount,
      customerName: order.customerName,
      phone: order.phone,
      paymentMethod: order.paymentMethod,
      referralCode: order.referralCode,
      couponCode: order.couponCode,
      requestOrigin,
    });

    await setOrderPaymentRequested(order.orderNumber, {
      provider: paymentSession.provider,
      payload: JSON.stringify(paymentSession),
    });

    return NextResponse.json({
      ok: true,
      orderNumber: order.orderNumber,
      paymentStatus: order.paymentStatus,
      paymentMethod: order.paymentMethod,
      paymentSession,
      nextAction: {
        type: "REDIRECT",
        url: `/payment/checkout?orderNumber=${encodeURIComponent(order.orderNumber)}`,
      },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "결제 준비에 실패했습니다.",
      },
      { status: 400 },
    );
  }
}
