import { readFileSync } from "fs";
import { homedir } from "os";
import path from "path";

function loadEnvFile() {
  const out = {};
  for (const line of readFileSync(".env", "utf8").split("\n")) {
    const m = line.match(/^([^#=]+)=(.*)$/);
    if (!m) continue;
    let v = m[2].trim().replace(/^["']|["']$/g, "");
    out[m[1].trim()] = v;
  }
  return out;
}

const env = loadEnvFile();
const tokenPath =
  process.platform === "win32"
    ? path.join(process.env.APPDATA ?? "", "com.vercel.cli", "Data", "auth.json")
    : path.join(homedir(), ".local", "share", "com.vercel.cli", "auth.json");

const { token } = JSON.parse(readFileSync(tokenPath, "utf8"));
const projectId = "prj_UTEUGOJ2iEvYpNok1CZA4d2mQitX";
const teamId = "team_4OGuv8lJ9jjzYLqCfdnlOWhf";
const base = `https://api.vercel.com/v10/projects/${projectId}/env?teamId=${teamId}&upsert=true`;

const vars = {
  DATABASE_URL: env.DATABASE_URL,
  NEXT_PUBLIC_SUPABASE_URL: env.NEXT_PUBLIC_SUPABASE_URL,
  SUPABASE_URL: env.SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  SUPABASE_ANON_KEY: env.SUPABASE_ANON_KEY,
  SUPABASE_SERVICE_ROLE_KEY: env.SUPABASE_SERVICE_ROLE_KEY,
  ADMIN_ALLOWED_EMAILS: env.ADMIN_ALLOWED_EMAILS,
  NEXT_PUBLIC_SITE_URL: env.NEXT_PUBLIC_SITE_URL ?? "https://careis-mall.vercel.app",
};

for (const [key, value] of Object.entries(vars)) {
  const res = await fetch(base, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      key,
      value,
      type: "encrypted",
      target: ["production", "preview"],
    }),
  });
  const text = await res.text();
  console.log(key, res.status, text.slice(0, 120));
}

console.log("ENV_SYNC_COMPLETE");
