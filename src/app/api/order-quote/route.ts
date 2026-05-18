import { ProductStatus } from "@prisma/client";
import { NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/db";
import { computeOrderPricing, resolveAppliedPromoCampaign } from "@/lib/promo";
import { getProductBySlug, type ProductSlug } from "@/lib/product-data";

const itemSchema = z.object({
  productSlug: z.enum(["sun-pack", "illuminator"]),
  quantity: z.coerce.number().int().min(1).max(10),
});

const quoteBodySchema = z.object({
  items: z.array(itemSchema).min(1).max(2),
  referralCode: z.string().nullable().optional(),
  couponCode: z.string().optional().or(z.literal("")),
});

export async function POST(request: Request) {
  try {
    const json = (await request.json()) as unknown;
    const body = quoteBodySchema.parse(json);

    const normalized = body.items.reduce<Array<{ productSlug: ProductSlug; quantity: number }>>((acc, row) => {
      const existing = acc.find((e) => e.productSlug === row.productSlug);
      if (existing) {
        existing.quantity = Math.min(10, existing.quantity + row.quantity);
        return acc;
      }
      acc.push({ productSlug: row.productSlug, quantity: row.quantity });
      return acc;
    }, []);

    const products = await prisma.product.findMany({
      where: {
        slug: { in: normalized.map((i) => i.productSlug) },
        status: ProductStatus.ACTIVE,
      },
    });

    if (products.length !== normalized.length) {
      return NextResponse.json({ ok: false, error: "상품을 찾을 수 없습니다." }, { status: 400 });
    }

    const campaign = await resolveAppliedPromoCampaign(
      body.couponCode?.trim() || null,
      body.referralCode ?? null,
    );
    const pricing = computeOrderPricing(normalized, products, campaign);

    const lines = pricing.lines.map((line) => {
      const meta = getProductBySlug(line.productSlug);
      return {
        ...line,
        name: meta?.name ?? line.productSlug,
        englishName: meta?.englishName ?? "",
      };
    });

    return NextResponse.json({
      ok: true,
      lines,
      listTotal: pricing.listTotal,
      totalAmount: pricing.totalAmount,
      appliedPromo: pricing.appliedPromo,
    });
  } catch (error) {
    console.error("[order-quote]", error);
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof z.ZodError ? "요청 형식이 올바르지 않습니다." : "견적을 불러오지 못했습니다.",
      },
      { status: 400 },
    );
  }
}
