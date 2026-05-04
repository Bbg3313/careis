export default function PrivacyPage() {
  return (
    <div className="space-y-8 pb-20">
      <section className="rounded-[36px] bg-white p-8 md:p-12">
        <p className="text-xs uppercase tracking-[0.3em] text-stone-500">Privacy</p>
        <h1 className="mt-4 text-4xl font-semibold text-stone-900">개인정보처리방침</h1>
        <div className="mt-6 space-y-5 text-sm leading-8 text-stone-600">
          <p>
            주문 과정에서 수집하는 정보는 주문 처리, 배송, 고객 응대, 결제 상태 관리에 필요한
            범위 내에서만 사용됩니다.
          </p>
          <p>
            수집 항목은 이름, 연락처, 주소, 우편번호, 주문 메모, 결제수단, 레퍼럴 코드 등으로
            구성됩니다.
          </p>
          <p>
            레퍼럴 코드는 인플루언서 공구 성과 측정과 정산 목적으로 저장되며, 주문 데이터와 함께
            관리자 화면 및 엑셀 다운로드에 포함될 수 있습니다.
          </p>
        </div>
      </section>
    </div>
  );
}
