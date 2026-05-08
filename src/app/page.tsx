import Image from "next/image";
import Link from "next/link";

import { FeatureBannerSlider } from "@/components/feature-banner-slider";
import { HomeVideoBanner } from "@/components/home-video-banner";
import { MotionMedia } from "@/components/motion-media";
import { products } from "@/lib/product-data";
import { homeVisuals, productVisuals } from "@/lib/site-assets";

const featureBannerSlides = [
  {
    label: "NIGHT CARE",
    title: "밤사이 더 맑고 정돈된 피부",
    description:
      "시스테아민 5%와 나이아신아마이드, 알부틴을 담아 칙칙한 피부 인상을 더 환하고 정돈된 느낌으로 가꿔주는 브라이트닝 인텐시브 케어입니다.",
    highlights: ["색소 케어", "브라이트닝", "피부 결 정돈"],
    image: "/images/illum-model-banner.png",
    imageAlt: "일루미네이터 모델 비주얼",
    tone: "dark" as const,
  },
  {
    label: "DAY CARE",
    title: "햇빛 아래 더 맑고 편안한 피부",
    description:
      "가볍게 밀착되는 사용감과 자연스러운 피부 표현으로 자외선이 강한 날에도 부담 없이 손이 가는 프리미엄 선케어입니다.",
    highlights: ["자외선 보호", "데일리 선케어", "가벼운 밀착감"],
    image: "/images/sun-model-banner.png",
    imageAlt: "선팩 모델 비주얼",
    tone: "light" as const,
  },
];

