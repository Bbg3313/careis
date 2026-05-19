import { OrderStatus, type Prisma, type PromoCampaign, type PromoDiscountType } from "@prisma/client";
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

/** 상단 공구 타이머: 기간 내 활성 캠페인 전부 (코드별 1줄씩) */
export async function findAllActivePromoCampaigns(at = new Date()) {
  try {
    return prisma.promoCampaign.findMany({
      where: {
        isActive: true,
        startsAt: { lte: at },
        endsAt: { gte: at },
      },
      orderBy: [{ endsAt: "asc" }, { code: "asc" }],
    });
  } catch {
    return [];
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

/** 대시보드: `appliedPromoCode`별 결제 완료 건수·합계 */
export async function aggregatePaidOrdersByAppliedPromoCode(): Promise<
  Map<string, { paidCount: number; totalPaidAmount: number }>
> {
  try {
    const rows = await prisma.order.groupBy({
      by: ["appliedPromoCode"],
      where: {
        paymentStatus: OrderStatus.PAID,
        appliedPromoCode: { not: null },
      },
      _count: { _all: true },
      _sum: { totalAmount: true },
    });
    const map = new Map<string, { paidCount: number; totalPaidAmount: number }>();
    for (const r of rows) {
      const code = r.appliedPromoCode;
      if (!code) continue;
      map.set(code, {
        paidCount: r._count._all,
        totalPaidAmount: r._sum.totalAmount ?? 0,
      });
    }
    return map;
  } catch {
    return new Map();
  }
}

/** 공구 코드가 주문에 `appliedPromoCode`로 박힌 결제 완료 건만 집계 */
export async function loadAdminPromoPaidPerformance(campaignId: string): Promise<
  | {
      ok: true;
      campaign: PromoCampaign;
      paidCount: number;
      totalPaidAmount: number;
      orders: Prisma.OrderGetPayload<{ include: { orderItems: true } }>[];
    }
  | { ok: false; reason: "not_found" | "db" }
> {
  try {
    const campaign = await prisma.promoCampaign.findUnique({
      where: { id: campaignId },
    });
    if (!campaign) return { ok: false, reason: "not_found" };

    const wherePaidApplied = {
      paymentStatus: OrderStatus.PAID,
      appliedPromoCode: campaign.code,
    };

    const [agg, orders] = await Promise.all([
      prisma.order.aggregate({
        where: wherePaidApplied,
        _sum: { totalAmount: true },
        _count: { _all: true },
      }),
      prisma.order.findMany({
        where: wherePaidApplied,
        orderBy: [{ paidAt: "desc" }, { createdAt: "desc" }],
        include: { orderItems: true },
      }),
    ]);

    return {
      ok: true,
      campaign,
      paidCount: agg._count._all,
      totalPaidAmount: agg._sum.totalAmount ?? 0,
      orders,
    };
  } catch (error) {
    console.error("[promo] loadAdminPromoPaidPerformance failed", error);
    return { ok: false, reason: "db" };
  }
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
