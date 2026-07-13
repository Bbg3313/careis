import { execSync } from "node:child_process";
import { readFileSync, writeFileSync, unlinkSync, existsSync } from "node:fs";

function loadEnvFile(path) {
  const out = {};
  for (const line of readFileSync(path, "utf8").split("\n")) {
    const m = line.match(/^([^#=]+)=(.*)$/);
    if (!m) continue;
    out[m[1].trim()] = m[2].trim().replace(/^["']|["']$/g, "");
  }
  return out;
}

const env = loadEnvFile(".env");
if (!env.DATABASE_URL || !env.DIRECT_URL) {
  console.error("Need DATABASE_URL and DIRECT_URL in .env");
  process.exit(1);
}

function addEnv(name, value, environment) {
  const tmp = `.tmp-add-${name}-${environment}.txt`;
  writeFileSync(tmp, value, "utf8");
  try {
    // Windows: pipe file into vercel env add
    execSync(
      `cmd /c "type ${tmp} | npx vercel env add ${name} ${environment}"`,
      { stdio: "inherit" },
    );
    console.log(`OK ${name} → ${environment}`);
  } finally {
    if (existsSync(tmp)) unlinkSync(tmp);
  }
}

for (const environment of ["production", "preview", "development"]) {
  addEnv("DATABASE_URL", env.DATABASE_URL, environment);
  addEnv("DIRECT_URL", env.DIRECT_URL, environment);
}
