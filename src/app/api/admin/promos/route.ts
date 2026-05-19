import { PromoDiscountType } from "@prisma/client";
import { NextResponse } from "next/server";
import { z } from "zod";

import { guardAdminApi } from "@/lib/admin-auth";
import { floorDateToHour } from "@/lib/admin-promo-datetime";
import { createPromoCampaign, listPromoCampaignsAdmin } from "@/lib/promo";
import type { ProductSlug } from "@/lib/product-data";

const createBodySchema = z.object({
  code: z.string().min(2).max(40),
  title: z.string().min(1).max(120),
  discountType: z.nativeEnum(PromoDiscountType),
  discountValue: z.coerce.number().int(),
  productSlugs: z.array(z.enum(["sun-pack", "illuminator"])).min(1),
  startsAt: z.string().min(1),
  endsAt: z.string().min(1),
  isActive: z.coerce.boolean().optional(),
});

export async function GET() {
  const denied = await guardAdminApi();
  if (denied) return denied;

  const campaigns = await listPromoCampaignsAdmin();
  return NextResponse.json({ ok: true, campaigns });
}

export async function POST(request: Request) {
  const denied = await guardAdminApi();
  if (denied) return denied;

  try {
    const body = createBodySchema.parse(await request.json());
    const startsAt = floorDateToHour(new Date(body.startsAt));
    const endsAt = floorDateToHour(new Date(body.endsAt));
    if (Number.isNaN(startsAt.getTime()) || Number.isNaN(endsAt.getTime())) {
      return NextResponse.json({ ok: false, error: "날짜 형식이 올바르지 않습니다." }, { status: 400 });
    }

    const campaign = await createPromoCampaign({
      code: body.code,
      title: body.title,
      discountType: body.discountType,
      discountValue: body.discountValue,
      productSlugs: body.productSlugs as ProductSlug[],
      startsAt,
      endsAt,
      isActive: body.isActive,
    });

    return NextResponse.json({ ok: true, campaign });
  } catch (error) {
    const message = error instanceof Error ? error.message : "생성에 실패했습니다.";
    return NextResponse.json({ ok: false, error: message }, { status: 400 });
  }
}
