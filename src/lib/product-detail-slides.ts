import type { ProductSlug } from "@/lib/product-data";
import { prisma } from "@/lib/db";
import type { SunPackStorySlide } from "@/lib/site-assets";
import { sunPackDetailAssets } from "@/lib/site-assets";

const REACHABLE_CACHE = new Map<string, { ok: boolean; at: number }>();
const REACHABLE_CACHE_TTL_MS = 5 * 60 * 1000;

function isLocalAssetUrl(url: string) {
  return url.startsWith("/");
}

async function isMediaUrlReachable(url: string): Promise<boolean> {
  if (isLocalAssetUrl(url)) {
    return true;
  }

  const cached = REACHABLE_CACHE.get(url);
  if (cached && Date.now() - cached.at < REACHABLE_CACHE_TTL_MS) {
    return cached.ok;
  }

  let ok = false;
  try {
    const res = await fetch(url, {
      method: "HEAD",
      signal: AbortSignal.timeout(4000),
      cache: "no-store",
    });
    ok = res.ok;
  } catch {
    try {
      const res = await fetch(url, {
        method: "GET",
        headers: { Range: "bytes=0-0" },
        signal: AbortSignal.timeout(4000),
        cache: "no-store",
      });
      ok = res.ok || res.status === 206;
    } catch {
      ok = false;
    }
  }

  REACHABLE_CACHE.set(url, { ok, at: Date.now() });
  return ok;
}

function rowToSlide(r: {
  url: string;
  width: number;
  height: number;
  posterUrl: string | null;
  body: string | null;
}): SunPackStorySlide {
  return {
    src: r.url,
    width: r.width,
    height: r.height,
    posterSrc: r.posterUrl ?? undefined,
    body: r.body?.trim() ? r.body : undefined,
  };
}

async function filterReachableSlides(slides: SunPackStorySlide[]): Promise<SunPackStorySlide[]> {
  if (slides.length === 0) {
    return slides;
  }

  const firstRemote = slides.find((slide) => !isLocalAssetUrl(slide.src));
  if (firstRemote) {
    const firstOk = await isMediaUrlReachable(firstRemote.src);
    if (!firstOk) {
      try {
        const origin = new URL(firstRemote.src).origin;
        const allSameOrigin = slides.every(
          (slide) => isLocalAssetUrl(slide.src) || new URL(slide.src).origin === origin,
        );
        if (allSameOrigin) {
          console.warn("[getMergedStorySlides] remote origin unreachable, skipping DB slides:", origin);
          return [];
        }
      } catch {
        /* malformed URL — fall through to per-slide checks */
      }
    }
  }

  const results = await Promise.all(
    slides.map(async (slide) => ({
      slide,
      ok: await isMediaUrlReachable(slide.src),
    })),
  );

  const reachable = results.filter((result) => result.ok).map((result) => result.slide);
  const skipped = slides.length - reachable.length;
  if (skipped > 0) {
    console.warn(`[getMergedStorySlides] skipped ${skipped}/${slides.length} unreachable slide URL(s)`);
  }

  return reachable;
}

function fallbackSlides(slug: ProductSlug): SunPackStorySlide[] {
  if (slug === "sun-pack") {
    return sunPackDetailAssets.storyImages;
  }

  /** 일루미: DB에 슬라이드가 없으면 빈 배열(고정 템플릿만 노출). 추가분은 PDP에서 상단에만 쌓음 */
  return [];
}

export async function getMergedStorySlides(slug: ProductSlug): Promise<SunPackStorySlide[]> {
  try {
    const rows = await prisma.productDetailSlide.findMany({
      where: { productSlug: slug },
      orderBy: { sortOrder: "asc" },
    });

    if (rows.length > 0) {
      const slides = rows.map(rowToSlide);
      const reachable = await filterReachableSlides(slides);
      if (reachable.length > 0) {
        return reachable;
      }

      console.warn(`[getMergedStorySlides] ${slug}: DB slides present but unreachable, using fallback`);
    }
  } catch (error) {
    console.error("[getMergedStorySlides] DB unavailable, using fallback:", error);
  }

  return fallbackSlides(slug);
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
