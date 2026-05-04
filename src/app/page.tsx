import Image from "next/image";
import Link from "next/link";

import { MotionMedia } from "@/components/motion-media";
import { ProductCard } from "@/components/product-card";
import { SiteLogo } from "@/components/site-logo";
import { products, siteHighlights } from "@/lib/product-data";
import { homeVisuals, productVisuals } from "@/lib/site-assets";

export default function HomePage() {
  const sunPack = products.find((product) => product.slug === "sun-pack");
  const illuminator = products.find((product) => product.slug === "illuminator");

  return (
    <div className="space-y-28 pb-24">
      <section className="relative overflow-hidden rounded-[30px] bg-[#111111] shadow-[0_40px_140px_rgba(10,10,10,0.24)] md:rounded-[46px]">
        <MotionMedia
          frames={homeVisuals.heroMotion}
          alt="케어이즈 히어로 모션"
          priority
          className="absolute inset-0"
          overlayClassName="absolute inset-0 bg-[linear-gradient(90deg,rgba(9,9,9,0.82)_0%,rgba(9,9,9,0.38)_45%,rgba(9,9,9,0.58)_100%)]"
        />

        <div className="relative z-10 px-6 py-8 md:px-10 md:py-10 lg:px-14 lg:py-14">
          <div className="grid min-h-[72vh] gap-10 lg:min-h-[78vh] lg:grid-cols-[1.08fr_0.92fr] lg:items-end">
            <div className="flex h-full flex-col justify-between gap-12">
              <div className="pt-2">
                <SiteLogo dark compact />
              </div>

              <div className="max-w-3xl">
                <p className="text-xs uppercase tracking-[0.34em] text-white/60">
                  Hospital Distributed Dermacosmetic
                </p>
                <h1 className="display-font mt-6 text-5xl font-semibold leading-[0.92] text-white sm:text-6xl md:text-7xl lg:text-[5.5rem]">
                  Elevated dermacosmetic
                  <br className="hidden md:block" />
                  for clinics and curated retail.
                </h1>
                <p className="mt-8 max-w-2xl text-sm leading-8 text-white/72 md:text-base">
                  CAREIS는 병원과 클리닉에서 먼저 설명 가능한 제품 언어를 중심에 두고, 인플루언서
                  레퍼럴 구매는 그 다음 동선으로 자연스럽게 연결하는 하이엔드 더마코스메틱 브랜드
                  사이트를 지향합니다.
                </p>
                <div className="mt-10 flex flex-wrap gap-3">
                  <Link
                    href="/contact"
                    className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-stone-900"
                  >
                    도입 문의
                  </Link>
                  <Link
                    href="/products"
                    className="rounded-full border border-white/16 bg-white/8 px-6 py-3 text-sm font-semibold text-white backdrop-blur"
                  >
                    제품 소개
                  </Link>
                </div>
              </div>
            </div>

            <div className="grid gap-4 self-end sm:grid-cols-2 lg:grid-cols-1">
              <div className="soft-panel rounded-[24px] border border-white/10 p-6 text-stone-800 md:rounded-[30px]">
                <p className="text-[11px] uppercase tracking-[0.3em] text-stone-500">Brand Positioning</p>
                <p className="mt-4 text-lg font-semibold tracking-[-0.03em] text-stone-900 md:text-xl">
                  판매보다 먼저, 신뢰와 설명의 깊이를 보여줍니다.
                </p>
              </div>
              <div className="soft-panel rounded-[24px] border border-white/10 p-6 text-stone-800 md:rounded-[30px]">
                <p className="text-[11px] uppercase tracking-[0.3em] text-stone-500">Open Referral Purchase</p>
                <p className="mt-4 text-sm leading-7 text-stone-700">
                  레퍼럴 링크 유입은 공개 구매 동선으로 연결되며, 주문 데이터에는 추적 코드가 함께 남습니다.
                </p>
              </div>
              <div className="rounded-[24px] border border-white/10 bg-white/6 p-6 text-white backdrop-blur sm:col-span-2 lg:col-span-1 md:rounded-[30px]">
                <p className="text-[11px] uppercase tracking-[0.3em] text-white/55">Brand Film</p>
                <p className="mt-4 text-sm leading-7 text-white/78">
                  영상 자산이 들어오면 이 히어로 구조 그대로 교체할 수 있도록 설계했습니다.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {siteHighlights.map((highlight) => (
          <article
            key={highlight.title}
            className="rounded-[24px] border border-[rgba(116,88,59,0.12)] bg-white/85 p-8 shadow-[0_18px_60px_rgba(73,53,26,0.05)] md:rounded-[30px]"
          >
            <div className="h-12 w-12 rounded-full bg-[linear-gradient(135deg,#f0dcc3_0%,#dbe5f8_100%)]" />
            <h2 className="mt-6 text-2xl font-semibold tracking-[-0.03em] text-stone-900">{highlight.title}</h2>
            <p className="mt-3 text-sm leading-7 text-stone-600">{highlight.description}</p>
          </article>
        ))}
      </section>

      {sunPack && illuminator ? (
        <section className="overflow-hidden rounded-[30px] border border-[rgba(116,88,59,0.12)] bg-white shadow-[0_28px_90px_rgba(73,53,26,0.06)] md:rounded-[42px]">
          <div className="grid lg:grid-cols-2">
            <article className="relative isolate overflow-hidden bg-[linear-gradient(145deg,#fff6df_0%,#f5ead4_48%,#efe2cf_100%)] p-8 md:p-10 lg:p-12">
              <div className="absolute right-[-5%] top-[-6%] opacity-80">
                <SunAccent />
              </div>
              <div className="absolute inset-x-0 bottom-0 h-40 bg-[linear-gradient(180deg,rgba(255,255,255,0)_0%,rgba(255,248,233,0.82)_100%)]" />

              <div className="relative z-10 flex h-full flex-col justify-between gap-10">
                <div className="space-y-4">
                  <p className="text-xs uppercase tracking-[0.32em] text-[#9f7b47]">DAY CARE</p>
                  <h2 className="display-font text-4xl font-semibold tracking-[-0.04em] text-stone-900 sm:text-5xl md:text-6xl">
                    해가 떠 있는 시간엔
                    <br className="hidden sm:block" /> 보호가 먼저입니다.
                  </h2>
                  <p className="max-w-xl text-sm leading-8 text-stone-700 md:text-base">
                    외출, 야외 활동, 메이크업 루틴까지 고려한 선 보호 제품이 먼저 전면에 보여야
                    합니다. 밝은 톤의 데이 케어 무드에서 선팩의 역할이 즉시 읽히도록 구성했습니다.
                  </p>
                </div>

                <div className="grid items-end gap-8 md:grid-cols-[1fr_220px]">
                  <div className="space-y-5">
                    <div className="rounded-[24px] border border-[#d7bf96] bg-white/55 p-5 backdrop-blur">
                      <p className="text-[11px] uppercase tracking-[0.28em] text-[#9f7b47]">Use This When</p>
                      <p className="mt-3 text-lg font-semibold tracking-[-0.03em] text-stone-900">
                        낮 동안 자외선과 외부 환경으로부터 피부를 지켜야 할 때
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      <Link
                        href="/products/sun-pack"
                        className="rounded-full bg-stone-900 px-6 py-3 text-sm font-semibold text-white"
                      >
                        선팩 상세 보기
                      </Link>
                      <Link
                        href="/order?product=sun-pack"
                        className="rounded-full border border-stone-900/10 bg-white/70 px-6 py-3 text-sm font-semibold text-stone-900"
                      >
                        데이 케어 구매
                      </Link>
                    </div>
                  </div>

                  <div className="relative h-64 md:h-72">
                    <Image
                      src={productVisuals["sun-pack"].card}
                      alt={productVisuals["sun-pack"].alt}
                      fill
                      className="object-contain drop-shadow-[0_28px_40px_rgba(115,85,36,0.22)]"
                      sizes="220px"
                    />
                  </div>
                </div>
              </div>
            </article>

            <article className="relative isolate overflow-hidden bg-[linear-gradient(145deg,#131722_0%,#1b2131_44%,#0d1019_100%)] p-8 text-white md:p-10 lg:p-12">
              <div className="absolute right-[-2%] top-[-8%] opacity-90">
                <MoonAccent />
              </div>
              <div className="absolute left-10 top-16 h-28 w-28 rounded-full bg-[#95a4ff]/12 blur-3xl" />
              <div className="absolute inset-x-0 bottom-0 h-40 bg-[linear-gradient(180deg,rgba(10,12,20,0)_0%,rgba(10,12,20,0.84)_100%)]" />

              <div className="relative z-10 flex h-full flex-col justify-between gap-10">
                <div className="space-y-4">
                  <p className="text-xs uppercase tracking-[0.32em] text-[#a8b4ff]">NIGHT CARE</p>
                  <h2 className="display-font text-4xl font-semibold tracking-[-0.04em] text-white sm:text-5xl md:text-6xl">
                    밤에는 설명보다
                    <br className="hidden sm:block" /> 집중 관리가 중요합니다.
                  </h2>
                  <p className="max-w-xl text-sm leading-8 text-white/76 md:text-base">
                    색소 고민과 브라이트닝 니즈가 올라오는 시간에는 강한 나이트 케어 무드가
                    필요합니다. 어두운 배경과 달 모티프로 일루미네이터의 집중 루틴을 바로 이해시키는
                    구조로 바꿨습니다.
                  </p>
                </div>

                <div className="grid items-end gap-8 md:grid-cols-[1fr_220px]">
                  <div className="space-y-5">
                    <div className="rounded-[24px] border border-white/10 bg-white/8 p-5 backdrop-blur">
                      <p className="text-[11px] uppercase tracking-[0.28em] text-[#a8b4ff]">Use This When</p>
                      <p className="mt-3 text-lg font-semibold tracking-[-0.03em] text-white">
                        밤 시간대 집중 케어와 브라이트닝 루틴을 강하게 어필해야 할 때
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      <Link
                        href="/products/illuminator"
                        className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-stone-900"
                      >
                        일루미네이터 상세 보기
                      </Link>
                      <Link
                        href="/order?product=illuminator"
                        className="rounded-full border border-white/16 bg-white/8 px-6 py-3 text-sm font-semibold text-white"
                      >
                        나이트 케어 구매
                      </Link>
                    </div>
                  </div>

                  <div className="relative h-64 md:h-72">
                    <Image
                      src={productVisuals["illuminator"].card}
                      alt={productVisuals["illuminator"].alt}
                      fill
                      className="object-contain drop-shadow-[0_28px_40px_rgba(0,0,0,0.34)]"
                      sizes="220px"
                    />
                  </div>
                </div>
              </div>
            </article>
          </div>
        </section>
      ) : null}

      <section className="grid gap-6 lg:grid-cols-2">
        {products.map((product) => (
          <ProductCard key={product.slug} product={product} />
        ))}
      </section>

      <section className="grid gap-8 lg:grid-cols-[1.12fr_0.88fr] lg:items-center">
        <div className="relative min-h-[520px] overflow-hidden rounded-[40px] bg-[#111111] shadow-[0_40px_120px_rgba(11,11,11,0.18)]">
          <MotionMedia
            frames={homeVisuals.brandFilm}
            alt="케어이즈 브랜드 필름 무드"
            className="absolute inset-0"
            overlayClassName="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.14)_0%,rgba(0,0,0,0.52)_100%)]"
          />
          <div className="absolute bottom-0 left-0 right-0 p-8 text-white md:p-10">
            <p className="text-xs uppercase tracking-[0.34em] text-white/62">Brand Film Section</p>
            <p className="mt-4 max-w-xl text-2xl font-semibold tracking-[-0.03em]">
              시네마틱 무드와 브랜드 신뢰를 동시에 보여주는 메인 비주얼 섹션.
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <p className="text-xs uppercase tracking-[0.3em] text-stone-500">Visual Direction</p>
          <h2 className="display-font text-5xl font-semibold tracking-[-0.03em] text-stone-900 md:text-6xl">
            Hero first.
            <br />
            Explanation later.
          </h2>
          <p className="text-sm leading-8 text-stone-600 md:text-base">
            첫 화면에서 모든 걸 설명하려 하지 않고, 영상 같은 모션과 이미지의 질감으로 브랜드
            인상을 먼저 만든 뒤, 아래 섹션에서 기술과 제품 이야기를 차분하게 이어가는 구성이 더
            현대적이고 고급스럽습니다.
          </p>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-[28px] bg-white p-6 shadow-[0_20px_60px_rgba(70,50,24,0.05)]">
              <p className="text-sm font-semibold text-stone-900">B2B Inquiry First</p>
              <p className="mt-3 text-sm leading-7 text-stone-600">
                병원/클리닉 도입 문의를 메인 CTA로 유지합니다.
              </p>
            </div>
            <div className="rounded-[28px] bg-white p-6 shadow-[0_20px_60px_rgba(70,50,24,0.05)]">
              <p className="text-sm font-semibold text-stone-900">Referral Purchase Open</p>
              <p className="mt-3 text-sm leading-7 text-stone-600">
                공개 구매 동선은 살리되, 메인 구조는 브랜드 중심으로 정리합니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <article className="rounded-[38px] bg-stone-900 px-8 py-12 text-white shadow-[0_40px_100px_rgba(23,19,18,0.18)] md:px-12 md:py-16">
          <p className="text-xs uppercase tracking-[0.3em] text-white/60">B2B Inquiry</p>
          <h2 className="mt-4 text-3xl font-semibold tracking-[-0.03em] md:text-5xl">
            병원 및 클리닉 도입 문의를 우선합니다.
          </h2>
          <p className="mt-4 text-sm leading-8 text-white/75 md:text-base">
            사이트의 1차 목적은 구매보다 브랜드 소개와 제품 이해입니다. 도입 상담, 운영 방향,
            제품 포지셔닝 문의는 전용 문의 페이지에서 연결됩니다.
          </p>
          <div className="mt-8">
            <Link
              href="/contact"
              className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-stone-900"
            >
              도입 문의하기
            </Link>
          </div>
        </article>

        <article className="rounded-[38px] border border-[rgba(116,88,59,0.12)] bg-white px-8 py-12 shadow-[0_24px_80px_rgba(73,53,26,0.05)] md:px-12 md:py-16">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-stone-500">Open Referral Purchase</p>
            <h2 className="mt-4 text-3xl font-semibold tracking-[-0.03em] text-stone-900 md:text-5xl">
              인플루언서용 레퍼럴 구매도 공개적으로 운영할 수 있습니다.
            </h2>
          </div>
          <div className="mt-4 space-y-5">
            <p className="text-sm leading-8 text-stone-600 md:text-base">
              `?ref=mina` 같은 링크 유입은 브라우저에 저장되고, 주문 저장 시 `referral_code`,
              `paymentMethod`, `paymentStatus`와 함께 DB에 남습니다. 즉, 사이트는 B2B 중심이지만
              인플루언서 공구 운영도 동시에 감당할 수 있습니다.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/order?product=sun-pack"
                className="rounded-full bg-stone-900 px-6 py-3 text-sm font-semibold text-white"
              >
                레퍼럴 구매 보기
              </Link>
            </div>
          </div>
        </article>
      </section>
    </div>
  );
}

