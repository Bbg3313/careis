import { PrismaClient } from "@prisma/client";
import { createClient } from "@supabase/supabase-js";
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

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const service = process.env.SUPABASE_SERVICE_ROLE_KEY;

const prisma = new PrismaClient();
try {
  await prisma.$queryRaw`SELECT 1`;
  const [products, orders] = await Promise.all([prisma.product.count(), prisma.order.count()]);
  console.log("db ok", { products, orders });
} catch (e) {
  console.log("db fail", e instanceof Error ? e.message : e);
} finally {
  await prisma.$disconnect();
}

const sb = createClient(url, anon);
const { data: signIn, error: signErr } = await sb.auth.signInWithPassword({
  email: "bbg3313@gmail.com",
  password: "CareisAdmin2026!",
});
console.log("auth", signErr ? signErr.message : `ok (${signIn.user?.email})`);

const admin = createClient(url, service);
const { data: buckets, error: bErr } = await admin.storage.listBuckets();
console.log("storage", bErr ? bErr.message : buckets.map((b) => `${b.name}${b.public ? " (public)" : ""}`).join(", "));
