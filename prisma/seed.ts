import { PrismaClient, ProductStatus, PromoDiscountType } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.product.upsert({
    where: { slug: "sun-pack" },
    update: {
      name: "심플스틱 선팩",
      shortName: "선팩",
      tagline: "한 번의 밀착, 오래가는 보호",
      description: "필름막 기술을 중심으로 한 데일리 선 케어",
      sku: "CAREIS-SUNPACK-001",
      price: 59000,
      status: ProductStatus.ACTIVE,
    },
    create: {
      name: "심플스틱 선팩",
      shortName: "선팩",
      tagline: "한 번의 밀착, 오래가는 보호",
      description: "필름막 기술을 중심으로 한 데일리 선 케어",
      sku: "CAREIS-SUNPACK-001",
      slug: "sun-pack",
      price: 59000,
      status: ProductStatus.ACTIVE,
    },
  });

  await prisma.product.upsert({
    where: { slug: "illuminator" },
    update: {
      name: "일루미네이터 시스테아민 5%",
      shortName: "일루미네이터",
      tagline: "색소 고민을 위한 야간 집중 케어",
      description: "ODT 기술을 바탕으로 한 나이트 브라이트닝 루틴",
      sku: "CAREIS-ILLUM-001",
      price: 150000,
      status: ProductStatus.ACTIVE,
    },
    create: {
      name: "일루미네이터 시스테아민 5%",
      shortName: "일루미네이터",
      tagline: "색소 고민을 위한 야간 집중 케어",
      description: "ODT 기술을 바탕으로 한 나이트 브라이트닝 루틴",
      sku: "CAREIS-ILLUM-001",
      slug: "illuminator",
      price: 150000,
      status: ProductStatus.ACTIVE,
    },
  });

  /** 테스트 공구: 정가 대비 1만 원 할인 → 선팩 4.9만 / 일루미 14만 (?ref=test_49_140) */
  const testStarts = new Date(Date.now() - 120_000);
  const testEnds = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
  await prisma.promoCampaign.upsert({
    where: { code: "test_49_140" },
    create: {
      code: "test_49_140",
      title: "테스트 공구 (선팩 4.9만 / 일루미 14만)",
      discountType: PromoDiscountType.FIXED_PER_UNIT,
      discountValue: 10000,
      productSlugs: ["sun-pack", "illuminator"],
      startsAt: testStarts,
      endsAt: testEnds,
      isActive: true,
    },
    update: {
      title: "테스트 공구 (선팩 4.9만 / 일루미 14만)",
      discountType: PromoDiscountType.FIXED_PER_UNIT,
      discountValue: 10000,
      productSlugs: ["sun-pack", "illuminator"],
      startsAt: testStarts,
      endsAt: testEnds,
      isActive: true,
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
