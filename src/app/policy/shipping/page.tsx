import { BUSINESS_INFO } from "@/lib/business-info";

export default function ShippingPage() {
  return (
    <div className="space-y-8 pb-20">
      <section className="rounded-[36px] bg-white p-8 md:p-12">
        <p className="text-xs uppercase tracking-[0.3em] text-stone-500">Shipping</p>
        <h1 className="headline-balance mt-4 text-4xl font-semibold text-stone-900">배송 / 교환 / 반품</h1>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-stone-500">
          CAREIS의 배송 및 교환/반품 정책은 전자상거래 관련 법령을 기준으로 운영됩니다. 프로모션,
          도서산간 추가비용, 묶음배송 여부 등 세부 조건은 주문서와 결제 단계에서 최종 안내됩니다.
        </p>

        <div className="copy-pretty mt-8 space-y-8 text-sm leading-8 text-stone-600">
          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-stone-900">1. 배송 안내</h2>
            <p>주문 및 결제 완료 후 영업일 기준 순차 출고를 원칙으로 합니다.</p>
            <p>기본 배송비, 무료배송 적용 조건, 도서산간 추가비용은 주문 단계 또는 프로모션 공지에 따라 달라질 수 있습니다.</p>
            <p>주문량 증가, 재고 상황, 택배사 사정, 천재지변 등 불가피한 사유가 있는 경우 배송 일정이 지연될 수 있습니다.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-stone-900">2. 교환 및 반품 접수</h2>
            <p>단순 변심에 의한 교환 및 반품은 상품 수령일로부터 7일 이내 고객센터를 통해 접수할 수 있습니다.</p>
            <p>제품 하자, 오배송, 배송 중 파손의 경우 확인 후 교환 또는 반품 절차를 별도로 안내합니다.</p>
            <p>
              교환/반품 접수 전 고객센터 {BUSINESS_INFO.customerServicePhone} 또는 {BUSINESS_INFO.email}으로 먼저
              문의해주세요.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-stone-900">3. 교환 및 반품이 제한되는 경우</h2>
            <p>상품 개봉, 사용 흔적, 소비자 책임에 의한 훼손이 있는 경우에는 교환 및 반품이 제한될 수 있습니다.</p>
            <p>사전 접수 없이 임의 반송된 상품은 확인이 지연되거나 처리가 제한될 수 있습니다.</p>
            <p>상품 가치가 현저히 감소한 경우 또는 관련 법령상 청약철회 예외 사유에 해당하는 경우 반품이 제한됩니다.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-stone-900">4. 환불 안내</h2>
            <p>반품 상품이 회수되어 상태 확인이 완료되면 결제수단별 환불 절차가 진행됩니다.</p>
            <p>환불 반영 시점은 카드사, 간편결제사, 금융기관 정책에 따라 다를 수 있습니다.</p>
            <p>배송비 차감, 왕복 배송비, 부분 취소 가능 여부 등 세부 비용은 실제 운영 정책 확정 후 주문 단계에서 최종 고지됩니다.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-stone-900">5. 반품 주소 및 문의처</h2>
            <p>고객센터: {BUSINESS_INFO.customerServicePhone}</p>
            <p>이메일: {BUSINESS_INFO.email}</p>
            <p>운영시간: 평일 10:00~17:00 / 점심 12:00~13:00 / 주말·공휴일 휴무</p>
            <p>사업장 주소: {BUSINESS_INFO.addressDesktop}</p>
            <p>반품 주소 및 회수 방법은 상품과 사유에 따라 달라질 수 있으므로 접수 후 별도 안내드립니다.</p>
          </section>
        </div>
      </section>
    </div>
  );
}
