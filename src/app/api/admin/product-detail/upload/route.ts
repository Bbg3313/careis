import { NextResponse } from "next/server";
import sharp from "sharp";

import { guardAdminApi } from "@/lib/admin-auth";
import type { ProductSlug } from "@/lib/product-data";
import { prisma } from "@/lib/db";
import {
  assertAllowedImageMime,
  inferImageMimeFromFileName,
  uploadProductDetailImage,
} from "@/lib/product-detail-storage";

export const runtime = "nodejs";

const MAX_BYTES = 15 * 1024 * 1024;
const MAX_FILES = 24;

function parseSlug(raw: string): ProductSlug | null {
  if (raw === "sun-pack" || raw === "illuminator") {
    return raw;
  }
  return null;
}

/** GIF 논리 화면 크기 (애니 GIF 첫 프레임 기준, Sharp 없이 읽음) */
function readGifLogicalScreen(buf: Buffer): { width: number; height: number } | null {
  if (buf.length < 10) return null;
  const sig = buf.subarray(0, 6).toString("ascii");
  if (sig !== "GIF87a" && sig !== "GIF89a") return null;
  const width = buf.readUInt16LE(6);
  const height = buf.readUInt16LE(8);
  if (width < 1 || height < 1 || width > 16384 || height > 16384) return null;
  return { width, height };
}

function resolveMimeType(file: File): string {
  const fromBrowser = (file.type || "").toLowerCase().trim();
  if (fromBrowser && fromBrowser !== "application/octet-stream") {
    return fromBrowser;
  }
  const inferred = inferImageMimeFromFileName(file.name);
  if (inferred) return inferred;
  return fromBrowser || "application/octet-stream";
}

async function readPixelSize(buffer: Buffer, mimeType: string): Promise<{ width: number; height: number }> {
  if (mimeType === "image/gif") {
    const gif = readGifLogicalScreen(buffer);
    if (gif) return gif;
  }
  const meta = await sharp(buffer, { failOn: "none", pages: 1 }).metadata();
  return { width: meta.width ?? 1, height: meta.height ?? 1 };
}

export async function POST(request: Request) {
  const denied = await guardAdminApi();
  if (denied) {
    return denied;
  }

  try {
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

      const mimeType = resolveMimeType(file);
      try {
        assertAllowedImageMime(mimeType);
      } catch (e) {
        const msg = e instanceof Error ? e.message : "형식 오류";
        return NextResponse.json({ ok: false, error: msg }, { status: 400 });
      }

      const ab = await file.arrayBuffer();
      const buffer = Buffer.from(ab);

      let width = 1;
      let height = 1;
      try {
        const dims = await readPixelSize(buffer, mimeType);
        width = dims.width;
        height = dims.height;
      } catch (e) {
        const hint = mimeType === "image/gif" ? " GIF 파일이 손상되었거나 지원되지 않는 형식일 수 있습니다." : "";
        const msg = e instanceof Error ? e.message : "이미지 크기를 읽지 못했습니다.";
        return NextResponse.json({ ok: false, error: `${msg}${hint}` }, { status: 400 });
      }

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
  } catch (e) {
    const message = e instanceof Error ? e.message : "업로드 처리 실패";
    console.error("[api/admin/product-detail/upload]", e);
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
