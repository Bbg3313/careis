import { execSync } from "node:child_process";

const dbUrl = process.env.DATABASE_URL ?? "";
const isPostgres = dbUrl.startsWith("postgresql:") || dbUrl.startsWith("postgres:");

if (process.env.VERCEL === "1" && !isPostgres) {
  console.error(
    "[build] Vercel 에서는 DATABASE_URL 에 Supabase Postgres URI 가 필요합니다. Project Settings > Database 에서 복사하세요.",
  );
  process.exit(1);
}

execSync("node scripts/generate-favicon.mjs", { stdio: "inherit" });

if (isPostgres) {
  execSync("npx prisma migrate deploy", { stdio: "inherit" });
} else {
  console.warn(
    "[build] DATABASE_URL 가 PostgreSQL 이 아니면 migrate deploy 를 건너뜁니다. 배포 전 Vercel 환경 변수를 설정하세요.",
  );
}

execSync("npx prisma generate", { stdio: "inherit" });
execSync("npx next build", { stdio: "inherit" });
