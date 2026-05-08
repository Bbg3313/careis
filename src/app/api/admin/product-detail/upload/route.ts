import { NextResponse } from "next/server";
import sharp from "sharp";

import { guardAdminApi } from "@/lib/admin-auth";
import type { ProductSlug } from "@/lib/product-data";
import { prisma } from "@/lib/db";
import { assertAllowedImageMime, uploadProductDetailImage } from "@/lib/product-detail-storage";

export const runtime = "nodejs";

const MAX_BYTES = 15 * 1024 * 1024;
const MAX_FILES = 24;

function parseSlug(raw: string): ProductSlug | null {
  if (raw === "sun-pack" || raw === "illuminator") {
    return raw;
  }
  return null;
}

export async function POST(request: Request) {
  const denied = await guardAdminApi();
  if (denied) {
    return denied;
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid form data" }, { status: 400 });
  }

  const slugRaw = String(formData.get("slug") ?? "");
  const slug = parseSlug(slugRaw);
  if (!slug) {
    return NextResponse.json({ ok: false, error: "유효한 상품 slug가 필요합니다." }, { status: 400 });
  }

  const files = formData
    .getAll("files")
    .filter((item): item is File => item instanceof File && item.size > 0);

  if (files.length === 0) {
    return NextResponse.json({ ok: false, error: "업로드할 파일이 없습니다." }, { status: 400 });
  }
  if (files.length > MAX_FILES) {
    return NextResponse.json(
      { ok: false, error: `한 번에 최대 ${MAX_FILES}개까지 업로드할 수 있습니다.` },
      { status: 400 },
    );
  }

  const agg = await prisma.productDetailSlide.aggregate({
    where: { productSlug: slug },
    _max: { sortOrder: true },
  });
  let nextOrder = (agg._max.sortOrder ?? -1) + 1;

  const created: { id: string; url: string; sortOrder: number }[] = [];

  for (const file of files) {
    if (file.size > MAX_BYTES) {
      return NextResponse.json(
        { ok: false, error: `파일당 최대 ${MAX_BYTES / 1024 / 1024}MB 입니다: ${file.name}` },
        { status: 400 },
      );
    }

    const mimeType = (file.type || "application/octet-stream").toLowerCase();
    try {
      assertAllowedImageMime(mimeType);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "형식 오류";
      return NextResponse.json({ ok: false, error: msg }, { status: 400 });
    }

    const ab = await file.arrayBuffer();
    const buffer = Buffer.from(ab);

    const meta = await sharp(buffer, { failOn: "none" }).metadata();
    const width = meta.width ?? 1;
    const height = meta.height ?? 1;

    const { url } = await uploadProductDetailImage(slug, buffer, mimeType);

    const row = await prisma.productDetailSlide.create({
      data: {
        productSlug: slug,
        sortOrder: nextOrder,
        url,
        width,
        height,
        mimeType,
      },
    });
    created.push({ id: row.id, url: row.url, sortOrder: row.sortOrder });
    nextOrder += 1;
  }

  return NextResponse.json({ ok: true, slides: created });
}
