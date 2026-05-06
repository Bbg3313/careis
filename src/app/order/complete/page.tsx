import Link from "next/link";

export default async function OrderCompletePage({
  searchParams,
}: {
  searchParams: Promise<{ orderNumber?: string; paymentStatus?: string }>;
}) {
  const params = await searchParams;
  const paymentStatus = params.paymentStatus ?? "PENDING";
  const isPaid = paymentStatus === "PAID";

  return (
    <div className="pb-20">
      <section className="rounded-[40px] bg-white p-10 text-center md:p-16">
        <p className="text-xs uppercase tracking-[0.34em] text-stone-500">Order Complete</p>
        <h1 className="headline-balance mt-4 text-4xl font-semibold text-stone-900 md:text-5xl">
          {isPaid ? "결제가 완료되었습니다." : "주문이 저장되고 결제 요청이 준비되었습니다."}
        </h1>
        <p className="copy-pretty mt-4 text-sm leading-7 text-stone-600">
          주문번호는 <strong>{params.orderNumber ?? "-"}</strong> 입니다. 현재 상태는{" "}
          <strong>{paymentStatus}</strong>이며, PG 연동 구조상 주문 생성, 결제창 호출, 승인/실패
          콜백, 웹훅 반영까지 이어질 수 있도록 준비되어 있습니다.
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
