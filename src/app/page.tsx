import Image from "next/image";
import Link from "next/link";

import { MotionMedia } from "@/components/motion-media";
import { products } from "@/lib/product-data";
import { homeVisuals, productVisuals } from "@/lib/site-assets";

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
                CAREIS는 낮에는 가볍게 보호하고 밤에는 집중적으로 정돈하는 2-step 루틴을 선보입니다.
                일상 속에서 매일 손이 가는 사용감과 프리미엄 무드를 담아, 하루의 피부 리듬을 더
                우아하게 채웁니다.
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
          <div className="mx-auto max-w-5xl text-center">
            <p className="text-[13px] uppercase tracking-[0.15em] text-stone-500">Editorial Story</p>
            <h2 className="display-font headline-balance mt-6 text-4xl font-semibold leading-[1.16] tracking-[-0.03em] text-stone-900 md:text-[54px]">
              빛이 머무는 낮,
              <br className="hidden md:block" /> 결이 깊어지는 밤
            </h2>
            <p className="copy-pretty mx-auto mt-6 max-w-2xl text-[15px] leading-[1.9] text-stone-600 md:text-[16px]">
              피부 위에 남는 감각은 시간에 따라 달라집니다. CAREIS는 낮에는 더 가볍고 밝게, 밤에는 더
              차분하고 깊게 이어지는 두 장면을 하나의 루틴 안에 담았습니다.
            </p>
          </div>

          <div className="mt-14 overflow-hidden rounded-[40px] bg-[linear-gradient(145deg,#f9f4ec_0%,#ffffff_48%,#1f1b18_48%,#26211d_100%)] p-5 shadow-[0_28px_100px_rgba(73,53,26,0.08)] md:p-8">
            <div className="grid gap-5 lg:grid-cols-[1.08fr_0.92fr]">
              <div className="relative min-h-[380px] overflow-hidden rounded-[30px] md:min-h-[520px]">
                <Image
                  src={productVisuals["sun-pack"].gallery[4]}
                  alt="선팩 에디토리얼 비주얼"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 56vw"
                />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.02)_0%,rgba(246,239,229,0.18)_100%)]" />
              </div>

              <div className="grid gap-5">
                <div className="relative min-h-[240px] overflow-hidden rounded-[30px] md:min-h-[310px]">
                  <Image
                    src={productVisuals["illuminator"].hero}
                    alt="일루미네이터 에디토리얼 비주얼"
                    fill
                    className="object-contain bg-[rgba(16,16,16,0.18)] p-6"
                    sizes="(max-width: 1024px) 100vw, 44vw"
                  />
                </div>

                <div className="rounded-[30px] bg-white/72 p-7 text-left shadow-[inset_0_1px_0_rgba(255,255,255,0.6)] backdrop-blur-sm md:p-8">
                  <p className="text-[11px] uppercase tracking-[0.18em] text-stone-500">Mood Copy</p>
                  <p className="headline-balance mt-4 text-2xl font-medium leading-[1.5] tracking-[-0.02em] text-stone-900 md:text-[30px]">
                    하루의 시작은 더 맑게,
                    <br />
                    하루의 끝은 더 고요하게.
                  </p>
                  <p className="copy-pretty mt-5 text-sm leading-8 text-stone-600 md:text-[15px]">
                    선팩은 햇빛 아래에서도 피부 인상을 가볍고 깨끗하게 정리하고, 일루미네이터는 밤사이 더
                    차분하고 정돈된 결을 완성합니다. 서로 다른 두 장면이 이어질 때, CAREIS의 루틴은 더
                    자연스럽고 또렷해집니다.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 text-center">
              <p className="mx-auto max-w-3xl text-[15px] leading-[1.9] text-[rgba(57,44,32,0.72)] md:text-[16px]">
                아래에서 낮과 밤을 위한 두 제품을 각각 더 선명하게 만나볼 수 있습니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      {sunPack && illuminator ? (
        <section className="relative overflow-hidden scroll-mt-32 md:scroll-mt-36 lg:scroll-mt-32" id="product">
          <div className="bg-white px-4 pb-10 pt-6 md:px-6 md:pb-14 md:pt-8">
            <div className="relative mx-auto max-w-6xl overflow-hidden rounded-[34px] border border-[rgba(116,88,59,0.12)] bg-[linear-gradient(145deg,#fbf7f0_0%,#ffffff_54%,#f7f1e8_100%)] px-6 py-10 shadow-[0_24px_80px_rgba(73,53,26,0.06)] md:px-10 md:py-14">
              <div className="absolute left-10 top-8 h-28 w-28 rounded-full bg-[#d4af37]/12 blur-3xl" />
              <div className="absolute bottom-6 right-10 h-32 w-32 rounded-full bg-[#8ea4c5]/12 blur-3xl" />

              <div className="relative text-center">
                <div className="flex flex-wrap items-center justify-center gap-3">
                  <span className="inline-flex items-center gap-2 rounded-full border border-[rgba(157,116,66,0.16)] bg-white/90 px-4 py-2 text-[11px] uppercase tracking-[0.2em] text-stone-500">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#d4af37]" />
                    Day Signature
                  </span>
                  <span className="hidden h-px w-12 bg-[linear-gradient(90deg,rgba(184,145,86,0.3)_0%,rgba(184,145,86,0)_100%)] md:block" />
                  <span className="inline-flex items-center gap-2 rounded-full border border-[rgba(111,129,158,0.16)] bg-white/90 px-4 py-2 text-[11px] uppercase tracking-[0.2em] text-stone-500">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#8ea4c5]" />
                    Night Signature
                  </span>
                </div>

                <p className="mt-8 text-[12px] uppercase tracking-[0.26em] text-stone-500">Two Essential Solutions</p>
                <h2 className="display-font headline-balance mt-5 text-4xl font-semibold leading-[1.08] tracking-[-0.04em] text-stone-900 md:text-[64px]">
                  낮과 밤을 나누는
                  <span className="block text-[44px] italic tracking-[-0.03em] text-[#8b673f] md:text-[76px]">
                    2-Step Solution
                  </span>
                </h2>
                <p className="copy-pretty mx-auto mt-6 max-w-2xl text-[15px] leading-[1.9] text-stone-600 md:text-[16px]">
                  햇빛 아래에서는 더 맑고 가볍게, 밤이 깊어질수록 더 차분하고 정교하게. 시간에 따라 달라지는
                  피부 인상을 두 가지 결로 나눠 담았습니다.
                </p>
              </div>

              <div className="relative mt-10 grid gap-4 md:grid-cols-2">
                <div className="rounded-[24px] border border-[rgba(116,88,59,0.08)] bg-white/82 p-5 text-left">
                  <p className="text-[11px] uppercase tracking-[0.2em] text-stone-500">Day Care</p>
                  <p className="mt-3 text-lg font-medium tracking-[-0.02em] text-stone-900">
                    피부를 맑고 편안하게 정돈하는
                    <br />
                    라이트 프로텍션
                  </p>
                </div>
                <div className="rounded-[24px] border border-[rgba(116,88,59,0.08)] bg-[rgba(33,30,28,0.92)] p-5 text-left">
                  <p className="text-[11px] uppercase tracking-[0.2em] text-white/45">Night Care</p>
                  <p className="mt-3 text-lg font-medium tracking-[-0.02em] text-white">
                    더 깊고 맑은 피부 인상을 위한
                    <br />
                    인텐시브 브라이트닝
                  </p>
                </div>
              </div>
            </div>
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
                <div className="mt-5 space-y-2 text-center text-stone-700">
                  <p className="text-[18px] leading-[1.75] md:text-[20px]">
                    자외선으로부터 피부를 보호하는
                  </p>
                  <p className="text-[18px] leading-[1.75] md:text-[20px]">
                    프리미엄 선케어 솔루션
                  </p>
                </div>

                <div className="mt-10 border border-black/8 bg-white/50 p-5 md:p-6 backdrop-blur-sm">
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

                <div className="mx-auto mt-8 max-w-md">
                  <p className="copy-pretty text-[15px] leading-[1.9] text-stone-600 md:text-[16px]">
                    백탁과 답답함 부담을 낮추고, 메이크업 전후에도 자연스럽게 손이 가는 데일리 선케어
                    루틴입니다.
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
                <div className="mt-5 space-y-2 text-center text-white/82">
                  <p className="text-[18px] leading-[1.75] md:text-[20px]">
                    밤사이 집중 관리하는
                  </p>
                  <p className="text-[18px] leading-[1.75] md:text-[20px]">
                    브라이트닝 인텐시브 케어
                  </p>
                </div>

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

                <div className="mx-auto mt-8 max-w-md">
                  <p className="copy-pretty text-[15px] leading-[1.9] text-white/72 md:text-[16px]">
                    기미, 잡티, PIH 고민을 위한 야간 브라이트닝 루틴으로, 더 맑고 정돈된 피부 컨디션을
                    차분하게 완성합니다.
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

      <section className="relative left-1/2 right-1/2 -mx-[50vw] w-screen overflow-hidden bg-[linear-gradient(180deg,#fbf7f1_0%,#f7f2eb_100%)]">
        <div className="absolute inset-y-0 right-0 w-[58%] bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.92)_0%,rgba(255,255,255,0)_62%)]" />
        <div className="absolute left-[12%] top-14 h-44 w-44 rounded-full bg-[#d9b780]/10 blur-3xl" />

        <div className="relative mx-auto grid min-h-[440px] max-w-[1800px] items-center gap-8 px-4 py-6 md:min-h-[560px] md:px-8 md:py-8 lg:min-h-[660px] lg:grid-cols-[0.72fr_1.28fr] lg:px-10">
          <div className="relative z-10 px-4 py-8 md:px-8 lg:px-14">
            <p className="text-[12px] uppercase tracking-[0.22em] text-stone-500">Night Renewal</p>
            <h2 className="display-font headline-balance mt-6 text-4xl font-semibold leading-[1.14] tracking-[-0.03em] text-stone-900 md:text-6xl lg:text-[72px]">
              밤사이 더 맑고
              <br />
              정돈된 피부 인상
            </h2>
            <p className="copy-pretty mt-6 max-w-xl text-[15px] leading-[1.9] text-stone-600 md:text-[17px]">
              시스테아민 5%와 나이아신아마이드, 알부틴을 담아 칙칙한 피부 인상을 더 환하고 정돈된
              느낌으로 가꿔주는 브라이트닝 인텐시브 케어입니다.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4 text-[12px] tracking-[0.08em] text-stone-500 md:gap-5 md:text-[13px]">
              <span>색소 케어</span>
              <span className="h-3 w-px bg-black/10" />
              <span>브라이트닝</span>
              <span className="h-3 w-px bg-black/10" />
              <span>피부 결 정돈</span>
            </div>
          </div>

          <div className="relative min-h-[320px] md:min-h-[440px] lg:min-h-[620px]">
            <Image
              src={productVisuals["illuminator"].card}
              alt={productVisuals["illuminator"].alt}
              fill
              className="object-contain object-right-bottom"
              sizes="(max-width: 1024px) 100vw, 60vw"
              priority
            />
          </div>
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
              DAY CARE와 NIGHT CARE 중 필요한 루틴부터 선택해 바로 구매할 수 있습니다. 두 제품의
              분위기와 역할을 비교한 뒤, 나에게 더 잘 맞는 케어부터 가볍게 시작해보세요.
            </p>

            <div className="pt-10">
              <Link
                href="/order?product=sun-pack"
                className="btn-luxe-primary inline-flex w-full max-w-md items-center justify-center px-12 py-5 text-[14px] tracking-[0.1em]"
              >
                구매 페이지로 이동하기
              </Link>
              <p className="mt-4 text-[12px] text-stone-500">원하는 제품을 고른 뒤 바로 주문할 수 있도록 간편 결제 환경을 준비했습니다.</p>
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
                구매는 홈에서 바로 이어가고, 제휴 및 입점 문의가 필요한 경우에만 별도 페이지에서
                확인할 수 있습니다.
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
            추천 코드가 있다면 레퍼럴 링크를 통해 바로 구매할 수 있습니다. 공구 운영이나 채널별 주문
            확인이 필요한 경우에도 추천 코드와 결제 정보가 함께 남아 깔끔하게 확인할 수 있습니다.
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

