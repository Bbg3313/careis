export default function ShippingPage() {
  return (
    <div className="space-y-8 pb-20">
      <section className="rounded-[36px] bg-white p-8 md:p-12">
        <p className="text-xs uppercase tracking-[0.3em] text-stone-500">Shipping</p>
        <h1 className="mt-4 text-4xl font-semibold text-stone-900">배송 / 교환 / 반품</h1>
        <div className="mt-6 space-y-5 text-sm leading-8 text-stone-600">
          <p>기본 배송비와 무료배송 기준은 운영 정책에 따라 조정 가능합니다.</p>
          <p>
            단순 변심에 의한 교환 및 반품은 상품 수령 후 7일 이내 가능하며, 개봉 또는 사용 흔적이
            있는 경우 제한될 수 있습니다.
          </p>
          <p>
            제품 하자 또는 오배송의 경우 고객센터 확인 후 교환 및 반품 절차를 안내합니다.
          </p>
        </div>
      </section>
    </div>
  );
}
