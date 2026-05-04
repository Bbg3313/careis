import { ProductCard } from "@/components/product-card";
import { products } from "@/lib/product-data";

export default function ProductsPage() {
  return (
    <div className="space-y-12 pb-24">
      <section className="space-y-4 rounded-[28px] bg-[linear-gradient(145deg,#fff8f1_0%,#eff3fb_100%)] p-8 shadow-[0_24px_80px_rgba(73,53,26,0.06)] md:rounded-[40px] md:p-12">
        <p className="text-xs uppercase tracking-[0.34em] text-stone-500">Products</p>
        <h1 className="display-font text-4xl font-semibold text-stone-900 sm:text-5xl md:text-6xl">2개의 핵심 SKU로 구성된 루틴</h1>
        <p className="max-w-3xl text-sm leading-8 text-stone-600 md:text-base">
          많은 제품을 나열하기보다, 보호와 집중 관리라는 분명한 역할을 가진 제품 2개에 집중해
          설명합니다.
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
