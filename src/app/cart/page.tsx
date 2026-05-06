import Image from "next/image";
import Link from "next/link";

import { getProductBySlug } from "@/lib/product-data";
import { productVisuals } from "@/lib/site-assets";
import { formatCurrency } from "@/lib/utils";

export default async function CartPage({
  searchParams,
}: {
  searchParams: Promise<{ product?: string; qty?: string }>;
}) {
  const params = await searchParams;
  const product = getProductBySlug(params.product ?? "sun-pack");
  const quantity = Math.max(1, Number(params.qty ?? "1"));

  const visual = product ? productVisuals[product.slug] : null;

  if (!product) {
    return (
      <div className="rounded-[36px] bg-white p-12 text-center">
        <p className="text-lg font-semibold text-stone-900">장바구니에 담긴 상품이 없습니다.</p>
        <Link href="/products" className="btn-luxe-primary mt-6 inline-flex rounded-full px-5 py-3 text-sm">
          제품 보러가기
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-10 pb-24">
      <section className="space-y-3">
        <p className="text-xs uppercase tracking-[0.3em] text-stone-500">Cart</p>
        <h1 className="display-font headline-balance text-5xl font-semibold text-stone-900">주문 전 상품 확인</h1>
      </section>

      <section className="grid gap-8 lg:grid-cols-[1fr_360px]">
        <article className="rounded-[36px] border border-[rgba(116,88,59,0.12)] bg-white p-8 shadow-[0_24px_80px_rgba(73,53,26,0.05)]">
          <div className="grid gap-6 md:grid-cols-[220px_1fr]">
            <div className="relative h-56 overflow-hidden rounded-[28px]">
              {visual ? (
                <Image src={visual.card} alt={visual.alt} fill className="object-cover" sizes="220px" />
              ) : null}
            </div>
            <div className="space-y-4">
              <p className="text-xs uppercase tracking-[0.28em] text-stone-500">{product.englishName}</p>
              <h2 className="headline-balance text-3xl font-semibold text-stone-900">{product.name}</h2>
              <p className="copy-pretty text-sm leading-7 text-stone-600">{product.tagline}</p>
              <div className="flex flex-wrap gap-2">
                {product.keywords.map((keyword) => (
                  <span key={keyword} className="rounded-full bg-[#f7f3ec] px-3 py-1 text-xs text-stone-700">
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </article>

        <aside className="rounded-[36px] border border-[rgba(116,88,59,0.12)] bg-[linear-gradient(180deg,#fbf6ef_0%,#f2e7d9_100%)] p-8 shadow-[0_24px_80px_rgba(73,53,26,0.05)]">
          <div className="space-y-4 text-sm text-stone-700">
            <div className="flex items-center justify-between">
              <span>상품금액</span>
              <strong>{formatCurrency(product.price)}</strong>
            </div>
            <div className="flex items-center justify-between">
              <span>수량</span>
              <strong>{quantity}개</strong>
            </div>
            <div className="flex items-center justify-between border-t border-stone-200 pt-4 text-base text-stone-900">
              <span>총 결제 예정 금액</span>
              <strong>{formatCurrency(product.price * quantity)}</strong>
            </div>
          </div>

          <Link
            href={`/order?product=${product.slug}&qty=${quantity}`}
            className="btn-luxe-primary mt-8 inline-flex w-full items-center justify-center rounded-full px-5 py-3 text-sm font-semibold"
          >
            주문서 작성하기
          </Link>
        </aside>
      </section>
    </div>
  );
}
