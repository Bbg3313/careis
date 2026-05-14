import type { Metadata } from "next";

import { ProductCard } from "@/components/product-card";
import { products } from "@/lib/product-data";
import { SITE_NAME } from "@/lib/site-seo";

export const metadata: Metadata = {
  title: "제품",
  description:
    "심플스틱 선팩 SPF50+ / PA+++ 미백·주름개선 선케어, 일루미네이터 시스테아민 5% 야간 브라이트닝 집중 케어. CAREIS 시그니처 2-step 루틴을 한 페이지에서 비교합니다.",
  keywords: ["선팩", "일루미네이터", "시스테아민", "SPF50", "더마코스메틱", "CAREIS", "케어이즈"],
  alternates: { canonical: "/products" },
  openGraph: {
    url: "/products",
    title: `제품 · ${SITE_NAME}`,
    description:
      "낮에는 선케어, 밤에는 브라이트닝 집중 케어. 선팩과 일루미네이터 두 가지 시그니처 제품을 만나보세요.",
  },
};

export default function ProductsPage() {
  return (
    <div className="space-y-12 pb-24">
      <section className="space-y-4 rounded-[28px] bg-[linear-gradient(145deg,#fff8f1_0%,#eff3fb_100%)] p-8 shadow-[0_24px_80px_rgba(73,53,26,0.06)] md:rounded-[40px] md:p-12">
        <p className="text-xs uppercase tracking-[0.34em] text-stone-500">Products</p>
        <h1 className="display-font headline-balance text-4xl font-semibold text-stone-900 sm:text-5xl md:text-6xl">
          낮과 밤을 위한 2개의 시그니처 루틴
        </h1>
        <p className="copy-pretty max-w-3xl text-sm leading-8 text-stone-600 md:text-base">
          많은 제품을 나열하기보다, 낮에는 보호하고 밤에는 정돈하는 분명한 역할을 가진 두 제품에
          집중했습니다.
        </p>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        {products.map((product) => (
          <ProductCard key={product.slug} product={product} />
        ))}
      </div>
    </div>
  );
}
