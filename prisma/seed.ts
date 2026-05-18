import { PrismaClient, ProductStatus } from "@prisma/client";

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
