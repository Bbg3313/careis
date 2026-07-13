import { PrismaClient } from "@prisma/client";
import { readFileSync } from "fs";

for (const line of readFileSync(".env", "utf8").split("\n")) {
  const m = line.match(/^([^#=]+)=(.*)$/);
  if (!m) continue;
  process.env[m[1].trim()] = m[2].trim().replace(/^["']|["']$/g, "");
}

const p = new PrismaClient();
try {
  const c = await p.order.count();
  console.log("order count", c);
  const codes = await p.order.findMany({
    where: { referralCode: { not: null } },
    distinct: ["referralCode"],
    select: { referralCode: true },
    take: 5,
  });
  console.log("sample inflow", codes.map((x) => x.referralCode));
} finally {
  await p.$disconnect();
}