function SunAccent() {
  return (
    <svg width="220" height="220" viewBox="0 0 220 220" fill="none" aria-hidden="true">
      <circle cx="110" cy="110" r="38" fill="#F7D27A" />
      <circle cx="110" cy="110" r="60" stroke="#E1B157" strokeOpacity="0.34" strokeWidth="2" />
      {Array.from({ length: 12 }).map((_, index) => {
        const angle = (index * Math.PI) / 6;
        const x1 = 110 + Math.cos(angle) * 78;
        const y1 = 110 + Math.sin(angle) * 78;
        const x2 = 110 + Math.cos(angle) * 102;
        const y2 = 110 + Math.sin(angle) * 102;

        return (
          <line
            key={index}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="#D09B45"
            strokeOpacity="0.72"
            strokeWidth="3"
            strokeLinecap="round"
          />
        );
      })}
    </svg>
  );
}

function MoonAccent() {
  return (
    <svg width="220" height="220" viewBox="0 0 220 220" fill="none" aria-hidden="true">
      <circle cx="138" cy="92" r="54" fill="#CED6FF" fillOpacity="0.94" />
      <circle cx="158" cy="82" r="54" fill="#131722" />
      <circle cx="78" cy="54" r="3.5" fill="#D9DFFF" />
      <circle cx="104" cy="34" r="2.5" fill="#D9DFFF" />
      <circle cx="56" cy="98" r="2.5" fill="#D9DFFF" />
      <circle cx="168" cy="146" r="3" fill="#A8B4FF" fillOpacity="0.8" />
    </svg>
  );
}
