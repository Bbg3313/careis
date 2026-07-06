import { PrismaClient } from "@prisma/client";
import { randomUUID } from "crypto";

const NEW_DB =
  "postgresql://postgres.qzndymsotizutpffnyey:thrhrl92%21%21%21@aws-1-ap-southeast-1.pooler.supabase.com:5432/postgres";

const ADMIN_EMAIL = "bbg3313@gmail.com";
const ADMIN_PASSWORD = "CareisAdmin2026!";

const p = new PrismaClient({ datasources: { db: { url: NEW_DB } } });

async function ensureStorageBucket() {
  await p.$executeRawUnsafe(`
    INSERT INTO storage.buckets (id, name, public, avif_autodetection, file_size_limit, allowed_mime_types)
    VALUES ('product-detail', 'product-detail', true, false, null, null)
    ON CONFLICT (id) DO UPDATE SET public = true
  `);
  console.log("storage bucket product-detail ready");
}

async function ensureAuthUser() {
  const existing = await p.$queryRawUnsafe(
    `SELECT id FROM auth.users WHERE email = '${ADMIN_EMAIL.replace(/'/g, "''")}' LIMIT 1`,
  );
  if (Array.isArray(existing) && existing.length > 0) {
    console.log("auth user already exists", ADMIN_EMAIL);
    return;
  }

  const userId = randomUUID();
  const emailEsc = ADMIN_EMAIL.replace(/'/g, "''");
  const passEsc = ADMIN_PASSWORD.replace(/'/g, "''");

  await p.$executeRawUnsafe(`
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password,
      email_confirmed_at, recovery_sent_at, last_sign_in_at,
      raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
      confirmation_token, email_change, email_change_token_new, recovery_token
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      '${userId}'::uuid,
      'authenticated',
      'authenticated',
      '${emailEsc}',
      crypt('${passEsc}', gen_salt('bf')),
      now(), now(), now(),
      '{"provider":"email","providers":["email"]}'::jsonb,
      '{}'::jsonb,
      now(), now(),
      '', '', '', ''
    )
  `);

  await p.$executeRawUnsafe(`
    INSERT INTO auth.identities (
      id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
      '${userId}'::uuid,
      '${userId}'::uuid,
      jsonb_build_object('sub', '${userId}', 'email', '${emailEsc}'),
      'email',
      '${userId}',
      now(), now(), now()
    )
  `);

  console.log("auth user created", ADMIN_EMAIL);
}

try {
  await ensureStorageBucket();
  await ensureAuthUser();
} finally {
  await p.$disconnect();
}
