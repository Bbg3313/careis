import { SiteLogo } from "@/components/site-logo";

export default function ContactPage() {
  return (
    <div className="space-y-12 pb-24">
      <section className="rounded-[42px] bg-[linear-gradient(145deg,#fbf3eb_0%,#eef3fa_100%)] p-10 shadow-[0_30px_90px_rgba(62,46,24,0.08)] md:p-14">
        <div className="mb-6">
          <SiteLogo compact />
        </div>
        <p className="text-xs uppercase tracking-[0.34em] text-stone-500">Partnership Contact</p>
        <h1 className="display-font headline-balance mt-4 text-5xl font-semibold text-stone-900 md:text-6xl">
          제휴 및 파트너십 문의
        </h1>
        <p className="copy-pretty mt-6 max-w-3xl text-base leading-8 text-stone-600 md:text-lg">
          CAREIS는 일반 구매를 메인으로 운영하되, 입점 제안이나 제휴 협업, 파트너십 문의가 필요한
          경우 별도 채널로 소통할 수 있도록 준비했습니다.
        </p>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <article className="rounded-[32px] border border-[rgba(116,88,59,0.12)] bg-white p-8 shadow-[0_18px_60px_rgba(73,53,26,0.05)]">
          <p className="text-sm font-semibold text-stone-900">문의 채널</p>
          <div className="mt-5 space-y-4 text-sm leading-8 text-stone-600">
            <p>
              <strong className="text-stone-900">전화</strong>: 010-2556-3263
            </p>
            <p>
              <strong className="text-stone-900">운영시간</strong>: 평일 10:00~17:00 · 점심 12:00~13:00 · 주말·공휴일 휴무
            </p>
            <p>
              <strong className="text-stone-900">인스타그램</strong>: @careis.official
            </p>
            <p>
              <strong className="text-stone-900">이메일</strong>: startupscon@gmail.com
            </p>
            <p className="copy-pretty">
              <strong className="text-stone-900">주소</strong>: 서울 강남구 역삼동 테헤란로 43길 14,
              청수빌딩 13층
            </p>
            <p>
              <strong className="text-stone-900">사업자번호</strong>: 215-86-78967
            </p>
            <p>
              <strong className="text-stone-900">통신판매업</strong>: 제2012-서울강남-01016호
            </p>
          </div>
        </article>

        <article className="rounded-[32px] border border-[rgba(116,88,59,0.12)] bg-white p-8 shadow-[0_18px_60px_rgba(73,53,26,0.05)]">
          <p className="text-sm font-semibold text-stone-900">고객센터 및 안내</p>
          <div className="mt-5 space-y-3 text-sm leading-8 text-stone-600">
            <p>- 주문, 결제, 배송, 교환·반품 및 제휴·파트너십 문의는 고객센터 채널(위 연락처)로 접수할 수 있습니다.</p>
            <p>- 사업자 정보와 운영 정책은 푸터 및 정책안내 페이지에서 확인할 수 있습니다.</p>
          </div>
        </article>
      </section>
    </div>
  );
}
