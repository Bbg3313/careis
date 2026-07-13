/**
 * DIRECT_URL 을 Supabase 직접 연결(db.<ref>.supabase.co)으로 바꾼다.
 * Session pooler(5432) max clients 고갈 시 migrate/deploy 가 막히는 것을 피한다.
 */
import { execSync } from "node:child_process";
import { existsSync, readFileSync, unlinkSync, writeFileSync } from "node:fs";

function loadEnvFile(path) {
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

function toDirectDbUrl(anyUrl) {
  const u = new URL(anyUrl);
  const user = u.username; // postgres.<projectRef> on pooler, or postgres on direct
  const m = user.match(/^postgres\.(.+)$/);
  const projectRef = m?.[1] ?? u.hostname.match(/^db\.([^.]+)\.supabase\.co$/)?.[1];
  if (!projectRef) {
    throw new Error(`Cannot infer Supabase project ref from ${u.hostname} / ${user}`);
  }
  const password = decodeURIComponent(u.password);
  const encoded = encodeURIComponent(password);
  return `postgresql://postgres:${encoded}@db.${projectRef}.supabase.co:5432/postgres`;
}

const env = loadEnvFile(".env");
const source = env.DIRECT_URL || env.DATABASE_URL;
if (!source) {
  console.error("No DATABASE_URL/DIRECT_URL");
  process.exit(1);
}

const directUrl = toDirectDbUrl(source);
console.log("DIRECT_URL host →", new URL(directUrl).hostname);

let envText = readFileSync(".env", "utf8");
envText = upsertEnvLine(envText, "DIRECT_URL", directUrl);
writeFileSync(".env", envText, "utf8");
console.log("Updated .env DIRECT_URL");

function setVercel(name, value, environment) {
  try {
    execSync(`npx vercel env rm ${name} ${environment} -y`, { stdio: "pipe" });
  } catch {
    // ok
  }
  const tmp = `.tmp-add-${name}-${environment}.txt`;
  writeFileSync(tmp, value, "utf8");
  try {
    execSync(`cmd /c "type ${tmp} | npx vercel env add ${name} ${environment}"`, { stdio: "inherit" });
  } finally {
    if (existsSync(tmp)) unlinkSync(tmp);
  }
}

if (process.argv.includes("--vercel")) {
  for (const environment of ["production", "preview", "development"]) {
    console.log(`Updating DIRECT_URL → ${environment}`);
    setVercel("DIRECT_URL", directUrl, environment);
  }
}
