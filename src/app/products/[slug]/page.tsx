import { notFound } from "next/navigation";

import { ProductDetailPage } from "@/components/product-detail-page";
import { getMergedStorySlides } from "@/lib/product-detail-slides";
import { getProductBySlug, products } from "@/lib/product-data";

export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const sunPackStorySlides = await getMergedStorySlides(product.slug);

  return <ProductDetailPage product={product} sunPackStorySlides={sunPackStorySlides} />;
}
