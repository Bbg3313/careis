import Link from "next/link";

export default async function OrderCompletePage({
  searchParams,
}: {
  searchParams: Promise<{ orderNumber?: string; paymentStatus?: string }>;
}) {
  const params = await searchParams;
  const paymentStatus = params.paymentStatus ?? "PENDING";
  const title =
    paymentStatus === "PAID"
      ? "결제가 완료되었습니다."
      : paymentStatus === "CANCELLED"
        ? "결제가 취소되었습니다."
        : paymentStatus === "REFUNDED"
          ? "환불이 완료되었습니다."
          : "주문이 정상 접수되었습니다.";
  const description =
    paymentStatus === "PAID"
      ? "결제 확인이 완료되어 상품 준비가 시작됩니다. 배송 진행 상황은 고객센터를 통해 안내받을 수 있습니다."
      : paymentStatus === "CANCELLED"
        ? "결제가 승인되지 않았거나 사용자가 결제를 중단했습니다. 다시 주문을 진행하려면 주문 페이지에서 재시도해주세요."
        : paymentStatus === "REFUNDED"
          ? "환불 처리 상태는 결제수단별 반영 시점에 따라 차이가 있을 수 있습니다. 자세한 내용은 고객센터로 문의해주세요."
          : "주문 정보가 저장되었으며 결제 진행 상태에 따라 추가 확인이 필요할 수 있습니다. 주문번호를 보관해주세요.";

  return (
    <div className="pb-20">
      <section className="rounded-[40px] bg-white p-10 text-center md:p-16">
        <p className="text-xs uppercase tracking-[0.34em] text-stone-500">Order Complete</p>
        <h1 className="headline-balance mt-4 text-4xl font-semibold text-stone-900 md:text-5xl">
          {title}
        </h1>
        <p className="copy-pretty mt-4 text-sm leading-7 text-stone-600">
          주문번호는 <strong>{params.orderNumber ?? "-"}</strong> 입니다. 현재 상태는{" "}
          <strong>{formatPaymentStatus(paymentStatus)}</strong>이며, {description}
        </p>
        <div className="mx-auto mt-8 max-w-xl rounded-[28px] bg-[#f8f3ec] p-6 text-sm leading-7 text-stone-600">
          결제 및 배송 문의: 010-2556-3263
          <br />
          이메일: startupscon@gmail.com
          <br />
          운영시간: 평일 10:00~17:00 / 점심 12:00~13:00 / 주말·공휴일 휴무
          <br />
          운영정책은 이용약관, 개인정보처리방침, 배송/교환/반품 페이지에서 확인할 수 있습니다.
        </div>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/products" className="btn-luxe-primary rounded-full px-5 py-3 text-sm font-semibold">
            제품 계속 보기
          </Link>
          <Link href="/order" className="btn-luxe-secondary rounded-full px-5 py-3 text-sm font-semibold">
            다시 주문하기
          </Link>
        </div>
      </section>
    </div>
  );
}

function formatPaymentStatus(value: string) {
  switch (value) {
    case "PAID":
      return "결제 완료";
    case "CANCELLED":
      return "결제 취소";
    case "REFUNDED":
      return "환불 완료";
    case "PENDING":
      return "결제 대기";
    default:
      return value;
  }
}
