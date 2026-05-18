import { prisma } from "@/lib/db";

export type SitePromoCountdownPayload = {
  endsAt: Date;
  title: string;
};

/** 쇼핑몰용: 진행 중이고 가장 먼저 종료되는 활성 공구 캠페인 */
export async function getSitePromoCountdown(): Promise<SitePromoCountdownPayload | null> {
  try {
    const now = new Date();
    const row = await prisma.promoCampaign.findFirst({
      where: {
        isActive: true,
        startsAt: { lte: now },
        endsAt: { gt: now },
      },
      orderBy: { endsAt: "asc" },
      select: { endsAt: true, title: true },
    });
    if (!row) return null;
    return { endsAt: row.endsAt, title: row.title };
  } catch {
    return null;
  }
}
