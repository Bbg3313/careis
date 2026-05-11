import { NextResponse } from "next/server";
import { z } from "zod";

import { guardAdminApi } from "@/lib/admin-auth";
import { deleteProductDetailObject } from "@/lib/product-detail-storage";
import { renormalizeSortOrders } from "@/lib/product-detail-slides";
import { prisma } from "@/lib/db";

type Params = { params: Promise<{ id: string }> };

const patchBodySchema = z
  .object({
    body: z.union([z.string().max(16_000), z.null()]),
  })
  .transform(({ body }) => ({
    body: body === null ? null : body.trim() === "" ? null : body.trim(),
  }));

export async function PATCH(request: Request, ctx: Params) {
  const denied = await guardAdminApi();
  if (denied) return denied;

  const { id } = await ctx.params;
  const slide = await prisma.productDetailSlide.findUnique({ where: { id } });
  if (!slide) {
    return NextResponse.json({ ok: false, error: "없는 슬라이드입니다." }, { status: 404 });
  }

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "JSON 본문이 필요합니다." }, { status: 400 });
  }

  const parsed = patchBodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "body 필드(문자열, 최대 16000자)를 확인하세요." }, { status: 400 });
  }

  const nextBody = parsed.data.body;
  await prisma.productDetailSlide.update({
    where: { id },
    data: { body: nextBody },
  });

  return NextResponse.json({ ok: true, body: nextBody });
}

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
