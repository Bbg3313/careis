import { randomBytes } from "crypto";
import { NextResponse } from "next/server";
import { z } from "zod";

import { guardAdminApi } from "@/lib/admin-auth";
import {
  PRODUCT_DETAIL_STORAGE_BUCKET,
  assertAllowedImageMime,
  mimeToExtension,
} from "@/lib/product-detail-storage";
import { createSupabaseServiceRole } from "@/lib/supabase/service";

export const runtime = "nodejs";

const bodySchema = z.object({
  slug: z.enum(["sun-pack", "illuminator"]),
  mimeType: z.enum(["image/jpeg", "image/png", "image/gif"]),
});

export async function POST(request: Request) {
  const denied = await guardAdminApi();
  if (denied) return denied;

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "JSON 본문이 필요합니다." }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "slug·mimeType 값이 올바른지 확인하세요." }, { status: 400 });
  }

  const { slug, mimeType } = parsed.data;
  try {
    assertAllowedImageMime(mimeType);
  } catch (e) {
    const msg = e instanceof Error ? e.message : "형식 오류";
    return NextResponse.json({ ok: false, error: msg }, { status: 400 });
  }

  const ext = mimeToExtension(mimeType);
  const objectPath = `${slug}/${Date.now()}-${randomBytes(8).toString("hex")}.${ext}`;

  const sb = createSupabaseServiceRole();
  if (!sb) {
    return NextResponse.json(
      { ok: false, error: "SUPABASE_SERVICE_ROLE_KEY 가 없어 서명 URL을 만들 수 없습니다." },
      { status: 500 },
    );
  }

  const { data, error } = await sb.storage.from(PRODUCT_DETAIL_STORAGE_BUCKET).createSignedUploadUrl(objectPath);
  if (error || !data) {
    const err = error as { message?: string; error?: string } | null;
    const parts = [err?.message, err?.error].filter(Boolean);
    return NextResponse.json(
      { ok: false, error: `서명 URL 생성 실패: ${parts.join(" · ") || "알 수 없음"}` },
      { status: 500 },
    );
  }

  return NextResponse.json({
    ok: true,
    signedUrl: data.signedUrl,
    token: data.token,
    path: data.path,
  });
}
