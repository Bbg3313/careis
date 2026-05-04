import { NextResponse } from "next/server";
import { PaymentMethod } from "@prisma/client";

import { createOrder } from "@/lib/orders";

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

    return NextResponse.json({
      ok: true,
      orderNumber: order.orderNumber,
      paymentStatus: order.paymentStatus,
      paymentMethod: order.paymentMethod,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "주문 저장에 실패했습니다.",
      },
      { status: 400 },
    );
  }
}