export default function HomePage() {
  const sunPack = products.find((product) => product.slug === "sun-pack");
  const illuminator = products.find((product) => product.slug === "illuminator");

  return (
    <div className="space-y-16 pb-20 md:space-y-24 md:pb-24">
      <section className="relative overflow-hidden px-0 pb-6 pt-2 sm:px-2 md:pb-8 md:pt-4">
        <div className="absolute right-[-2rem] top-8 h-48 w-48 rounded-full bg-[#d4af37]/10 blur-3xl" />
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-10">
          <div className="space-y-6 px-5 py-5 md:px-6 md:py-6 lg:px-0">
            <div className="space-y-4">
              <p className="text-[13px] uppercase tracking-[0.15em] text-stone-500">
                Day To Night Dermacosmetic
              </p>
              <h1 className="display-font headline-balance text-[40px] font-semibold leading-[1.08] tracking-[-0.03em] text-stone-900 sm:text-5xl md:text-[64px]">
                낮과 밤을 채우는 2-Step Dermacosmetic
              </h1>
              <p className="copy-pretty max-w-xl pt-2 text-[15px] leading-[1.85] text-stone-600 md:pt-3 md:text-[17px]">
                CAREIS는 낮에는 가볍게 보호하고 밤에는 집중적으로 정돈하는 2-Step 루틴을 선보입니다.
                일상 속에서 매일 손이 가는 사용감과 프리미엄 무드를 담아, 하루의 피부 리듬을
                우아하게 채웁니다.
              </p>
            </div>

            <div className="flex flex-col gap-3 pt-1 sm:flex-row sm:flex-wrap sm:gap-4 sm:pt-2">
              <Link
                href="/order"
                className="btn-luxe-primary inline-flex w-full items-center justify-center gap-2 px-8 py-4 text-[13px] tracking-[0.1em] sm:w-auto"
              >
                구매하러 가기
                <ArrowAccent />
              </Link>
              <Link
                href="/products"
                className="inline-flex w-full items-center justify-center border border-black/15 px-8 py-4 text-[13px] tracking-[0.1em] text-stone-900 transition hover:border-black/40 sm:w-auto"
              >
                제품 보기
              </Link>
            </div>
          </div>

          <div className="hero-motion-root relative mx-auto w-full max-w-[440px] overflow-hidden rounded-[22px] bg-[linear-gradient(135deg,#f5f1ea_0%,#ffffff_100%)] aspect-[4/5] md:max-w-none md:aspect-auto md:h-[560px] md:rounded-none lg:h-[640px]">
            <MotionMedia
              frames={homeVisuals.heroMotion}
              alt="CAREIS hero visual"
              priority
              className="absolute inset-0"
              objectFit="contain"
              quality={92}
              overlayClassName="absolute inset-0 bg-[linear-gradient(135deg,rgba(245,241,234,0.16)_0%,rgba(255,255,255,0.22)_100%)]"
            />
          </div>
        </div>
      </section>

      <HomeVideoBanner />

      <section
        id="brand"
        className="relative scroll-mt-32 overflow-hidden bg-[linear-gradient(180deg,#fffdf9_0%,#f8f1e7_100%)] px-4 py-14 md:px-6 md:py-20 md:scroll-mt-36 lg:scroll-mt-32"
      >
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute right-[10%] top-0 h-40 w-40 rounded-full bg-[#c89f63]/12 blur-3xl md:h-52 md:w-52" />
          <div className="absolute bottom-0 left-[8%] h-36 w-36 rounded-full bg-[#ecd8bb]/20 blur-3xl md:h-48 md:w-48" />
        </div>

        <div className="relative mx-auto max-w-6xl">
          <header className="mx-auto max-w-2xl text-center">
            <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-[#8b673f]">CAREIS</p>
            <h2 className="display-font mt-3 text-[26px] font-semibold leading-snug tracking-[-0.03em] text-stone-900 md:text-[40px]">
              병원 채널에서 먼저 알려진 더마 루틴
            </h2>
            <p className="mt-4 text-[14px] leading-relaxed text-stone-600 md:text-[15px]">
              낮에는 보호, 밤에는 집중. 제품의 장점만 짧게 정리했습니다.
            </p>
          </header>

          <ul className="mx-auto mt-10 max-w-xl space-y-3 md:max-w-2xl">
            {[
              "병원·클리닉 유통 채널을 통해 먼저 소개된 라인",
              "낮·밤 역할을 나눈 2-Step 데일리 루틴",
              "선팩은 특허 필름 기술과 SPF50+ PA+++ 고보호",
              "일루미네이터는 시스테아민 5% 중심 야간 브라이트닝",
            ].map((line) => (
              <li
                key={line}
                className="flex gap-3 rounded-2xl border border-[rgba(184,145,86,0.14)] bg-white/75 px-4 py-3 text-[13px] leading-snug text-stone-800 shadow-[0_8px_24px_rgba(120,85,37,0.04)] md:px-5 md:py-3.5 md:text-[14px]"
              >
                <span className="mt-0.5 shrink-0 font-semibold text-[#b89156]" aria-hidden>
                  ·
                </span>
                <span className="[word-break:keep-all]">{line}</span>
              </li>
            ))}
          </ul>

          <div className="mx-auto mt-10 grid max-w-4xl gap-4 md:grid-cols-2 md:gap-5">
            <article className="rounded-[22px] border border-[rgba(184,145,86,0.16)] bg-[linear-gradient(180deg,#fffdfa_0%,#f7efe3_100%)] p-5 md:p-6">
              <div className="flex items-center justify-between gap-2">
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#8b673f]">선팩 · DAY</p>
                <span className="rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.12em] text-[#8b673f]">
                  Sun Pack
                </span>
              </div>
              <ul className="mt-4 space-y-2 text-[13px] leading-relaxed text-stone-700 md:text-[14px]">
                <li className="flex gap-2 [word-break:keep-all]">
                  <span className="text-[#b89156]">—</span>
                  특허 기반 셀룰로오스 필름 — 밀착·보호
                </li>
                <li className="flex gap-2 [word-break:keep-all]">
                  <span className="text-[#b89156]">—</span>
                  SPF50+ PA+++ 자외선 차단
                </li>
                <li className="flex gap-2 [word-break:keep-all]">
                  <span className="text-[#b89156]">—</span>
                  데일리용 가벼운 사용감
                </li>
              </ul>
            </article>

            <article className="rounded-[22px] border border-[rgba(184,145,86,0.14)] bg-[linear-gradient(180deg,#fffdfa_0%,#f4eee6_100%)] p-5 md:p-6">
              <div className="flex items-center justify-between gap-2">
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#8b673f]">일루미네이터 · NIGHT</p>
                <span className="rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.12em] text-[#8b673f]">
                  Illuminator
                </span>
              </div>
              <ul className="mt-4 space-y-2 text-[13px] leading-relaxed text-stone-700 md:text-[14px]">
                <li className="flex gap-2 [word-break:keep-all]">
                  <span className="text-[#b89156]">—</span>
                  시스테아민 5% 집중 케어
                </li>
                <li className="flex gap-2 [word-break:keep-all]">
                  <span className="text-[#b89156]">—</span>
                  야간 브라이트닝 · 색소 고민 보조
                </li>
                <li className="flex gap-2 [word-break:keep-all]">
                  <span className="text-[#b89156]">—</span>
                  밤 루틴으로 피부 결 정돈
                </li>
              </ul>
            </article>
          </div>

          <p className="mx-auto mt-10 max-w-md text-center text-[13px] text-stone-500 md:text-[14px]">
            상세 제품 정보는 아래 PRODUCT에서 확인할 수 있습니다.
          </p>
        </div>
      </section>

      {sunPack && illuminator ? (
        <section className="relative overflow-hidden scroll-mt-32 md:scroll-mt-36 lg:scroll-mt-32" id="product">
          <div className="bg-white px-4 pb-10 pt-6 md:px-6 md:pb-14 md:pt-8">
            <div className="relative mx-auto max-w-6xl overflow-hidden rounded-[28px] bg-[linear-gradient(145deg,#fbf7f0_0%,#ffffff_54%,#f7f1e8_100%)] px-5 py-8 md:rounded-[34px] md:px-10 md:py-14">
              <div className="absolute left-10 top-8 h-28 w-28 rounded-full bg-[#d4af37]/12 blur-3xl" />
              <div className="absolute bottom-6 right-10 h-32 w-32 rounded-full bg-[#8ea4c5]/12 blur-3xl" />

              <div className="relative text-center">
                <div className="flex flex-wrap items-center justify-center gap-3">
                  <span className="inline-flex items-center gap-2 rounded-full bg-white/72 px-4 py-2 text-[11px] uppercase tracking-[0.2em] text-stone-500">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#d4af37]" />
                    Day Signature
                  </span>
                  <span className="inline-flex items-center gap-2 rounded-full bg-white/72 px-4 py-2 text-[11px] uppercase tracking-[0.2em] text-stone-500">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#8ea4c5]" />
                    Night Signature
                  </span>
                </div>

                <p className="mt-8 text-[12px] uppercase tracking-[0.26em] text-stone-500">Two Essential Solutions</p>
                <h2 className="display-font headline-balance mt-5 text-[32px] font-semibold leading-[1.08] tracking-[-0.04em] text-stone-900 md:text-[64px]">
                  낮과 밤을 나누는
                  <span className="block text-[36px] italic tracking-[-0.03em] text-[#8b673f] md:text-[76px]">
                    2-Step Solution
                  </span>
                </h2>
                <p className="copy-pretty mx-auto mt-6 max-w-xl text-[15px] leading-[1.85] text-stone-600 md:text-[16px]">
                  햇빛 아래에서는 더 맑고 가볍게, 밤이 깊어질수록 더 차분하고 깊게.
                </p>
              </div>

              <div className="relative mt-8 flex flex-wrap items-center justify-center gap-4 text-[12px] uppercase tracking-[0.22em] md:gap-6">
                <span className="text-[#8b673f]">Light Protection</span>
                <span className="text-stone-400">Intensive Brightening</span>
              </div>
            </div>
          </div>

          <div className="grid gap-px overflow-hidden bg-[rgba(184,145,86,0.1)] lg:min-h-[100vh] lg:grid-cols-2">
            <article className="relative overflow-hidden bg-[linear-gradient(145deg,#FBF8F1_0%,#F5F1EA_55%,#EDE8DD_100%)] px-5 py-14 md:px-8 md:py-20">
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
                <div className="relative mb-8 md:mb-10">
                  <SunHeroIcon />
                  <div className="absolute inset-0 rounded-full bg-[#D4AF37]/20 blur-xl" />
                </div>

                <p className="text-[13px] uppercase tracking-[0.2em] text-stone-500">Day Protection</p>
                <h2 className="display-font headline-balance mt-4 text-[40px] font-semibold tracking-[-0.02em] text-stone-900 md:text-[56px]">
                  DAY CARE
                </h2>
                <div className="mt-5 space-y-2 text-center text-stone-700">
                  <p className="text-[18px] leading-[1.75] md:text-[20px]">
                    자외선으로부터 피부를 보호하는
                  </p>
                  <p className="text-[18px] leading-[1.75] md:text-[20px]">
                    프리미엄 선케어 솔루션
                  </p>
                </div>

                <div className="group mt-8 overflow-hidden border border-black/8 bg-white/50 p-4 transition duration-500 hover:border-black/12 hover:bg-white/60 hover:shadow-[0_18px_40px_rgba(104,78,41,0.12)] md:mt-10 md:p-6 backdrop-blur-sm">
                  <div className="relative h-[18rem] w-[14rem] md:h-[28rem] md:w-[21rem]">
                    <Image
                      src="/images/sunpack-thumb-02.png"
                      alt={productVisuals["sun-pack"].alt}
                      fill
                      className="cursor-zoom-in object-contain drop-shadow-[0_24px_36px_rgba(104,78,41,0.22)] transition-transform duration-500 ease-out group-hover:scale-[1.12]"
                      sizes="(max-width: 768px) 272px, 336px"
                    />
                  </div>
                </div>

                <div className="mx-auto mt-6 max-w-md md:mt-8">
                  <p className="copy-pretty text-[15px] leading-[1.9] text-stone-600 md:text-[16px]">
                    백탁과 답답함 부담을 낮추고, 메이크업 전후에도 자연스럽게 손이 가는 데일리 선케어
                    루틴입니다.
                  </p>
                </div>

                <Link
                  href="/products/sun-pack"
                  className="mt-8 inline-flex w-full items-center justify-center gap-2 border border-black/20 bg-white/80 px-8 py-3 text-[13px] tracking-[0.1em] text-stone-900 transition hover:bg-white sm:w-auto"
                >
                  자세히 보기
                  <ArrowAccent />
                </Link>
              </div>
            </article>

            <article className="relative overflow-hidden bg-[linear-gradient(145deg,#1A1F2E_0%,#252B3D_55%,#2A3247_100%)] px-5 py-14 text-white md:px-8 md:py-20">
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
                <div className="relative mb-8 md:mb-10">
                  <MoonHeroIcon />
                  <div className="absolute inset-0 rounded-full bg-[#A8BCD4]/20 blur-xl" />
                </div>

                <p className="text-[13px] uppercase tracking-[0.2em] text-white/55">Night Renewal</p>
                <h2 className="display-font headline-balance mt-4 text-[40px] font-semibold tracking-[-0.02em] text-white md:text-[56px]">
                  NIGHT CARE
                </h2>
                <div className="mt-5 space-y-2 text-center text-white/82">
                  <p className="text-[18px] leading-[1.75] md:text-[20px]">
                    밤사이 집중 관리하는
                  </p>
                  <p className="text-[18px] leading-[1.75] md:text-[20px]">
                    브라이트닝 인텐시브 케어
                  </p>
                </div>

                <div className="group mt-8 overflow-hidden border border-white/10 bg-white/5 p-4 transition duration-500 hover:border-white/16 hover:bg-white/8 hover:shadow-[0_18px_40px_rgba(0,0,0,0.18)] md:mt-10 md:p-6 backdrop-blur-sm">
                  <div className="relative h-[18rem] w-[14rem] md:h-[28rem] md:w-[21rem]">
                    <Image
                      src={productVisuals["illuminator"].card}
                      alt={productVisuals["illuminator"].alt}
                      fill
                      className="cursor-zoom-in object-contain drop-shadow-[0_24px_36px_rgba(0,0,0,0.28)] transition-transform duration-500 ease-out group-hover:scale-[1.12]"
                      sizes="(max-width: 768px) 272px, 336px"
                    />
                  </div>
                </div>

                <div className="mx-auto mt-6 max-w-md md:mt-8">
                  <p className="copy-pretty text-[15px] leading-[1.9] text-white/72 md:text-[16px]">
                    기미, 잡티, PIH 고민을 위한 야간 브라이트닝 루틴으로, 더 맑고 정돈된 피부 컨디션을
                    차분하게 완성합니다.
                  </p>
                </div>

                <Link
                  href="/products/illuminator"
                  className="mt-8 inline-flex w-full items-center justify-center gap-2 border border-white/20 bg-white/10 px-8 py-3 text-[13px] tracking-[0.1em] text-white transition hover:bg-white/15 sm:w-auto"
                >
                  자세히 보기
                  <ArrowAccent />
                </Link>
              </div>
            </article>
          </div>
        </section>
      ) : null}

      <section className="overflow-x-clip py-8 md:py-10">
        <FeatureBannerSlider slides={featureBannerSlides} />
      </section>

      <section
        id="inquiry"
        className="scroll-mt-32 bg-[linear-gradient(145deg,#FAFAF8_0%,#ffffff_100%)] px-4 py-16 md:px-6 md:py-32 md:scroll-mt-36 lg:scroll-mt-32"
      >
        <div className="mx-auto max-w-4xl border border-black/10 bg-white p-5 sm:p-8 md:p-16">
          <div className="text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-black/5 text-stone-700">
              <BuildingIcon />
            </div>

            <p className="mt-8 text-[13px] uppercase tracking-[0.15em] text-stone-500">
              Purchase Guide
            </p>
            <h2 className="display-font headline-balance mt-4 text-[28px] font-semibold leading-[1.15] tracking-[-0.02em] text-stone-900 sm:text-4xl md:text-[48px]">
              지금 바로 루틴을 시작하세요
            </h2>
            <p className="copy-pretty mx-auto mt-5 max-w-xl text-[15px] leading-[1.85] text-stone-600 sm:mt-6 sm:text-[16px] sm:leading-[1.9]">
              DAY CARE와 NIGHT CARE 중 필요한 루틴부터 선택해 바로 구매할 수 있습니다. 두 제품의
              분위기와 역할을 비교한 뒤, 나에게 더 잘 맞는 케어부터 가볍게 시작해보세요.
            </p>

            <div className="pt-10">
              <Link
                href="/order"
                className="btn-luxe-primary inline-flex w-full max-w-md items-center justify-center px-8 py-4 text-[14px] tracking-[0.1em] md:px-12 md:py-5"
              >
                구매 페이지로 이동하기
              </Link>
              <p className="mt-4 text-[12px] text-stone-500">원하는 제품을 고른 뒤 바로 주문할 수 있도록 간편 결제 환경을 준비했습니다.</p>
            </div>

            <div className="mt-12 border-t border-black/5 pt-10 md:pt-12">
              <div className="mx-auto mb-5 max-w-2xl text-center md:mb-8">
                <p className="text-[12px] uppercase tracking-[0.18em] text-[#8b673f]">Order Flow</p>
                <p className="mt-3 text-sm leading-7 text-stone-600">
                  선택부터 결제, 배송 안내까지 간단하게 이어집니다.
                </p>
              </div>

              <div className="overflow-hidden rounded-[20px] border border-[rgba(184,145,86,0.18)] bg-[linear-gradient(180deg,#fffdfb_0%,#faf6ef_100%)] shadow-[0_14px_40px_rgba(89,63,28,0.06)] md:rounded-[28px] md:shadow-[0_18px_42px_rgba(89,63,28,0.06)]">
                <ol className="divide-y divide-[rgba(184,145,86,0.14)] md:grid md:grid-cols-3 md:divide-x md:divide-y-0">
                  <li className="flex gap-4 px-4 py-4 sm:px-5 sm:py-5 md:flex-col md:gap-5 md:px-7 md:py-8">
                    <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[linear-gradient(135deg,#b89156_0%,#9d7442_100%)] text-[12px] font-semibold tracking-[0.08em] text-white">
                      01
                    </span>
                    <div className="min-w-0 flex-1 text-left">
                      <p className="text-[10px] uppercase tracking-[0.16em] text-[#8b673f] sm:text-[11px]">
                        Choose Your Routine
                      </p>
                      <p className="mt-1.5 text-[17px] font-semibold leading-snug tracking-[-0.02em] text-stone-900 sm:text-[18px] md:text-[20px]">
                        원하는 제품 선택
                      </p>
                      <p className="mt-2 text-[13px] leading-relaxed text-stone-600 sm:text-sm">
                        필요한 제품만 바로 담습니다.
                      </p>
                    </div>
                  </li>
                  <li className="flex gap-4 px-4 py-4 sm:px-5 sm:py-5 md:flex-col md:gap-5 md:px-7 md:py-8">
                    <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[linear-gradient(135deg,#b89156_0%,#9d7442_100%)] text-[12px] font-semibold tracking-[0.08em] text-white">
                      02
                    </span>
                    <div className="min-w-0 flex-1 text-left">
                      <p className="text-[10px] uppercase tracking-[0.16em] text-[#8b673f] sm:text-[11px]">
                        Guest Checkout
                      </p>
                      <p className="mt-1.5 text-[17px] font-semibold leading-snug tracking-[-0.02em] text-stone-900 sm:text-[18px] md:text-[20px]">
                        비회원 결제 진행
                      </p>
                      <p className="mt-2 text-[13px] leading-relaxed text-stone-600 sm:text-sm">
                        가입 없이 바로 주문합니다.
                      </p>
                    </div>
                  </li>
                  <li className="flex gap-4 px-4 py-4 sm:px-5 sm:py-5 md:flex-col md:gap-5 md:px-7 md:py-8">
                    <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[linear-gradient(135deg,#b89156_0%,#9d7442_100%)] text-[12px] font-semibold tracking-[0.08em] text-white">
                      03
                    </span>
                    <div className="min-w-0 flex-1 text-left">
                      <p className="text-[10px] uppercase tracking-[0.16em] text-[#8b673f] sm:text-[11px]">
                        Delivery &amp; Support
                      </p>
                      <p className="mt-1.5 text-[17px] font-semibold leading-snug tracking-[-0.02em] text-stone-900 sm:text-[18px] md:text-[20px]">
                        배송 및 상담 확인
                      </p>
                      <p className="mt-2 text-[13px] leading-relaxed text-stone-600 sm:text-sm">
                        배송·상담 안내를 확인합니다.
                      </p>
                    </div>
                  </li>
                </ol>
              </div>
            </div>

          </div>
        </div>
      </section>

      <section className="bg-[#FAFAF8] px-4 py-16 md:px-6 md:py-24">
        <div className="relative mx-auto max-w-5xl overflow-hidden rounded-[30px] border border-[rgba(184,145,86,0.22)] bg-[linear-gradient(165deg,#ffffff_0%,#fdfbf7_48%,#faf6ef_100%)] px-6 py-10 text-center shadow-[0_22px_56px_rgba(89,63,28,0.07)] md:px-10 md:py-14">
          <div className="pointer-events-none absolute -right-16 -top-20 h-52 w-52 rounded-full bg-[#d7b27d]/14 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -left-12 h-48 w-48 rounded-full bg-[#c9a66b]/12 blur-3xl" />
          <div className="pointer-events-none absolute inset-x-10 top-0 h-px bg-[linear-gradient(90deg,transparent_0%,rgba(184,145,86,0.35)_50%,transparent_100%)]" />

          <div className="relative">
            <p className="text-[12px] font-medium tracking-[0.18em] text-[#8b673f]">레퍼럴 안내</p>
            <h2 className="display-font headline-balance mt-4 text-[32px] font-semibold leading-[1.18] tracking-[-0.02em] text-stone-900 md:text-[42px]">
              안내된 링크와 코드로
              <span className="mt-1 block bg-[linear-gradient(92deg,#9d7442_0%,#c49a5c_42%,#8b673f_100%)] bg-clip-text text-transparent">
                주문하기
              </span>
            </h2>
            <p className="copy-pretty mx-auto mt-6 max-w-2xl text-[15px] leading-[1.85] text-stone-600">
              인플루언서 등으로 받은 링크로 들어오거나, 주문 시 추천 코드를 입력하면 안내된 조건 그대로 결제할 수 있습니다.
            </p>

            <div className="mx-auto mt-8 grid max-w-3xl gap-4 text-left md:grid-cols-3">
              <div className="rounded-[22px] border border-[rgba(184,145,86,0.2)] bg-white/75 p-5 shadow-[0_12px_36px_rgba(89,63,28,0.05)] backdrop-blur-sm">
                <p className="text-[11px] font-medium tracking-[0.14em] text-[#8b673f]">혜택</p>
                <p className="mt-3 text-lg font-semibold text-stone-900">조건 그대로 반영</p>
                <p className="mt-2 text-sm leading-snug text-stone-600 break-keep">
                  안내된 할인·조건이 주문에 그대로 적용됩니다.
                </p>
              </div>
              <div className="rounded-[22px] border border-[rgba(184,145,86,0.2)] bg-white/75 p-5 shadow-[0_12px_36px_rgba(89,63,28,0.05)] backdrop-blur-sm">
                <p className="text-[11px] font-medium tracking-[0.14em] text-[#8b673f]">진행</p>
                <p className="mt-3 text-lg font-semibold text-stone-900">평소 주문과 동일</p>
                <p className="mt-2 text-sm leading-snug text-stone-600 break-keep">
                  일반 주문 화면에서 제품을 담은 뒤, 받으신 코드만 입력하면 됩니다.
                </p>
              </div>
              <div className="rounded-[22px] border border-[rgba(184,145,86,0.2)] bg-white/75 p-5 shadow-[0_12px_36px_rgba(89,63,28,0.05)] backdrop-blur-sm">
                <p className="text-[11px] font-medium tracking-[0.14em] text-[#8b673f]">안내</p>
                <p className="mt-3 text-lg font-semibold text-stone-900">배송·상담 동일</p>
                <p className="mt-2 text-sm leading-snug text-stone-600 break-keep">
                  배송과 고객센터 안내는 일반 구매와 같은 기준입니다.
                </p>
              </div>
            </div>

            <div className="pt-10">
              <Link
                href="/order"
                className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-[rgba(184,145,86,0.35)] bg-[linear-gradient(135deg,#f6e8d4_0%,#d2aa73_52%,#b89156_100%)] px-10 py-4 text-[13px] font-medium tracking-[0.06em] text-stone-900 shadow-[0_14px_36px_rgba(184,145,86,0.22)] transition hover:brightness-[1.03] sm:w-auto"
              >
                추천 코드와 함께 주문하기
                <ArrowAccent />
              </Link>
            </div>

            <p className="mt-8 text-[11px] leading-relaxed text-stone-500">
              * 링크와 코드는 안내를 받은 채널에서만 전달될 수 있습니다.
            </p>
          </div>
        </div>
      </section>
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

