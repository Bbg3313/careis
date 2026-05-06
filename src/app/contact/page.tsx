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
              <strong className="text-stone-900">전화</strong>: 070-4647-3263
            </p>
            <p>
              <strong className="text-stone-900">인스타그램</strong>: @careis.official
            </p>
            <p className="copy-pretty">
              <strong className="text-stone-900">주소</strong>: 서울 강남구 역삼동 테헤란로 43길 14,
              청수빌딩 13층
            </p>
          </div>
        </article>

        <article className="rounded-[32px] border border-[rgba(116,88,59,0.12)] bg-white p-8 shadow-[0_18px_60px_rgba(73,53,26,0.05)]">
          <p className="text-sm font-semibold text-stone-900">상담 가능 항목</p>
          <ul className="mt-5 space-y-3 text-sm leading-8 text-stone-600">
            <li>- 오프라인 입점 및 파트너십 운영 여부</li>
            <li>- 선팩 / 일루미네이터 제휴 판매 또는 협업 제안</li>
            <li>- 제품 소개 자료 및 콘텐츠 협업 요청</li>
            <li>- 레퍼럴 구매 및 인플루언서 공구 연계 운영 여부</li>
          </ul>
        </article>
      </section>
    </div>
  );
}
