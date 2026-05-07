import { NextResponse } from "next/server";

import { assertAllowedAdminEmail, getAdminSessionUser } from "@/lib/admin-auth";
import { buildOrdersWorkbook } from "@/lib/export-orders";

export async function GET() {
  const hasSupabase = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim(),
  );
  if (hasSupabase) {
    const user = await getAdminSessionUser();
    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    try {
      assertAllowedAdminEmail(user);
    } catch {
      return new NextResponse("Forbidden", { status: 403 });
    }
  }

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
