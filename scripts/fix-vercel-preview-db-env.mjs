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

function addEnv(name, value, environment) {
  const tmp = `.tmp-add-${name}-${environment}.txt`;
  writeFileSync(tmp, value, "utf8");
  try {
    execSync(`cmd /c "type ${tmp} | npx vercel env add ${name} ${environment}"`, { stdio: "inherit" });
    console.log(`OK ${name} → ${environment}`);
  } finally {
    if (existsSync(tmp)) unlinkSync(tmp);
  }
}

function rmEnv(name, environment) {
  try {
    execSync(`npx vercel env rm ${name} ${environment} -y`, { stdio: "inherit" });
  } catch {
    console.log(`skip rm ${name} ${environment}`);
  }
}

const env = loadEnvFile(".env");
if (!env.DATABASE_URL || !env.DIRECT_URL) {
  console.error("Need DATABASE_URL and DIRECT_URL in .env");
  process.exit(1);
}

for (const environment of ["preview", "development"]) {
  rmEnv("DATABASE_URL", environment);
  rmEnv("DIRECT_URL", environment);
  addEnv("DATABASE_URL", env.DATABASE_URL, environment);
  addEnv("DIRECT_URL", env.DIRECT_URL, environment);
}
