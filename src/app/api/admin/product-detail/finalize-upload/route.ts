import { NextResponse } from "next/server";
import { z } from "zod";

import { guardAdminApi } from "@/lib/admin-auth";
import type { ProductSlug } from "@/lib/product-data";
import { prisma } from "@/lib/db";
import { assertAllowedImageMime, PRODUCT_DETAIL_STORAGE_BUCKET } from "@/lib/product-detail-storage";
import { createSupabaseServiceRole } from "@/lib/supabase/service";

export const runtime = "nodejs";

const bodySchema = z.object({
  slug: z.enum(["sun-pack", "illuminator"]),
  path: z.string().min(3),
  mimeType: z.enum(["image/jpeg", "image/png", "image/gif"]),
  width: z.number().int().min(1).max(16384),
  height: z.number().int().min(1).max(16384),
});

function isSafeStoragePath(slug: ProductSlug, path: string): boolean {
  if (path.includes("..") || path.includes("\\") || path.startsWith("/")) return false;
  const prefix = `${slug}/`;
  if (!path.startsWith(prefix)) return false;
  const rest = path.slice(prefix.length);
  if (!rest || rest.includes("/")) return false;
  return true;
}

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
    return NextResponse.json({ ok: false, error: "요청 필드(slug, path, mimeType, width, height)를 확인하세요." }, { status: 400 });
  }

  const { slug, path, mimeType, width, height } = parsed.data;
  try {
    assertAllowedImageMime(mimeType);
  } catch (e) {
    const msg = e instanceof Error ? e.message : "형식 오류";
    return NextResponse.json({ ok: false, error: msg }, { status: 400 });
  }

  if (!isSafeStoragePath(slug, path)) {
    return NextResponse.json({ ok: false, error: "허용되지 않은 저장 경로입니다." }, { status: 400 });
  }

  const sb = createSupabaseServiceRole();
  if (!sb) {
    return NextResponse.json({ ok: false, error: "SUPABASE_SERVICE_ROLE_KEY 가 필요합니다." }, { status: 500 });
  }

  const { data: pub } = sb.storage.from(PRODUCT_DETAIL_STORAGE_BUCKET).getPublicUrl(path);
  const publicUrl = pub.publicUrl;

  let headOk = false;
  for (let attempt = 0; attempt < 8; attempt++) {
    const head = await fetch(publicUrl, { method: "HEAD", cache: "no-store" });
    if (head.ok) {
      headOk = true;
      break;
    }
    await new Promise((r) => setTimeout(r, 250));
  }
  if (!headOk) {
    return NextResponse.json(
      {
        ok: false,
        error:
          "스토리지에 파일이 아직 보이지 않습니다. 잠시 후 다시 시도하거나, 브라우저에서 업로드가 끝까지 완료됐는지 확인해 주세요.",
      },
      { status: 400 },
    );
  }

  const agg = await prisma.productDetailSlide.aggregate({
    where: { productSlug: slug },
    _max: { sortOrder: true },
  });
  const sortOrder = (agg._max.sortOrder ?? -1) + 1;

  const row = await prisma.productDetailSlide.create({
    data: {
      productSlug: slug,
      sortOrder,
      url: publicUrl,
      width,
      height,
      mimeType,
    },
  });

  return NextResponse.json({
    ok: true,
    slide: { id: row.id, url: row.url, sortOrder: row.sortOrder },
  });
}
