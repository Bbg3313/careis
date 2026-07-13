import { readFileSync, existsSync } from "fs";

function load(path) {
  if (!existsSync(path)) return null;
  const out = {};
  for (const line of readFileSync(path, "utf8").split("\n")) {
    const m = line.match(/^([^#=]+)=(.*)$/);
    if (!m) continue;
    out[m[1].trim()] = m[2].trim().replace(/^["']|["']$/g, "");
  }
  return out;
}

for (const path of [".env", ".env.vercel.check", ".env.local"]) {
  const env = load(path);
  if (!env?.DATABASE_URL) {
    console.log(path, "missing DATABASE_URL");
    continue;
  }
  try {
    const u = new URL(env.DATABASE_URL);
    console.log(
      path,
      JSON.stringify({
        host: u.hostname,
        port: u.port || "(default)",
        user: u.username,
        db: u.pathname,
        pgbouncer: u.searchParams.get("pgbouncer"),
        connection_limit: u.searchParams.get("connection_limit"),
      }),
    );
  } catch (e) {
    console.log(path, "parse fail", e instanceof Error ? e.message : e);
  }
}
