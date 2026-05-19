import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ProductDetailPage } from "@/components/product-detail-page";
import { getMergedStorySlides } from "@/lib/product-detail-slides";
import { getProductBySlug, products } from "@/lib/product-data";
import { sanitizeReferralCode } from "@/lib/referral-code";
import { productVisuals } from "@/lib/site-assets";
import { DEFAULT_KEYWORDS, SITE_NAME } from "@/lib/site-seo";

export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) {
    return { title: "제품" };
  }

  const visual = productVisuals[product.slug];
  const title = product.shortName ?? product.name;
  const description = `${product.tagline} ${product.heroDescription}`.replace(/\s+/g, " ").trim().slice(0, 155);
  const keywords = [...DEFAULT_KEYWORDS, product.name, product.englishName, ...product.keywords];

  return {
    title,
    description,
    keywords,
    alternates: { canonical: `/products/${product.slug}` },
    openGraph: {
      type: "website",
      locale: "ko_KR",
      siteName: SITE_NAME,
      title: `${product.name} · ${SITE_NAME}`,
      description: product.tagline,
      url: `/products/${product.slug}`,
      images: visual ? [{ url: visual.card, alt: visual.alt }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: product.name,
      description: product.tagline,
      images: visual ? [visual.card] : undefined,
    },
  };
}

export default async function ProductPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ ref?: string }>;
}) {
  const { slug } = await params;
  const { ref } = await searchParams;
  const referralRef = sanitizeReferralCode(ref ?? null);
  const product = getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const sunPackStorySlides = await getMergedStorySlides(product.slug);

  return <ProductDetailPage product={product} sunPackStorySlides={sunPackStorySlides} referralRef={referralRef} />;
}
