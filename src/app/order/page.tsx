import { redirect } from "next/navigation";

import { OrderForm } from "@/components/order-form";
import { getProductBySlug } from "@/lib/product-data";
import { getReferralCodeFromCookie } from "@/lib/referral";

export default async function OrderPage({
  searchParams,
}: {
  searchParams: Promise<{ product?: string; qty?: string }>;
}) {
  const params = await searchParams;
  const selectedProduct = params.product ? getProductBySlug(params.product) : null;

  if (params.product && !selectedProduct) {
    redirect("/products");
  }

  const referralCode = await getReferralCodeFromCookie();
  const quantity = Math.max(1, Number(params.qty ?? "1"));

  return (
    <div className="space-y-8 pb-24">
      <section className="space-y-3 rounded-[40px] bg-[linear-gradient(145deg,#fbf3eb_0%,#eef3fa_100%)] p-8 shadow-[0_24px_80px_rgba(73,53,26,0.05)] md:p-12">
        <p className="text-xs uppercase tracking-[0.3em] text-stone-500">Checkout</p>
        <h1 className="display-font headline-balance text-5xl font-semibold text-stone-900">주문서 작성</h1>
        <p className="copy-pretty max-w-2xl text-sm leading-8 text-stone-600">
          원하는 제품을 한 개만 고르거나, 두 제품을 함께 담아 바로 결제를 이어갈 수 있습니다. 추천
          코드가 있는 경우에는 함께 반영됩니다.
        </p>
      </section>

      <OrderForm
        referralCode={referralCode}
        initialItems={
          selectedProduct
            ? [
                {
                  productSlug: selectedProduct.slug,
                  quantity,
                },
              ]
            : []
        }
      />
    </div>
  );
}
