/**
 * .env 에 anon·service_role 키 반영 + 연결 테스트
 * 사용: set SUPABASE_ANON_KEY=eyJ... && set SUPABASE_SERVICE_ROLE_KEY=eyJ... && npx tsx scripts/patch-supabase-keys.mjs
 */
import { createClient } from "@supabase/supabase-js";
import { readFileSync, writeFileSync } from "fs";

const anon = (process.env.SUPABASE_ANON_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "").trim();
const service = (process.env.SUPABASE_SERVICE_ROLE_KEY ?? "").trim();

if (!anon || !service) {
  console.error("SUPABASE_ANON_KEY 와 SUPABASE_SERVICE_ROLE_KEY 환경변수가 필요합니다.");
  process.exit(1);
}

const envPath = ".env";
let text = readFileSync(envPath, "utf8");

function setLine(key, value) {
  const re = new RegExp(`^${key}=.*$`, "m");
  const line = `${key}=${value}`;
  text = re.test(text) ? text.replace(re, line) : `${text.trimEnd()}\n${line}\n`;
}

setLine("NEXT_PUBLIC_SUPABASE_ANON_KEY", anon);
setLine("SUPABASE_ANON_KEY", anon);
setLine("SUPABASE_SERVICE_ROLE_KEY", service);

writeFileSync(envPath, text, "utf8");
console.log(".env 업데이트 완료");

const url = "https://qzndymsotizutpffnyey.supabase.co";
const sb = createClient(url, anon);
const { error: authErr } = await sb.auth.signInWithPassword({
  email: "bbg3313@gmail.com",
  password: "CareisAdmin2026!",
});
console.log("auth test", authErr ? authErr.message : "ok");

const admin = createClient(url, service);
const { data: buckets, error: bErr } = await admin.storage.listBuckets();
console.log("storage", bErr ? bErr.message : buckets.map((b) => b.name).join(", "));
