import { randomBytes } from "crypto";
import { mkdir, unlink, writeFile } from "fs/promises";
import path from "path";

import { createSupabaseServiceRole } from "@/lib/supabase/service";

export const PRODUCT_DETAIL_STORAGE_BUCKET = "product-detail";

const ALLOWED_MIME = new Set(["image/jpeg", "image/png", "image/gif"]);

export function assertAllowedImageMime(mime: string): asserts mime is "image/jpeg" | "image/png" | "image/gif" {
  if (!ALLOWED_MIME.has(mime)) {
    throw new Error("허용되는 형식은 JPG, PNG, GIF 만 가능합니다.");
  }
}

export function mimeToExtension(mime: string): string {
  switch (mime) {
    case "image/jpeg":
      return "jpg";
    case "image/png":
      return "png";
    case "image/gif":
      return "gif";
    default:
      throw new Error("지원하지 않는 이미지 형식입니다.");
  }
}

function publicPathFromSupabaseUrl(publicUrl: string): string | null {
  const marker = `/object/public/${PRODUCT_DETAIL_STORAGE_BUCKET}/`;
  const i = publicUrl.indexOf(marker);
  if (i === -1) {
    return null;
  }
  return decodeURIComponent(publicUrl.slice(i + marker.length));
}

export async function uploadProductDetailImage(
  productSlug: string,
  buffer: Buffer,
  mimeType: string,
): Promise<{ url: string }> {
  assertAllowedImageMime(mimeType);
  const ext = mimeToExtension(mimeType);
  const fileBase = `${Date.now()}-${randomBytes(6).toString("hex")}.${ext}`;

  const sb = createSupabaseServiceRole();
  if (sb) {
    const objectPath = `${productSlug}/${fileBase}`;
    const { error } = await sb.storage.from(PRODUCT_DETAIL_STORAGE_BUCKET).upload(objectPath, buffer, {
      contentType: mimeType,
      upsert: false,
    });
    if (error) {
      const err = error as { message?: string; error?: string; statusCode?: string };
      const parts = [err.message, err.error, err.statusCode].filter(Boolean);
      throw new Error(`스토리지 업로드 실패: ${parts.join(" · ") || "알 수 없는 오류"}`);
    }
    const { data } = sb.storage.from(PRODUCT_DETAIL_STORAGE_BUCKET).getPublicUrl(objectPath);
    return { url: data.publicUrl };
  }

  if (process.env.VERCEL) {
    throw new Error(
      "Vercel에서는 Supabase Storage가 필요합니다. Vercel·로컬 .env에 SUPABASE_SERVICE_ROLE_KEY를 넣고, Supabase Storage에 공개 버킷 product-detail을 만드세요.",
    );
  }

  const dir = path.join(process.cwd(), "public", "uploads", "product-detail", productSlug);
  await mkdir(dir, { recursive: true });
  const diskPath = path.join(dir, fileBase);
  await writeFile(diskPath, buffer);
  return { url: `/uploads/product-detail/${productSlug}/${fileBase}` };
}

export async function deleteProductDetailObject(publicUrl: string): Promise<void> {
  if (publicUrl.startsWith("/uploads/product-detail/")) {
    const diskPath = path.join(process.cwd(), "public", publicUrl.replace(/^\//, ""));
    try {
      await unlink(diskPath);
    } catch {
      /* 없으면 무시 */
    }
    return;
  }

  const objectPath = publicPathFromSupabaseUrl(publicUrl);
  if (!objectPath) {
    return;
  }

  const sb = createSupabaseServiceRole();
  if (!sb) {
    return;
  }

  await sb.storage.from(PRODUCT_DETAIL_STORAGE_BUCKET).remove([objectPath]);
}
