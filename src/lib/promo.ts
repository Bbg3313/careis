import type { Prisma, PromoCampaign, PromoDiscountType } from "@prisma/client";

import { prisma } from "@/lib/db";
import type { ProductSlug } from "@/lib/product-data";
import { sanitizeReferralCode } from "@/lib/referral";

export { computeOrderPricing } from "@/lib/promo-pricing";
export type { OrderPricingLine, OrderPricingResult } from "@/lib/promo-pricing";

export async function findActivePromoByCode(code: string | null | undefined, at = new Date()) {
  const normalized = sanitizeReferralCode(code);
  if (!normalized) return null;

  try {
    return prisma.promoCampaign.findFirst({
      where: {
        code: normalized,
        isActive: true,
        startsAt: { lte: at },
        endsAt: { gte: at },
      },
    });
  } catch {
    return null;
  }
}

/** 쿠폰 입력이 있으면 우선 매칭, 없거나 미매칭이면 레퍼럴 코드로 매칭 */
export async function resolveAppliedPromoCampaign(
  couponCode: string | null | undefined,
  referralCode: string | null | undefined,
  at = new Date(),
): Promise<PromoCampaign | null> {
  const couponNorm = sanitizeReferralCode(couponCode);
  if (couponNorm) {
    const hit = await findActivePromoByCode(couponNorm, at);
    if (hit) return hit;
  }
  return findActivePromoByCode(referralCode, at);
}

export async function listPromoCampaignsAdmin() {
  return prisma.promoCampaign.findMany({
    orderBy: { startsAt: "desc" },
  });
}

export type CreatePromoCampaignInput = {
  code: string;
  title: string;
  discountType: PromoDiscountType;
  discountValue: number;
  productSlugs: ProductSlug[];
  startsAt: Date;
  endsAt: Date;
  isActive?: boolean;
};

export async function createPromoCampaign(input: CreatePromoCampaignInput) {
  const code = sanitizeReferralCode(input.code);
  if (!code) {
    throw new Error("프로모 코드가 비어 있습니다.");
  }
  if (input.endsAt <= input.startsAt) {
    throw new Error("종료일시는 시작일시보다 이후여야 합니다.");
  }
  if (input.productSlugs.length === 0) {
    throw new Error("적용 상품을 1개 이상 선택해주세요.");
  }
  if (input.discountType === "PERCENT") {
    if (input.discountValue < 1 || input.discountValue > 99) {
      throw new Error("정률 할인은 1~99% 사이여야 합니다.");
    }
  } else if (input.discountValue < 1) {
    throw new Error("정액 할인은 1원 이상이어야 합니다.");
  }

  const productSlugs = input.productSlugs as unknown as Prisma.InputJsonValue;

  return prisma.promoCampaign.create({
    data: {
      code,
      title: input.title.trim(),
      discountType: input.discountType,
      discountValue: input.discountValue,
      productSlugs,
      startsAt: input.startsAt,
      endsAt: input.endsAt,
      isActive: input.isActive ?? true,
    },
  });
}

export async function updatePromoCampaignPartial(
  id: string,
  patch: Partial<Pick<PromoCampaign, "isActive" | "title" | "endsAt" | "discountValue">> & {
    productSlugs?: ProductSlug[];
  },
) {
  const data: Prisma.PromoCampaignUpdateInput = {};
  if (typeof patch.isActive === "boolean") data.isActive = patch.isActive;
  if (patch.title != null) data.title = patch.title.trim();
  if (patch.endsAt != null) data.endsAt = patch.endsAt;
  if (patch.discountValue != null) data.discountValue = patch.discountValue;
  if (patch.productSlugs != null) {
    data.productSlugs = patch.productSlugs as unknown as Prisma.InputJsonValue;
  }
  return prisma.promoCampaign.update({
    where: { id },
    data,
  });
}
