import { execSync } from "node:child_process";

const dbUrl = process.env.DATABASE_URL ?? "";
const isPostgres = dbUrl.startsWith("postgresql:") || dbUrl.startsWith("postgres:");
const skipMigrate =
  process.env.SKIP_PRISMA_MIGRATE === "1" ||
  process.env.VERCEL === "1" ||
  dbUrl.includes("pgbouncer=true");

if (process.env.VERCEL === "1" && !isPostgres) {
  console.error(
    "[build] Vercel 에서는 DATABASE_URL 에 Supabase Postgres URI 가 필요합니다. Project Settings > Database 에서 복사하세요.",
  );
  process.exit(1);
}

execSync("node scripts/generate-favicon.mjs", { stdio: "inherit" });

if (isPostgres && !skipMigrate) {
  execSync("npx prisma migrate deploy", { stdio: "inherit" });
} else if (isPostgres && skipMigrate) {
  console.warn(
    "[build] prisma migrate deploy 를 건너뜁니다 (Vercel/pgbouncer). 새 마이그레이션은 로컬에서 migrate deploy 하세요.",
  );
} else {
  console.warn(
    "[build] DATABASE_URL 가 PostgreSQL 이 아니면 migrate deploy 를 건너뜁니다. 배포 전 Vercel 환경 변수를 설정하세요.",
  );
}

execSync("npx prisma generate", { stdio: "inherit" });
execSync("npx next build", { stdio: "inherit" });
