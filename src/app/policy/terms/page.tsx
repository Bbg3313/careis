export default function TermsPage() {
  return (
    <div className="space-y-8 pb-20">
      <section className="rounded-[36px] bg-white p-8 md:p-12">
        <p className="text-xs uppercase tracking-[0.3em] text-stone-500">Terms</p>
        <h1 className="mt-4 text-4xl font-semibold text-stone-900">이용약관</h1>
        <div className="mt-6 space-y-5 text-sm leading-8 text-stone-600">
          <p>CAREIS 쇼핑몰은 화장품 상품 판매와 관련한 기본 거래 조건을 안내합니다.</p>
          <p>
            주문 접수 후 결제 상태, 배송, 교환 및 반품 절차는 운영 정책에 따라 처리되며, PG
            연동 완료 이후에는 결제 수단별 승인 및 취소 정책이 추가로 반영될 수 있습니다.
          </p>
          <p>
            사이트 내 제품 정보는 기능성 화장품 기준과 브랜드 가이드에 따라 작성되며, 개인 피부
            상태에 따라 사용 경험은 달라질 수 있습니다.
          </p>
        </div>
      </section>
    </div>
  );
}
