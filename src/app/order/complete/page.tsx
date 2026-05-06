import Link from "next/link";

export default async function OrderCompletePage({
  searchParams,
}: {
  searchParams: Promise<{ orderNumber?: string }>;
}) {
  const params = await searchParams;

  return (
    <div className="pb-20">
      <section className="rounded-[40px] bg-white p-10 text-center md:p-16">
        <p className="text-xs uppercase tracking-[0.34em] text-stone-500">Order Complete</p>
        <h1 className="mt-4 text-4xl font-semibold text-stone-900 md:text-5xl">주문이 저장되었습니다.</h1>
        <p className="mt-4 text-sm leading-7 text-stone-600">
          주문번호는 <strong>{params.orderNumber ?? "-"}</strong> 입니다. 현재 MVP에서는 주문 상태가
          `PENDING`으로 저장되며, 추후 PG 연동 시 결제 완료 콜백으로 `PAID` 처리할 수 있도록
          준비되어 있습니다.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/products" className="btn-luxe-primary rounded-full px-5 py-3 text-sm font-semibold">
            제품 계속 보기
          </Link>
          <Link
            href="/admin/orders"
            className="btn-luxe-secondary rounded-full px-5 py-3 text-sm font-semibold"
          >
            관리자 주문 확인
          </Link>
        </div>
      </section>
    </div>
  );
}
