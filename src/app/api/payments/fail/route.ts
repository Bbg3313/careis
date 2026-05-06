import { NextResponse } from "next/server";

import { failOrderPayment } from "@/lib/orders";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Record<string, unknown>;
    const order = await failOrderPayment({
      orderNumber: String(body.orderNumber ?? ""),
      code: body.code ? String(body.code) : null,
      message: body.message ? String(body.message) : null,
      payload: JSON.stringify(body),
    });

    return NextResponse.json({
      ok: true,
      orderNumber: order.orderNumber,
      paymentStatus: order.paymentStatus,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "결제 실패 처리에 실패했습니다.",
      },
      { status: 400 },
    );
  }
}
