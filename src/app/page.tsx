import Image from "next/image";
import Link from "next/link";

import { MotionMedia } from "@/components/motion-media";
import { products, siteHighlights } from "@/lib/product-data";
import { homeVisuals, productVisuals } from "@/lib/site-assets";

const highlightIcons = [BuildingIcon, SparklesIcon, ExpertIcon];
const brandSignals = [
  { label: "Daily Mood", value: "데일리 루틴", detail: "매일 손이 가는 감각적인 첫 단계" },
  { label: "Routine Design", value: "2-Step 구조", detail: "DAY CARE / NIGHT CARE 분리" },
  { label: "Purchase Ready", value: "바로 구매 가능", detail: "일반 구매와 추천 링크 흐름 동시 지원" },
];

const brandNotes = [
  "브랜드 무드를 먼저 느끼고, 자연스럽게 제품과 구매로 이어지도록 흐름을 정리합니다.",
  "선팩은 데일리 보호, 일루미네이터는 야간 집중 관리라는 역할이 한눈에 읽히도록 구성합니다.",
  "복잡한 설명보다 사용감, 루틴, 사용 장면의 매력이 먼저 보이도록 정리합니다.",
];

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
                Day To Night Dermacosmetic
              </p>
              <h1 className="display-font headline-balance text-5xl font-semibold leading-[1.08] tracking-[-0.02em] text-stone-900 sm:text-6xl md:text-[64px]">
                낮과 밤을 채우는 2-Step Dermacosmetic
              </h1>
              <p className="copy-pretty max-w-xl pt-3 text-[15px] leading-[1.9] text-stone-600 md:text-[17px]">
                CAREIS는 낮에는 가볍게 보호하고 밤에는 집중적으로 정돈하는 2-step 루틴을 제안합니다.
                일상 속에서 매일 손이 가는 사용감과 프리미엄 무드를 함께 담아, 자연스럽게 제품과
                구매로 이어지도록 설계했습니다.
              </p>
            </div>

            <div className="flex flex-wrap gap-4 pt-2">
              <Link
                href="/order?product=sun-pack"
                className="btn-luxe-primary inline-flex items-center gap-2 px-8 py-4 text-[13px] tracking-[0.1em]"
              >
                구매하러 가기
                <ArrowAccent />
              </Link>
              <Link
                href="/products"
                className="border border-black/15 px-8 py-4 text-[13px] tracking-[0.1em] text-stone-900 transition hover:border-black/40"
              >
                제품 보기
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
                  제품보다 먼저 브랜드 톤을, 설명보다 먼저 오래 남는 무드를 보여주는 브랜드 모션
                  섹션입니다.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="brand" className="scroll-mt-32 bg-white px-4 py-20 md:px-6 md:py-24 md:scroll-mt-36 lg:scroll-mt-32">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 text-center md:mb-14">
            <p className="mb-6 text-[13px] uppercase tracking-[0.15em] text-stone-500">
              Routine Architecture
            </p>
            <h2 className="display-font headline-balance text-4xl font-semibold leading-[1.2] tracking-[-0.02em] text-stone-900 md:text-[48px]">
              피부 위에 자연스럽게 스며드는 2-Step 리듬
            </h2>
            <p className="copy-pretty mx-auto mt-6 max-w-2xl text-[15px] leading-[1.9] text-stone-600 md:text-[16px]">
              데이 케어와 나이트 케어를 하나의 흐름으로 연결해, 사용 순간부터 다음 루틴까지 자연스럽게
              이어지는 CAREIS만의 리듬을 담았습니다.
            </p>
          </div>

          <div className="mb-12 grid gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-stretch">
            <article className="overflow-hidden rounded-[34px] border border-[rgba(116,88,59,0.12)] bg-[linear-gradient(145deg,#fbf7f0_0%,#ffffff_60%,#f6f1ea_100%)] p-8 shadow-[0_24px_80px_rgba(73,53,26,0.06)] md:p-10">
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-full border border-[rgba(157,116,66,0.14)] bg-white/80 px-4 py-2 text-[11px] uppercase tracking-[0.18em] text-stone-500">
                  Routine Value
                </span>
                <span className="rounded-full border border-[rgba(157,116,66,0.14)] bg-white/80 px-4 py-2 text-[11px] uppercase tracking-[0.18em] text-stone-500">
                  Texture And Mood
                </span>
              </div>

              <div className="mt-8 grid gap-6 md:grid-cols-3">
                {brandSignals.map((signal) => (
                  <div key={signal.label} className="space-y-2 border-l border-[rgba(157,116,66,0.18)] pl-4">
                    <p className="text-[11px] uppercase tracking-[0.2em] text-stone-500">{signal.label}</p>
                    <p className="headline-balance text-2xl font-semibold tracking-[-0.03em] text-stone-900">
                      {signal.value}
                    </p>
                    <p className="copy-pretty text-sm leading-7 text-stone-600">{signal.detail}</p>
                  </div>
                ))}
              </div>

              <div className="mt-8 rounded-[28px] border border-[rgba(116,88,59,0.08)] bg-white/82 p-6">
                <p className="text-sm font-semibold text-stone-900">왜 이 루틴이 매력적인가</p>
                <div className="mt-4 grid gap-3">
                  {brandNotes.map((note) => (
                    <div key={note} className="flex gap-3 text-sm leading-7 text-stone-600">
                      <span className="mt-[10px] h-1.5 w-1.5 shrink-0 rounded-full bg-[#b89156]" />
                      <p className="copy-pretty">{note}</p>
                    </div>
                  ))}
                </div>
              </div>
            </article>

            <aside className="rounded-[34px] border border-[rgba(116,88,59,0.12)] bg-[#1f1b18] p-8 text-white shadow-[0_24px_80px_rgba(29,20,11,0.16)] md:p-10">
              <p className="text-[11px] uppercase tracking-[0.22em] text-white/45">Routine Pairing</p>
              <h3 className="display-font headline-balance mt-4 text-3xl font-semibold leading-[1.15] tracking-[-0.03em] md:text-[40px]">
                낮에는 가볍게 보호하고,
                <br className="hidden md:block" /> 밤에는 깊이 있게 정돈합니다.
              </h3>
              <p className="copy-pretty mt-5 text-sm leading-8 text-white/68">
                CAREIS는 하루의 피부 컨디션에 맞춰 서로 다른 텍스처와 역할을 제안하는 2-step
                루틴입니다. 설명보다 먼저 무드가, 무드보다 오래 남는 사용감이 중심이 됩니다.
              </p>
              <div className="mt-8 space-y-4">
                <div className="rounded-[22px] border border-white/10 bg-white/5 p-5">
                  <p className="text-[11px] uppercase tracking-[0.18em] text-white/45">Day Care Mood</p>
                  <p className="mt-2 text-sm leading-7 text-white/78">
                    백탁과 답답함 부담을 낮추고 매일 편안하게 손이 가는 데일리 프로텍션
                  </p>
                </div>
                <div className="rounded-[22px] border border-white/10 bg-white/5 p-5">
                  <p className="text-[11px] uppercase tracking-[0.18em] text-white/45">Night Care Mood</p>
                  <p className="mt-2 text-sm leading-7 text-white/78">
                    색소 고민과 거친 결을 차분히 정돈하는 집중 브라이트닝 루틴
                  </p>
                </div>
                <div className="rounded-[22px] border border-white/10 bg-white/5 p-5">
                  <p className="text-[11px] uppercase tracking-[0.18em] text-white/45">Together</p>
                  <p className="mt-2 text-sm leading-7 text-white/78">
                    아침과 밤의 결을 나눠 관리할 때 더 또렷해지는 CAREIS만의 2-step 밸런스
                  </p>
                </div>
              </div>
            </aside>
          </div>

          <div className="grid gap-6 md:grid-cols-3 md:gap-8">
            {siteHighlights.map((highlight, index) => {
              const Icon = highlightIcons[index] ?? BuildingIcon;

              return (
                <article
                  key={highlight.title}
                  className="group rounded-[30px] border border-[rgba(116,88,59,0.1)] bg-[linear-gradient(180deg,#fffdfa_0%,#f8f4ed_100%)] p-8 shadow-[0_18px_60px_rgba(73,53,26,0.04)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_70px_rgba(73,53,26,0.08)] md:p-10"
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[linear-gradient(135deg,#f4ece2_0%,#ffffff_100%)] text-stone-700 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]">
                    <Icon />
                  </div>
                  <p className="mt-6 text-[11px] uppercase tracking-[0.2em] text-stone-500">
                    {index === 0 ? "Trust Layer" : index === 1 ? "Routine Layer" : "Commerce Layer"}
                  </p>
                  <h3 className="mt-3 text-[22px] font-medium tracking-[-0.02em] text-stone-900">
                    {highlight.title}
                  </h3>
                  <p className="copy-pretty mt-4 text-[14px] leading-[1.8] text-stone-600">
                    {highlight.description}
                  </p>
                  <div className="mt-6 h-px w-full bg-[linear-gradient(90deg,rgba(184,145,86,0.3)_0%,rgba(184,145,86,0)_100%)]" />
                  <p className="copy-pretty mt-5 text-[13px] leading-[1.8] text-stone-500">
                    {index === 0
                      ? "매일 손이 가는 사용감과 프리미엄 무드가 함께 보여야 루틴의 매력이 오래 남습니다."
                      : index === 1
                        ? "데이 케어와 나이트 케어를 명확히 나누면 각 제품의 이유와 사용 타이밍이 직관적으로 읽힙니다."
                        : "브랜드 무드, 제품 설명, 구매 전환이 한 흐름으로 이어질 때 커머스 경험이 더 자연스러워집니다."}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {sunPack && illuminator ? (
        <section className="relative overflow-hidden scroll-mt-32 md:scroll-mt-36 lg:scroll-mt-32" id="product">
          <div className="bg-white px-4 pb-10 pt-6 text-center md:px-6 md:pb-14 md:pt-8">
            <p className="mb-6 text-[13px] uppercase tracking-[0.15em] text-stone-500">
              Two Essential Solutions
            </p>
            <h2 className="display-font headline-balance text-4xl font-semibold leading-[1.2] tracking-[-0.02em] text-stone-900 md:text-[48px]">
              낮과 밤을 나누는 2-Step 솔루션
            </h2>
          </div>

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
                <div className="mt-10 border border-black/10 bg-white/65 p-5 md:p-6 backdrop-blur-sm">
                  <div className="relative h-[22rem] w-[17rem] md:h-[28rem] md:w-[21rem]">
                    <Image
                      src={productVisuals["sun-pack"].card}
                      alt={productVisuals["sun-pack"].alt}
                      fill
                      className="object-contain drop-shadow-[0_24px_36px_rgba(104,78,41,0.22)]"
                      sizes="(max-width: 768px) 272px, 336px"
                    />
                  </div>
                </div>

                <div className="mx-auto mt-8 max-w-xl space-y-3">
                  <p className="headline-balance text-[18px] font-medium leading-[1.7] text-stone-900">
                    {sunPack.tagline}
                  </p>
                  <p className="copy-pretty text-[15px] leading-[1.9] text-stone-600 md:text-[16px]">
                    {sunPack.heroDescription}
                  </p>
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
                <div className="mt-10 border border-white/10 bg-white/5 p-5 md:p-6 backdrop-blur-sm">
                  <div className="relative h-[22rem] w-[17rem] md:h-[28rem] md:w-[21rem]">
                    <Image
                      src={productVisuals["illuminator"].card}
                      alt={productVisuals["illuminator"].alt}
                      fill
                      className="object-contain drop-shadow-[0_24px_36px_rgba(0,0,0,0.28)]"
                      sizes="(max-width: 768px) 272px, 336px"
                    />
                  </div>
                </div>

                <div className="mx-auto mt-8 max-w-xl space-y-3">
                  <p className="headline-balance text-[18px] font-medium leading-[1.7] text-white">
                    {illuminator.tagline}
                  </p>
                  <p className="copy-pretty text-[15px] leading-[1.9] text-white/72 md:text-[16px]">
                    {illuminator.heroDescription}
                  </p>
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
            시각이 먼저 말하고, 제품이 증명합니다. 정제된 무드와 프리미엄 톤을 먼저 전달해 제품을
            더 기대하게 만드는 비주얼 중심 섹션입니다.
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
              Purchase Guide
            </p>
            <h2 className="display-font headline-balance mt-4 text-4xl font-semibold leading-[1.2] tracking-[-0.02em] text-stone-900 md:text-[48px]">
              지금 바로 루틴을 시작하세요
            </h2>
            <p className="copy-pretty mx-auto mt-6 max-w-xl text-[16px] leading-[1.9] text-stone-600">
              DAY CARE와 NIGHT CARE 중 필요한 루틴부터 선택해 바로 구매하거나, 두 제품의 역할과
              사용 타이밍을 비교한 뒤 나에게 맞는 흐름으로 시작할 수 있습니다.
            </p>

            <div className="pt-10">
              <Link
                href="/order?product=sun-pack"
                className="btn-luxe-primary inline-flex w-full max-w-md items-center justify-center px-12 py-5 text-[14px] tracking-[0.1em]"
              >
                구매 페이지로 이동하기
              </Link>
              <p className="mt-4 text-[12px] text-stone-500">제품 비교 후 바로 주문할 수 있도록 간편 결제 흐름까지 준비되어 있습니다.</p>
            </div>

            <div className="mt-12 grid gap-8 border-t border-black/5 pt-12 md:grid-cols-3">
              <InfoStat title="DAY CARE" description="가볍고 편안한 데일리 프로텍션" />
              <InfoStat title="NIGHT CARE" description="집중 브라이트닝 나이트 루틴" />
              <InfoStat title="Easy Checkout" description="비회원 구매와 간편 결제 지원" />
            </div>

            <div className="mx-auto mt-10 max-w-2xl rounded-[28px] border border-[rgba(116,88,59,0.12)] bg-[#faf6ef] p-6 text-left">
              <p className="text-[11px] uppercase tracking-[0.18em] text-stone-500">For Partnership</p>
              <p className="mt-3 text-lg font-semibold tracking-[-0.02em] text-stone-900">
                병원·클리닉 제휴 문의는 별도 채널로 간단히 연결합니다.
              </p>
              <p className="copy-pretty mt-3 text-sm leading-7 text-stone-600">
                홈에서는 구매 흐름을 우선 보여주고, 제휴 및 입점 문의가 필요한 경우에만 별도 페이지에서
                안내받을 수 있도록 분리했습니다.
              </p>
              <div className="mt-5">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-stone-900"
                >
                  제휴 문의 보기
                  <ArrowAccent />
                </Link>
              </div>
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
            추천 코드가 있다면 공개 레퍼럴 링크를 통해 바로 구매할 수 있습니다. 주문 데이터에는 추천
            코드와 결제수단이 함께 저장되어, 공구 운영과 추적 관리까지 자연스럽게 이어질 수 있도록
            설계했습니다.
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
            * 추천 코드는 인플루언서 또는 제휴 파트너 링크를 통해 전달될 수 있습니다.
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

