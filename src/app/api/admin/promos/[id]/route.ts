import { NextResponse } from "next/server";
import { z } from "zod";

import { guardAdminApi } from "@/lib/admin-auth";
import { updatePromoCampaignPartial } from "@/lib/promo";
import type { ProductSlug } from "@/lib/product-data";

const patchSchema = z.object({
  isActive: z.boolean().optional(),
  title: z.string().min(1).max(120).optional(),
  endsAt: z.string().min(1).optional(),
  discountValue: z.coerce.number().int().positive().optional(),
  productSlugs: z.array(z.enum(["sun-pack", "illuminator"])).min(1).optional(),
});

type Params = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, ctx: Params) {
  const denied = await guardAdminApi();
  if (denied) return denied;

  const { id } = await ctx.params;
  if (!id) {
    return NextResponse.json({ ok: false, error: "id가 필요합니다." }, { status: 400 });
  }

  try {
    const body = patchSchema.parse(await request.json());
    const patch: Parameters<typeof updatePromoCampaignPartial>[1] = {};
    if (typeof body.isActive === "boolean") patch.isActive = body.isActive;
    if (body.title != null) patch.title = body.title;
    if (body.discountValue != null) patch.discountValue = body.discountValue;
    if (body.productSlugs != null) patch.productSlugs = body.productSlugs as ProductSlug[];
    if (body.endsAt != null) {
      const d = new Date(body.endsAt);
      if (Number.isNaN(d.getTime())) {
        return NextResponse.json({ ok: false, error: "종료일시 형식이 올바르지 않습니다." }, { status: 400 });
      }
      patch.endsAt = d;
    }

    const campaign = await updatePromoCampaignPartial(id, patch);
    return NextResponse.json({ ok: true, campaign });
  } catch (error) {
    const message = error instanceof Error ? error.message : "수정에 실패했습니다.";
    return NextResponse.json({ ok: false, error: message }, { status: 400 });
  }
}
