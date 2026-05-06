import { ProductCard } from "@/components/product-card";
import { products } from "@/lib/product-data";

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
