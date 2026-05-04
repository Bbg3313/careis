import { NextResponse } from "next/server";

import { buildOrdersWorkbook } from "@/lib/export-orders";

export async function GET() {
  const buffer = await buildOrdersWorkbook();

  return new NextResponse(buffer, {
    status: 200,
    headers: {
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": 'attachment; filename="careis-orders.xlsx"',
    },
  });
}
