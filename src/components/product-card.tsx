import Image from "next/image";
import Link from "next/link";

import type { ProductContent } from "@/lib/product-data";
import { productVisuals } from "@/lib/site-assets";
import { formatCurrency } from "@/lib/utils";

export function ProductCard({ product }: { product: ProductContent }) {
  const isWarm = product.theme === "warm";
  const visual = productVisuals[product.slug];

  return (
    <article
      className={`group overflow-hidden rounded-[28px] border p-6 transition duration-300 hover:-translate-y-1 md:rounded-[40px] md:p-8 ${
        isWarm
          ? "border-[#e1d2c1] bg-[linear-gradient(180deg,#f9f1e8_0%,#f4ece2_100%)]"
          : "border-[#d8dfed] bg-[linear-gradient(180deg,#f8fbff_0%,#eef3fa_100%)]"
      }`}
    >
      <div className="relative mb-8 h-80 overflow-hidden rounded-[24px] md:h-[24rem] md:rounded-[32px] lg:h-[27rem]">
        <Image
          src={visual.card}
          alt={visual.alt}
          fill
          className="object-cover transition duration-500 group-hover:scale-[1.04]"
          sizes="(max-width: 1024px) 100vw, 40vw"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0)_28%,rgba(21,18,15,0.42)_100%)]" />
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <p className="text-xs uppercase tracking-[0.3em] text-white/75">
            {isWarm ? "Day Care" : "Night Care"}
          </p>
          <p className="mt-2 text-lg font-medium">{product.tagline}</p>
        </div>
      </div>

      <div className="space-y-4">
        <p className="text-xs uppercase tracking-[0.3em] text-stone-500">{product.englishName}</p>
        <div>
          <h3 className="display-font text-4xl font-semibold leading-none text-stone-900 md:text-5xl">
            {product.shortName}
          </h3>
          <p className="mt-3 text-sm leading-7 text-stone-600">{product.heroDescription}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {product.keywords.map((keyword) => (
            <span
              key={keyword}
              className="rounded-full border border-[rgba(116,88,59,0.14)] px-3 py-1 text-xs text-stone-700"
            >
              {keyword}
            </span>
          ))}
        </div>
        <div className="flex items-center justify-between pt-4">
          <p className="text-lg font-semibold text-stone-900">{formatCurrency(product.price)}</p>
          <Link
            href={`/products/${product.slug}`}
            className="rounded-full bg-stone-900 px-5 py-2.5 text-sm font-medium text-white"
          >
            Explore
          </Link>
        </div>
      </div>
    </article>
  );
}
