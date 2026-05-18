import type { ProductSlug } from "@/lib/product-data";
import { prisma } from "@/lib/db";
import type { SunPackStorySlide } from "@/lib/site-assets";
import { illuminatorDetailAssets, sunPackDetailAssets } from "@/lib/site-assets";

export async function getMergedStorySlides(slug: ProductSlug): Promise<SunPackStorySlide[]> {
  try {
    const rows = await prisma.productDetailSlide.findMany({
      where: { productSlug: slug },
      orderBy: { sortOrder: "asc" },
    });

    if (rows.length > 0) {
      return rows.map((r) => ({
        src: r.url,
        width: r.width,
        height: r.height,
        posterSrc: r.posterUrl ?? undefined,
        body: r.body?.trim() ? r.body : undefined,
      }));
    }
  } catch (error) {
    console.error("[getMergedStorySlides] DB unavailable, using fallback:", error);
  }

  if (slug === "sun-pack") {
    return sunPackDetailAssets.storyImages;
  }

  if (slug === "illuminator") {
    const { width, height } = illuminatorDetailAssets.heroPixelSize;
    return illuminatorDetailAssets.thumbnailImages.map((src) => ({ src, width, height }));
  }

  return [];
}

/** DB 슬라이드가 일부만 있어도 기존 7컷과 순서대로 합성 (일루미 상세 갤러리·스토리 공통) */
export function mergeIlluminatorSlidesWithFallback(slides: SunPackStorySlide[]): SunPackStorySlide[] {
  const fb = illuminatorDetailAssets.thumbnailImages;
  const { width: w, height: h } = illuminatorDetailAssets.heroPixelSize;
  const targetLen = Math.max(fb.length, slides.length);
  return Array.from({ length: targetLen }, (_, i) => ({
    src: slides[i]?.src ?? fb[i] ?? fb[fb.length - 1]!,
    width: slides[i]?.width ?? w,
    height: slides[i]?.height ?? h,
    posterSrc: slides[i]?.posterSrc,
    body: slides[i]?.body,
  }));
}

export async function listDetailSlidesAdmin(slug: ProductSlug) {
  return prisma.productDetailSlide.findMany({
    where: { productSlug: slug },
    orderBy: { sortOrder: "asc" },
  });
}

export async function renormalizeSortOrders(productSlug: string) {
  const rows = await prisma.productDetailSlide.findMany({
    where: { productSlug },
    orderBy: { sortOrder: "asc" },
  });
  await prisma.$transaction(
    rows.map((r, i) =>
      prisma.productDetailSlide.update({
        where: { id: r.id },
        data: { sortOrder: i },
      }),
    ),
  );
}
