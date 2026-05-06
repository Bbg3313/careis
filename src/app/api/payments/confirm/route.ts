import { PaymentMethod } from "@prisma/client";
import { NextResponse } from "next/server";

import { confirmOrderPayment } from "@/lib/orders";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Record<string, unknown>;
    const order = await confirmOrderPayment({
      orderNumber: String(body.orderNumber ?? ""),
      amount: Number(body.amount ?? 0),
      paymentMethod: String(body.paymentMethod ?? "CREDIT_CARD") as PaymentMethod,
      provider: String(body.provider ?? "EXTERNAL_PG"),
      reference: body.reference ? String(body.reference) : null,
      token: body.token ? String(body.token) : null,
      payload: JSON.stringify(body),
    });

    return NextResponse.json({
      ok: true,
      orderNumber: order.orderNumber,
      paymentStatus: order.paymentStatus,
      paidAt: order.paidAt,
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
