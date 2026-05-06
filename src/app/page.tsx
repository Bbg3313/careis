import Image from "next/image";
import Link from "next/link";

import { MotionMedia } from "@/components/motion-media";
import { products, siteHighlights } from "@/lib/product-data";
import { homeVisuals, productVisuals } from "@/lib/site-assets";

const highlightIcons = [BuildingIcon, SparklesIcon, ExpertIcon];

export default function HomePage() {
  const sunPack = products.find((product) => product.slug === "sun-pack");
  const illuminator = products.find((product) => product.slug === "illuminator");

  return (
    <div className="space-y-24 pb-24">
      <section className="relative overflow-hidden px-2 pb-8 pt-4">
        <div className="absolute right-[-2rem] top-8 h-48 w-48 rounded-full bg-[#d4af37]/10 blur-3xl" />
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div className="space-y-8 px-4 py-6 md:px-6 lg:px-0">
            <div className="space-y-4">
              <p className="text-[13px] uppercase tracking-[0.15em] text-stone-500">
                Hospital-Distributed Dermacosmetic
              </p>
              <h1 className="display-font headline-balance text-5xl font-semibold leading-[1.08] tracking-[-0.02em] text-stone-900 sm:text-6xl md:text-[64px]">
                병원 채널을 위한 2-Step Dermacosmetic
              </h1>
              <p className="copy-pretty max-w-xl pt-3 text-[15px] leading-[1.9] text-stone-600 md:text-[17px]">
                CAREIS는 병원과 클리닉에서 먼저 설명되고 도입될 수 있도록, 낮에는 보호하고 밤에는
                집중 관리하는 2-step 제품 구조를 제안합니다. 공개 구매는 가능하지만 사이트의 1차
                목적은 브랜드 소개와 도입 상담입니다.
              </p>
            </div>

            <div className="flex flex-wrap gap-4 pt-2">
              <Link
                href="/contact"
                className="btn-luxe-primary inline-flex items-center gap-2 px-8 py-4 text-[13px] tracking-[0.1em]"
              >
                도입 문의
                <ArrowAccent />
              </Link>
              <Link
                href="/products"
                className="border border-black/15 px-8 py-4 text-[13px] tracking-[0.1em] text-stone-900 transition hover:border-black/40"
              >
                제품 소개
              </Link>
            </div>
          </div>

          <div className="relative h-[440px] overflow-hidden bg-[linear-gradient(135deg,#f5f1ea_0%,#ffffff_100%)] md:h-[560px] lg:h-[640px]">
            <MotionMedia
              frames={homeVisuals.heroMotion}
              alt="CAREIS hero visual"
              priority
              className="absolute inset-0"
              overlayClassName="absolute inset-0 bg-[linear-gradient(135deg,rgba(245,241,234,0.16)_0%,rgba(255,255,255,0.22)_100%)]"
            />
          </div>
        </div>
      </section>

      <section className="relative left-1/2 right-1/2 -mx-[50vw] w-screen overflow-hidden bg-[#111111]">
        <div className="relative mx-auto min-h-[360px] w-full max-w-[1800px] px-4 py-6 md:min-h-[460px] md:px-6 md:py-8 lg:min-h-[560px] lg:px-8 lg:py-10">
          <div className="absolute inset-0 overflow-hidden">
            <video
              className="h-full w-full scale-[1.08] object-cover blur-[30px] opacity-45"
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
            >
              <source src="/media/main-banner.mp4" type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.05)_0%,rgba(17,17,17,0.2)_40%,rgba(8,8,8,0.72)_100%)]" />
          </div>

          <div className="relative mx-auto flex min-h-[348px] max-w-[1500px] items-center justify-center md:min-h-[444px] lg:min-h-[540px]">
            <div className="absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent_0%,rgba(212,184,140,0.45)_50%,transparent_100%)]" />
            <div className="absolute inset-x-0 bottom-0 h-px bg-[linear-gradient(90deg,transparent_0%,rgba(212,184,140,0.24)_50%,transparent_100%)]" />

            <div className="relative w-full overflow-hidden rounded-[28px] border border-white/10 bg-black/20 shadow-[0_30px_80px_rgba(0,0,0,0.32)] backdrop-blur-[6px] md:rounded-[34px]">
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.06)_0%,rgba(255,255,255,0)_22%,rgba(0,0,0,0.08)_100%)]" />
              <div className="aspect-[21/9] min-h-[280px] md:min-h-[360px] lg:min-h-[460px]">
                <video
                  className="h-full w-full object-contain"
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                >
                  <source src="/media/main-banner.mp4" type="video/mp4" />
                </video>
              </div>
            </div>

            <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-[linear-gradient(180deg,rgba(10,10,10,0)_0%,rgba(10,10,10,0.62)_100%)] px-6 py-8 text-white md:px-10 md:py-10 lg:px-14 lg:py-12">
              <div className="mx-auto max-w-7xl">
                <p className="text-[12px] uppercase tracking-[0.22em] text-white/60">Brand Motion</p>
                <p className="mt-3 max-w-xl text-lg font-medium tracking-[-0.02em] text-white/92 md:text-2xl">
                  제품보다 먼저 브랜드 톤을, 설명보다 먼저 신뢰의 무드를 보여주는 브랜드 모션
                  섹션입니다.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="brand" className="scroll-mt-32 bg-white px-4 py-20 md:px-6 md:py-24 md:scroll-mt-36 lg:scroll-mt-32">
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 text-center md:mb-20">
            <p className="mb-6 text-[13px] uppercase tracking-[0.15em] text-stone-500">
              Hospital-Distributed Excellence
            </p>
            <h2 className="display-font headline-balance text-4xl font-semibold leading-[1.2] tracking-[-0.02em] text-stone-900 md:text-[48px]">
              도입 전에 먼저 읽히는 브랜드 구조
            </h2>
            <p className="copy-pretty mx-auto mt-6 max-w-2xl text-[15px] leading-[1.9] text-stone-600 md:text-[16px]">
              피부과학 기반 설계와 의료기관 유통 경험을 바탕으로, 병원 현장에서 바로 설명할 수 있는
              제품 언어와 도입 상담 흐름을 함께 설계했습니다.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3 md:gap-8">
            {siteHighlights.map((highlight, index) => {
              const Icon = highlightIcons[index] ?? BuildingIcon;

              return (
                <article
                  key={highlight.title}
                  className="border border-black/5 bg-[#FAFAF8] p-10 md:p-12"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-black/5 text-stone-700">
                    <Icon />
                  </div>
                  <h3 className="mt-6 text-[20px] font-medium tracking-[-0.01em] text-stone-900">
                    {highlight.title}
                  </h3>
                  <p className="mt-4 text-[14px] leading-[1.8] text-stone-600">
                    {highlight.description}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {sunPack && illuminator ? (
        <section className="relative overflow-hidden scroll-mt-32 md:scroll-mt-36 lg:scroll-mt-32" id="product">
          <div className="grid min-h-[840px] lg:min-h-[100vh] lg:grid-cols-2">
            <article className="relative overflow-hidden bg-[linear-gradient(145deg,#FBF8F1_0%,#F5F1EA_55%,#EDE8DD_100%)] px-8 py-20">
              <div className="absolute inset-0 opacity-[0.12]">
                <Image
                  src={productVisuals["sun-pack"].gallery[4]}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="50vw"
                />
              </div>
              <div className="absolute right-12 top-12 h-72 w-72 rounded-full bg-[#D4AF37]/20 blur-3xl" />

              <div className="relative z-10 flex h-full flex-col items-center justify-center text-center">
                <div className="relative mb-10">
                  <SunHeroIcon />
                  <div className="absolute inset-0 rounded-full bg-[#D4AF37]/20 blur-xl" />
                </div>

                <p className="text-[13px] uppercase tracking-[0.2em] text-stone-500">Day Protection</p>
                <h2 className="display-font headline-balance mt-4 text-5xl font-semibold tracking-[-0.02em] text-stone-900 md:text-[56px]">
                  DAY CARE
                </h2>
                <p className="copy-pretty mx-auto mt-4 max-w-md text-[17px] leading-[1.8] text-stone-600">
                  특허 필름막 기술과 데일리 사용성을 함께 설계한 병원 유통 선케어
                </p>

                <div className="mt-10 border border-black/10 bg-white/65 p-6 md:p-7 backdrop-blur-sm">
                  <div className="relative h-72 w-56 md:h-80 md:w-64">
                    <Image
                      src={productVisuals["sun-pack"].card}
                      alt={productVisuals["sun-pack"].alt}
                      fill
                      className="object-contain drop-shadow-[0_24px_36px_rgba(104,78,41,0.22)]"
                      sizes="224px"
                    />
                  </div>
                </div>

                <Link
                  href="/products/sun-pack"
                  className="mt-8 inline-flex items-center gap-2 border border-black/20 bg-white/80 px-8 py-3 text-[13px] tracking-[0.1em] text-stone-900 transition hover:bg-white"
                >
                  자세히 보기
                  <ArrowAccent />
                </Link>
              </div>
            </article>

            <article className="relative overflow-hidden bg-[linear-gradient(145deg,#1A1F2E_0%,#252B3D_55%,#2A3247_100%)] px-8 py-20 text-white">
              <div className="absolute inset-0 opacity-[0.1]">
                <Image
                  src={productVisuals["illuminator"].hero}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="50vw"
                />
              </div>
              <div className="absolute left-12 top-12 h-72 w-72 rounded-full bg-[#7B8FA8]/20 blur-3xl" />

              <div className="relative z-10 flex h-full flex-col items-center justify-center text-center">
                <div className="relative mb-10">
                  <MoonHeroIcon />
                  <div className="absolute inset-0 rounded-full bg-[#A8BCD4]/20 blur-xl" />
                </div>

                <p className="text-[13px] uppercase tracking-[0.2em] text-white/55">Night Renewal</p>
                <h2 className="display-font headline-balance mt-4 text-5xl font-semibold tracking-[-0.02em] text-white md:text-[56px]">
                  NIGHT CARE
                </h2>
                <p className="copy-pretty mx-auto mt-4 max-w-md text-[17px] leading-[1.8] text-white/68">
                  시스테아민 5%와 ODT 프로토콜로 접근하는 야간 브라이트닝 집중 케어
                </p>

                <div className="mt-10 border border-white/10 bg-white/5 p-6 md:p-7 backdrop-blur-sm">
                  <div className="relative h-72 w-56 md:h-80 md:w-64">
                    <Image
                      src={productVisuals["illuminator"].card}
                      alt={productVisuals["illuminator"].alt}
                      fill
                      className="object-contain drop-shadow-[0_24px_36px_rgba(0,0,0,0.28)]"
                      sizes="224px"
                    />
                  </div>
                </div>

                <Link
                  href="/products/illuminator"
                  className="mt-8 inline-flex items-center gap-2 border border-white/20 bg-white/10 px-8 py-3 text-[13px] tracking-[0.1em] text-white transition hover:bg-white/15"
                >
                  자세히 보기
                  <ArrowAccent />
                </Link>
              </div>
            </article>
          </div>

          <div className="pointer-events-none absolute inset-y-0 left-1/2 hidden w-px -translate-x-1/2 bg-[linear-gradient(180deg,transparent_0%,rgba(0,0,0,0.18)_12%,rgba(0,0,0,0.18)_88%,transparent_100%)] lg:block" />
        </section>
      ) : null}

      <section className="bg-white px-4 py-24 md:px-6 md:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="mb-20 text-center md:mb-24">
            <p className="mb-6 text-[13px] uppercase tracking-[0.15em] text-stone-500">
              Two Essential Solutions
            </p>
            <h2 className="display-font headline-balance text-4xl font-semibold leading-[1.2] tracking-[-0.02em] text-stone-900 md:text-[48px]">
              낮과 밤을 나누는 2-Step 솔루션
            </h2>
          </div>

          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
            {products.map((product) => {
              const isWarm = product.theme === "warm";
              const visual = productVisuals[product.slug];

              return (
                <article key={product.slug} className="group">
                  <div
                    className={`relative mb-8 aspect-[3/4] overflow-hidden ${
                      isWarm
                        ? "bg-[linear-gradient(145deg,#FBF8F1_0%,#F0EBE3_100%)]"
                        : "bg-[linear-gradient(145deg,#2A3247_0%,#1A1F2E_100%)]"
                    }`}
                  >
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="relative h-80 w-64 md:h-[22rem] md:w-72">
                        <Image
                          src={visual.card}
                          alt={visual.alt}
                          fill
                          className="object-contain drop-shadow-[0_30px_40px_rgba(0,0,0,0.18)]"
                          sizes="(max-width: 1024px) 80vw, 28vw"
                        />
                      </div>
                    </div>
                    <div className="absolute right-8 top-8 text-stone-900/45">
                      {isWarm ? <SunMiniIcon /> : <MoonMiniIcon />}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <span className="text-[11px] uppercase tracking-[0.2em] text-stone-500">
                        {isWarm ? "Day Protection" : "Night Renewal"}
                      </span>
                      <div className="h-px flex-1 bg-black/10" />
                    </div>
                    <h3 className="display-font headline-balance text-[32px] font-semibold tracking-[-0.01em] text-stone-900">
                      {isWarm ? "DAY CARE" : "NIGHT CARE"}
                    </h3>
                    <div className="space-y-2 text-[15px] leading-[1.8] text-stone-600">
                      <p className="headline-balance font-medium text-stone-900/88">{product.tagline}</p>
                      <p className="copy-pretty">{product.heroDescription}</p>
                    </div>
                    <Link
                      href={`/products/${product.slug}`}
                      className="inline-block pt-2 text-[13px] tracking-[0.1em] text-stone-900 underline underline-offset-4 transition hover:text-stone-600"
                    >
                      제품 상세정보
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-[#1A1A1A] px-4 py-28 text-white md:px-6 md:py-36">
        <div className="absolute inset-0">
          <MotionMedia
            frames={homeVisuals.brandFilm}
            alt="CAREIS brand film"
            className="absolute inset-0"
            overlayClassName="absolute inset-0 bg-black/65"
          />
        </div>
        <div className="relative z-10 mx-auto max-w-5xl text-center">
          <p className="text-[13px] uppercase tracking-[0.2em] text-white/50">Visual Direction</p>
          <h2 className="display-font headline-balance mt-6 text-5xl font-semibold leading-[1.08] tracking-[-0.02em] md:text-[72px]">
            Hero First, Explanation Later
          </h2>
          <p className="copy-pretty mx-auto mt-8 max-w-2xl text-[16px] leading-[1.9] text-white/65">
            시각이 먼저 말하고, 제품이 증명합니다. 병원 유통 기반 브랜드가 가져야 할 정제된 무드와
            프리미엄 톤을 먼저 전달하는 비주얼 중심 섹션입니다.
          </p>
        </div>
      </section>

      <section
        id="inquiry"
        className="scroll-mt-32 bg-[linear-gradient(145deg,#FAFAF8_0%,#ffffff_100%)] px-4 py-24 md:px-6 md:py-32 md:scroll-mt-36 lg:scroll-mt-32"
      >
        <div className="mx-auto max-w-4xl border border-black/10 bg-white p-10 md:p-16">
          <div className="text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-black/5 text-stone-700">
              <BuildingIcon />
            </div>

            <p className="mt-8 text-[13px] uppercase tracking-[0.15em] text-stone-500">
              Partnership Inquiry
            </p>
            <h2 className="display-font headline-balance mt-4 text-4xl font-semibold leading-[1.2] tracking-[-0.02em] text-stone-900 md:text-[48px]">
              병원·클리닉 도입 문의
            </h2>
            <p className="copy-pretty mx-auto mt-6 max-w-xl text-[16px] leading-[1.9] text-stone-600">
              CAREIS는 병원, 클리닉, 에스테틱 파트너를 위한 도입 상담을 우선합니다. 유통 가능성,
              제품 포지셔닝, 루틴 제안 방식까지 함께 논의할 수 있도록 구성했습니다.
            </p>

            <div className="pt-10">
              <Link
                href="/contact"
                className="btn-luxe-primary inline-flex w-full max-w-md items-center justify-center px-12 py-5 text-[14px] tracking-[0.1em]"
              >
                병원·클리닉 도입 문의하기
              </Link>
              <p className="mt-4 text-[12px] text-stone-500">브랜드 소개, 제품 설명, 도입 검토는 별도 상담 흐름으로 연결됩니다.</p>
            </div>

            <div className="mt-12 grid gap-8 border-t border-black/5 pt-12 md:grid-cols-3">
              <InfoStat title="병원 유통 기반" description="클리닉 현장에서 설명 가능한 구조" />
              <InfoStat title="2 SKU 집중 운영" description="낮과 밤 루틴을 명확히 분리" />
              <InfoStat title="B2B 우선 설계" description="도입 문의를 가장 앞단에 배치" />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#FAFAF8] px-4 py-20 md:px-6 md:py-24">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-[13px] uppercase tracking-[0.15em] text-stone-500">Referral Purchase</p>
          <h2 className="display-font headline-balance mt-4 text-3xl font-semibold leading-[1.2] tracking-[-0.02em] text-stone-900 md:text-[36px]">
            추천을 통한 개인 구매
          </h2>
          <p className="copy-pretty mx-auto mt-6 max-w-2xl text-[15px] leading-[1.8] text-stone-600">
            병원 또는 전문가 추천이 있는 경우 공개 레퍼럴 링크를 통해 개인 구매도 가능합니다.
            주문 데이터에는 추천 코드와 결제수단이 함께 저장되어, 공구 운영과 추적 관리까지 이어질
            수 있도록 설계했습니다.
          </p>

          <div className="pt-10">
            <Link
              href="/order?product=sun-pack"
              className="inline-flex items-center gap-2 border border-black/20 px-10 py-4 text-[13px] tracking-[0.1em] text-stone-900 transition hover:border-black/40"
            >
              추천 코드로 구매하기
              <ArrowAccent />
            </Link>
          </div>

          <p className="mt-8 text-[11px] text-stone-500">
            * 추천 코드는 제휴 병원 또는 인플루언서 레퍼럴 링크를 통해 전달될 수 있습니다.
          </p>
        </div>
      </section>
    </div>
  );
}

function InfoStat({ title, description }: { title: string; description: string }) {
  return (
    <div className="space-y-2">
      <p className="text-xl font-medium text-stone-900 md:text-2xl">{title}</p>
      <p className="text-[12px] tracking-[0.1em] text-stone-500">{description}</p>
    </div>
  );
}

function ArrowAccent() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M2.5 7H11.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M7.75 3.25L11.5 7L7.75 10.75" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function BuildingIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M4 17V5.5L10 3L16 5.5V17" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8 17V12H12V17" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M7 8.5H7.01M10 8.5H10.01M13 8.5H13.01" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function SparklesIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M10 2.5L11.5 7L16 8.5L11.5 10L10 14.5L8.5 10L4 8.5L8.5 7L10 2.5Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
      <path d="M15 2.5L15.5 4L17 4.5L15.5 5L15 6.5L14.5 5L13 4.5L14.5 4L15 2.5Z" fill="currentColor" />
    </svg>
  );
}

function ExpertIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <circle cx="10" cy="6.5" r="3" stroke="currentColor" strokeWidth="1.4" />
      <path d="M4.5 16C5.2 13.6 7.25 12 10 12C12.75 12 14.8 13.6 15.5 16" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

function SunHeroIcon() {
  return (
    <svg width="84" height="84" viewBox="0 0 84 84" fill="none" aria-hidden="true" className="relative z-10 text-[#D4AF37]">
      <circle cx="42" cy="42" r="16" stroke="currentColor" strokeWidth="1.4" />
      {Array.from({ length: 8 }).map((_, index) => {
        const angle = (index * Math.PI) / 4;
        const x1 = 42 + Math.cos(angle) * 24;
        const y1 = 42 + Math.sin(angle) * 24;
        const x2 = 42 + Math.cos(angle) * 34;
        const y2 = 42 + Math.sin(angle) * 34;
        return <line key={index} x1={x1} y1={y1} x2={x2} y2={y2} stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />;
      })}
    </svg>
  );
}

function MoonHeroIcon() {
  return (
    <svg width="84" height="84" viewBox="0 0 84 84" fill="none" aria-hidden="true" className="relative z-10 text-[#A8BCD4]">
      <path
        d="M51.5 15.5C42 18.5 35.25 27.38 35.25 37.75C35.25 50.6 45.65 61 58.5 61C61.1 61 63.6 60.57 65.94 59.78C61.96 65.27 55.51 68.84 48.25 68.84C36.17 68.84 26.38 59.05 26.38 46.97C26.38 32.79 37.71 21.05 51.5 15.5Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SunMiniIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <circle cx="16" cy="16" r="6.5" stroke="currentColor" strokeWidth="1.2" />
      <path d="M16 3.5V7.5M16 24.5V28.5M28.5 16H24.5M7.5 16H3.5M24.84 7.16L22.01 9.99M9.99 22.01L7.16 24.84M24.84 24.84L22.01 22.01M9.99 9.99L7.16 7.16" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

function MoonMiniIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <path d="M22.2 5.8C18.64 6.92 16.11 10.25 16.11 14.14C16.11 18.95 20.01 22.85 24.82 22.85C25.79 22.85 26.72 22.69 27.6 22.39C26.11 24.44 23.69 25.77 20.96 25.77C16.42 25.77 12.74 22.09 12.74 17.55C12.74 12.22 17 7.81 22.2 5.8Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
    </svg>
  );
}
