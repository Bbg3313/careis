import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";

function loadEnv() {
  for (const line of readFileSync(".env", "utf8").split("\n")) {
    const m = line.match(/^([^#=]+)=(.*)$/);
    if (!m) continue;
    let v = m[2].trim().replace(/^["']|["']$/g, "");
    process.env[m[1].trim()] = v;
  }
}
loadEnv();

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const service = process.env.SUPABASE_SERVICE_ROLE_KEY;
const email = "bbg3313@gmail.com";
const newPassword = "thrhrl92!";

const admin = createClient(url, service, { auth: { autoRefreshToken: false, persistSession: false } });

const { data: list, error: listErr } = await admin.auth.admin.listUsers({ perPage: 200 });
if (listErr) {
  console.error("listUsers failed:", listErr.message);
  process.exit(1);
}

const user = list.users.find((u) => u.email?.toLowerCase() === email);
if (!user) {
  console.error("user not found:", email);
  process.exit(1);
}

const { error } = await admin.auth.admin.updateUserById(user.id, { password: newPassword });
if (error) {
  console.error("update failed:", error.message);
  process.exit(1);
}

const { error: signErr } = await createClient(url, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY).auth.signInWithPassword({
  email,
  password: newPassword,
});
console.log(signErr ? `updated but sign-in test failed: ${signErr.message}` : "password updated and sign-in ok");
