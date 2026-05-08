import { NextResponse } from "next/server";

import { guardAdminApi } from "@/lib/admin-auth";
import type { ProductSlug } from "@/lib/product-data";
import { prisma } from "@/lib/db";

export async function PATCH(request: Request) {
  const denied = await guardAdminApi();
  if (denied) {
    return denied;
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "JSON 본문이 필요합니다." }, { status: 400 });
  }

  const record = body as Record<string, unknown>;
  const slug = record.slug === "sun-pack" || record.slug === "illuminator" ? (record.slug as ProductSlug) : null;
  const orderedIds = Array.isArray(record.orderedIds)
    ? record.orderedIds.filter((x): x is string => typeof x === "string")
    : null;

  if (!slug || !orderedIds || orderedIds.length === 0) {
    return NextResponse.json({ ok: false, error: "slug 및 orderedIds 배열이 필요합니다." }, { status: 400 });
  }

  const existing = await prisma.productDetailSlide.findMany({
    where: { productSlug: slug },
    select: { id: true },
  });
  const idSet = new Set(existing.map((r) => r.id));
  if (orderedIds.length !== idSet.size || orderedIds.some((id) => !idSet.has(id))) {
    return NextResponse.json({ ok: false, error: "순서 배열이 현재 슬라이드와 일치하지 않습니다." }, { status: 400 });
  }

  await prisma.$transaction(
    orderedIds.map((id, i) =>
      prisma.productDetailSlide.update({
        where: { id },
        data: { sortOrder: i },
      }),
    ),
  );

  return NextResponse.json({ ok: true });
}
