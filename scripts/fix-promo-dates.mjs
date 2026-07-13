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
const startsAt = new Date(Date.now() - 60_000);
const endsAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

try {
  for (const code of ["sin", "test_49_140"]) {
    const row = await p.promoCampaign.update({
      where: { code },
      data: { startsAt, endsAt, isActive: true },
    });
    console.log("updated", code, row.startsAt.toISOString(), "→", row.endsAt.toISOString());
  }
} finally {
  await p.$disconnect();
}
