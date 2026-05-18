import type { ProductSlug } from "@/lib/product-data";
import { prisma } from "@/lib/db";
import type { SunPackStorySlide } from "@/lib/site-assets";
import { sunPackDetailAssets } from "@/lib/site-assets";

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

  /** 일루미: DB에 슬라이드가 없으면 빈 배열(고정 템플릿만 노출). 추가분은 PDP에서 상단에만 쌓음 */
  return [];
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
