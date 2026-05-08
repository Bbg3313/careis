import { NextResponse } from "next/server";

import { guardAdminApi } from "@/lib/admin-auth";
import { deleteProductDetailObject } from "@/lib/product-detail-storage";
import { renormalizeSortOrders } from "@/lib/product-detail-slides";
import { prisma } from "@/lib/db";

type Params = { params: Promise<{ id: string }> };

export async function DELETE(_request: Request, ctx: Params) {
  const denied = await guardAdminApi();
  if (denied) {
    return denied;
  }

  const { id } = await ctx.params;
  const slide = await prisma.productDetailSlide.findUnique({ where: { id } });
  if (!slide) {
    return NextResponse.json({ ok: false, error: "없는 슬라이드입니다." }, { status: 404 });
  }

  await deleteProductDetailObject(slide.url);
  if (slide.posterUrl) {
    await deleteProductDetailObject(slide.posterUrl);
  }

  await prisma.productDetailSlide.delete({ where: { id } });
  await renormalizeSortOrders(slide.productSlug);

  return NextResponse.json({ ok: true });
}
