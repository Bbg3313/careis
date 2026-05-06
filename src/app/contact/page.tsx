import { SiteLogo } from "@/components/site-logo";

export default function ContactPage() {
  return (
    <div className="space-y-12 pb-24">
      <section className="rounded-[42px] bg-[linear-gradient(145deg,#fbf3eb_0%,#eef3fa_100%)] p-10 shadow-[0_30px_90px_rgba(62,46,24,0.08)] md:p-14">
        <div className="mb-6">
          <SiteLogo compact />
        </div>
        <p className="text-xs uppercase tracking-[0.34em] text-stone-500">B2B Inquiry</p>
        <h1 className="display-font headline-balance mt-4 text-5xl font-semibold text-stone-900 md:text-6xl">
          병원 및 클리닉 도입 문의
        </h1>
        <p className="copy-pretty mt-6 max-w-3xl text-base leading-8 text-stone-600 md:text-lg">
          CAREIS는 병원 유통 기반의 더마코스메틱 브랜드로, 제품 도입 상담과 운영 방향에 맞춘 제안
          흐름을 우선합니다. 아래 채널을 통해 제품 소개, 유통 검토, 운영 방향 상담을 접수할 수
          있습니다.
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
          <p className="text-sm font-semibold text-stone-900">도입 상담 항목</p>
          <ul className="mt-5 space-y-3 text-sm leading-8 text-stone-600">
            <li>- 병원 및 클리닉 채널 유통 가능 여부</li>
            <li>- 선팩 / 일루미네이터 도입 우선순위 및 운영 방향</li>
            <li>- 제품 소개서, 성분 포인트, 루틴 설명 자료 요청</li>
            <li>- 레퍼럴 구매 및 인플루언서 공구 연계 운영 여부</li>
          </ul>
        </article>
      </section>
    </div>
  );
}
