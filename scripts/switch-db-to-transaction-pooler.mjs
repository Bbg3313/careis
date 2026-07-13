/**
 * Session pooler(5432) → Transaction pooler(6543)+pgbouncer 로 바꾸고
 * DIRECT_URL 은 세션 URL(5432)로 둔다. (Prisma migrate용)
 *
 * node scripts/switch-db-to-transaction-pooler.mjs
 * node scripts/switch-db-to-transaction-pooler.mjs --vercel
 */
import { execFileSync, execSync } from "node:child_process";
import { existsSync, readFileSync, unlinkSync, writeFileSync } from "node:fs";

function loadEnvFile(path) {
  if (!existsSync(path)) return {};
  const out = {};
  for (const line of readFileSync(path, "utf8").split("\n")) {
    const m = line.match(/^([^#=]+)=(.*)$/);
    if (!m) continue;
    out[m[1].trim()] = m[2].trim().replace(/^["']|["']$/g, "");
  }
  return out;
}

function upsertEnvLine(contents, key, value) {
  const line = `${key}="${value}"`;
  const re = new RegExp(`^${key}=.*$`, "m");
  if (re.test(contents)) return contents.replace(re, line);
  return `${contents.trimEnd()}\n${line}\n`;
}

function asSessionUrl(raw) {
  const u = new URL(raw);
  u.port = "5432";
  u.search = "";
  return u.toString();
}

function asTransactionPoolerUrl(sessionUrl) {
  const u = new URL(sessionUrl);
  if (!u.hostname.includes("pooler.supabase.com")) {
    throw new Error(`Expected Supabase pooler host, got ${u.hostname}`);
  }
  u.port = "6543";
  u.search = "";
  u.searchParams.set("pgbouncer", "true");
  u.searchParams.set("connection_limit", "1");
  return u.toString();
}

const local = loadEnvFile(".env");
const pulled = loadEnvFile(".env.vercel.check");
const source = local.DIRECT_URL || local.DATABASE_URL || pulled.DATABASE_URL;
if (!source) {
  console.error("No DATABASE_URL in .env or .env.vercel.check");
  process.exit(1);
}

const directUrl = asSessionUrl(source);
const poolUrl = asTransactionPoolerUrl(directUrl);

console.log("DIRECT_URL →", new URL(directUrl).hostname + ":" + new URL(directUrl).port);
console.log(
  "DATABASE_URL →",
  new URL(poolUrl).hostname + ":" + new URL(poolUrl).port,
  "pgbouncer=" + new URL(poolUrl).searchParams.get("pgbouncer"),
);

if (existsSync(".env")) {
  let envText = readFileSync(".env", "utf8");
  envText = upsertEnvLine(envText, "DATABASE_URL", poolUrl);
  envText = upsertEnvLine(envText, "DIRECT_URL", directUrl);
  writeFileSync(".env", envText, "utf8");
  console.log("Updated .env");
}

const applyVercel = process.argv.includes("--vercel");
if (!applyVercel) {
  console.log("Skip Vercel (pass --vercel to update Production/Preview)");
  process.exit(0);
}

function setVercelEnv(name, value, environment) {
  try {
    execSync(`npx vercel env rm ${name} ${environment} -y`, { stdio: "pipe" });
  } catch {
    // absent is fine
  }
  const tmp = `.tmp-vercel-env-${name}-${environment}`;
  writeFileSync(tmp, `${value}\n`, "utf8");
  try {
    execFileSync("npx", ["vercel", "env", "add", name, environment], {
      input: readFileSync(tmp),
      stdio: ["pipe", "inherit", "inherit"],
    });
  } finally {
    try {
      unlinkSync(tmp);
    } catch {
      // ignore
    }
  }
}

for (const environment of ["production", "preview"]) {
  console.log(`Updating Vercel ${environment}…`);
  setVercelEnv("DATABASE_URL", poolUrl, environment);
  setVercelEnv("DIRECT_URL", directUrl, environment);
}

console.log("Done. Redeploy so serverless functions pick up the new URLs.");
