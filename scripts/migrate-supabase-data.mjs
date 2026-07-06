/**
 * Old Supabase → new project (qzndymsotizutpffnyey) data migration.
 * Run: npx tsx scripts/migrate-supabase-data.mjs
 */
import { PrismaClient } from "@prisma/client";
import { readFileSync } from "fs";

function loadEnvFile() {
  const out = {};
  try {
    for (const line of readFileSync(".env", "utf8").split("\n")) {
      const m = line.match(/^([^#=]+)=(.*)$/);
      if (!m) continue;
      const k = m[1].trim();
      let v = m[2].trim();
      if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
        v = v.slice(1, -1);
      }
      out[k] = v;
    }
  } catch {
    /* ignore */
  }
  return out;
}

const envFile = loadEnvFile();

const OLD_DB = envFile.DATABASE_URL ?? process.env.OLD_DATABASE_URL;
const NEW_DB =
  process.env.NEW_DATABASE_URL ??
  "postgresql://postgres.qzndymsotizutpffnyey:thrhrl92%21%21%21@aws-1-ap-southeast-1.pooler.supabase.com:5432/postgres";

const OLD_URL = "https://tnmrgpgiuarxlquqwaiq.supabase.co";
const NEW_URL = "https://qzndymsotizutpffnyey.supabase.co";

if (!OLD_DB?.includes("tnmrgpgiuarxlquqwaiq")) {
  console.error("Expected OLD DATABASE_URL to point at tnmrgpgiuarxlquqwaiq");
  process.exit(1);
}

const oldDb = new PrismaClient({ datasources: { db: { url: OLD_DB } } });
const newDb = new PrismaClient({ datasources: { db: { url: NEW_DB } } });

async function main() {
  const [products, slides, orders, promos, orderItems] = await Promise.all([
    oldDb.product.findMany(),
    oldDb.productDetailSlide.findMany({ orderBy: [{ productSlug: "asc" }, { sortOrder: "asc" }] }),
    oldDb.order.findMany({ include: { orderItems: true }, orderBy: { createdAt: "asc" } }),
    oldDb.promoCampaign.findMany(),
    oldDb.orderItem.findMany(),
  ]);

  console.log("export", {
    products: products.length,
    slides: slides.length,
    orders: orders.length,
    promos: promos.length,
    orderItems: orderItems.length,
  });

  // Clear new DB (order matters for FK)
  await newDb.orderItem.deleteMany();
  await newDb.order.deleteMany();
  await newDb.productDetailSlide.deleteMany();
  await newDb.promoCampaign.deleteMany();
  await newDb.product.deleteMany();

  for (const product of products) {
    await newDb.product.create({ data: product });
  }

  for (const slide of slides) {
    const url = slide.url.replace(OLD_URL, NEW_URL);
    await newDb.productDetailSlide.create({ data: { ...slide, url } });
  }

  for (const promo of promos) {
    await newDb.promoCampaign.create({ data: promo });
  }

  for (const order of orders) {
    const { orderItems, ...rest } = order;
    await newDb.order.create({ data: rest });
    for (const item of orderItems) {
      await newDb.orderItem.create({ data: item });
    }
  }

  console.log("import done");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await oldDb.$disconnect();
    await newDb.$disconnect();
  });
