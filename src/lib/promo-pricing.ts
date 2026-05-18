import type { Product, PromoCampaign } from "@prisma/client";

import type { ProductSlug } from "@/lib/product-data";

export function parseCampaignProductSlugs(json: unknown): ProductSlug[] {
  if (!Array.isArray(json)) return [];
  return json.filter((x): x is ProductSlug => x === "sun-pack" || x === "illuminator");
}

function unitPriceForSlug(listPrice: number, slug: ProductSlug, campaign: PromoCampaign): number {
  const allowed = parseCampaignProductSlugs(campaign.productSlugs);
  if (!allowed.includes(slug)) {
    return listPrice;
  }

  if (campaign.discountType === "PERCENT") {
    const pct = campaign.discountValue;
    if (pct < 1 || pct > 99) return listPrice;
    return Math.max(0, Math.floor((listPrice * (100 - pct)) / 100));
  }

  const off = campaign.discountValue;
  if (off < 0) return listPrice;
  return Math.max(0, listPrice - off);
}

export type OrderPricingLine = {
  productSlug: ProductSlug;
  quantity: number;
  listUnitPrice: number;
  unitPrice: number;
  lineTotal: number;
};

export type OrderPricingResult = {
  lines: OrderPricingLine[];
  listTotal: number;
  totalAmount: number;
  appliedPromo: { code: string; title: string } | null;
};

export function computeOrderPricing(
  items: Array<{ productSlug: ProductSlug; quantity: number }>,
  dbProducts: Product[],
  campaign: PromoCampaign | null,
): OrderPricingResult {
  const lines: OrderPricingLine[] = [];
  let listTotal = 0;
  let totalAmount = 0;

  for (const item of items) {
    const product = dbProducts.find((p) => p.slug === item.productSlug);
    if (!product) continue;
    const listUnitPrice = product.price;
    const unitPrice = campaign ? unitPriceForSlug(listUnitPrice, item.productSlug, campaign) : listUnitPrice;
    const lineList = listUnitPrice * item.quantity;
    const lineTotal = unitPrice * item.quantity;
    listTotal += lineList;
    totalAmount += lineTotal;
    lines.push({
      productSlug: item.productSlug,
      quantity: item.quantity,
      listUnitPrice,
      unitPrice,
      lineTotal,
    });
  }

  return {
    lines,
    listTotal,
    totalAmount,
    appliedPromo: campaign ? { code: campaign.code, title: campaign.title } : null,
  };
}
