import { NextResponse } from "next/server";

import { assertAllowedAdminEmail, getAdminSessionUser } from "@/lib/admin-auth";
import { buildOrdersWorkbook } from "@/lib/export-orders";

import { hasPublicSupabaseEnv } from "@/lib/supabase/env-public";

export async function GET() {
  const hasSupabase = hasPublicSupabaseEnv();
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
