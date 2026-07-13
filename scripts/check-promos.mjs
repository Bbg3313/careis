import { PrismaClient } from "@prisma/client";
import { readFileSync } from "fs";

function loadEnv() {
  for (const line of readFileSync(".env", "utf8").split("\n")) {
    const m = line.match(/^([^#=]+)=(.*)$/);
    if (!m) continue;
    let v = m[2].trim().replace(/^["']|["']$/g, "");
    process.env[m[1].trim()] = v;
  }
}
loadEnv();

const p = new PrismaClient();
try {
  const promos = await p.promoCampaign.findMany({ orderBy: { startsAt: "desc" } });
  console.log(
    "PROMOS",
    JSON.stringify(
      promos.map((c) => ({
        code: c.code,
        title: c.title,
        type: c.discountType,
        value: c.discountValue,
        active: c.isActive,
        startsAt: c.startsAt.toISOString(),
        endsAt: c.endsAt.toISOString(),
        productSlugs: c.productSlugs,
        nowInRange: c.startsAt <= new Date() && c.endsAt >= new Date(),
      })),
      null,
      2,
    ),
  );

  const [orders, products, slides] = await Promise.all([
    p.order.count(),
    p.product.count(),
    p.productDetailSlide.count(),
  ]);
  console.log("COUNTS", { orders, products, slides });
} finally {
  await p.$disconnect();
}
