import { NextResponse } from "next/server";

import { guardAdminApi } from "@/lib/admin-auth";
import type { ProductSlug } from "@/lib/product-data";
import { listDetailSlidesAdmin } from "@/lib/product-detail-slides";

export async function GET(request: Request) {
  const denied = await guardAdminApi();
  if (denied) {
    return denied;
  }

  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug");
  if (slug !== "sun-pack" && slug !== "illuminator") {
    return NextResponse.json({ ok: false, error: "slug 파라미터가 필요합니다." }, { status: 400 });
  }

  const slides = await listDetailSlidesAdmin(slug as ProductSlug);
  return NextResponse.json({ ok: true, slides });
}
