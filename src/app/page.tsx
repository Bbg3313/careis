import Image from "next/image";
import Link from "next/link";

import { FeatureBannerSlider } from "@/components/feature-banner-slider";
import { MotionMedia } from "@/components/motion-media";
import { products } from "@/lib/product-data";
import { homeVisuals, productVisuals } from "@/lib/site-assets";

const featureBannerSlides = [
  {
    label: "Night Renewal",
    title: "밤사이 더 맑고\n정돈된 피부 인상",
    description:
      "시스테아민 5%와 나이아신아마이드, 알부틴을 담아 칙칙한 피부 인상을 더 환하고 정돈된 느낌으로 가꿔주는 브라이트닝 인텐시브 케어입니다.",
    highlights: ["색소 케어", "브라이트닝", "피부 결 정돈"],
    image: "/images/illum-model-banner.png",
    imageAlt: "일루미네이터 모델 비주얼",
    tone: "light" as const,
  },
  {
    label: "Day Protection",
    title: "햇빛 아래 더 맑고\n편안한 피부 인상",
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
          </div>
        </div>
      </section>

      <section
        id="brand"
        className="relative scroll-mt-32 overflow-hidden bg-[linear-gradient(180deg,#fffdf9_0%,#f8f1e7_100%)] px-4 py-20 md:px-6 md:py-24 md:scroll-mt-36 lg:scroll-mt-32"
      >
        <div className="absolute inset-0">
          <div className="absolute left-1/2 top-6 h-[280px] w-[min(100%,1120px)] -translate-x-1/2 text-[#c9b08b]/45 md:h-[340px]">
            <svg viewBox="0 0 1200 420" className="h-full w-full" fill="none" aria-hidden="true">
              <path d="M150 336V176H330V336" stroke="currentColor" strokeWidth="1.2" />
              <path d="M240 336V120H520V336" stroke="currentColor" strokeWidth="1.2" />
              <path d="M470 336V146H740V336" stroke="currentColor" strokeWidth="1.2" />
              <path d="M690 336V194H910V336" stroke="currentColor" strokeWidth="1.2" />
              <path d="M860 336V162H1040V336" stroke="currentColor" strokeWidth="1.2" />
              <path d="M120 336H1080" stroke="currentColor" strokeWidth="1.2" />
              <path d="M358 120V86H402V120" stroke="currentColor" strokeWidth="1.2" />
              <path d="M372 86V58H388V86" stroke="currentColor" strokeWidth="1.2" />
              <path d="M560 146V110H650V146" stroke="currentColor" strokeWidth="1.2" />
              <path d="M930 162V124H970V162" stroke="currentColor" strokeWidth="1.2" />
              <path d="M946 124V96H954V124" stroke="currentColor" strokeWidth="1.2" />
              {Array.from({ length: 7 }).map((_, row) =>
                Array.from({ length: 5 }).map((_, col) => (
                  <rect
                    key={`left-${row}-${col}`}
                    x={176 + col * 28}
                    y={200 + row * 18}
                    width="14"
                    height="10"
                    stroke="currentColor"
                    strokeWidth="1"
                  />
                )),
              )}
              {Array.from({ length: 9 }).map((_, row) =>
                Array.from({ length: 7 }).map((_, col) => (
                  <rect
                    key={`mid-${row}-${col}`}
                    x={280 + col * 30}
                    y={144 + row * 18}
                    width="15"
                    height="10"
                    stroke="currentColor"
                    strokeWidth="1"
                  />
                )),
              )}
              {Array.from({ length: 8 }).map((_, row) =>
                Array.from({ length: 6 }).map((_, col) => (
                  <rect
                    key={`right-${row}-${col}`}
                    x={760 + col * 28}
                    y={186 + row * 18}
                    width="14"
                    height="10"
                    stroke="currentColor"
                    strokeWidth="1"
                  />
                )),
              )}
            </svg>
          </div>
          <div className="absolute left-10 top-8 h-32 w-32 rounded-full bg-[#c89f63]/18 blur-3xl" />
          <div className="absolute bottom-10 right-10 h-40 w-40 rounded-full bg-[#ecd8bb]/28 blur-3xl" />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,251,245,0.74)_0%,rgba(255,248,241,0.88)_24%,rgba(248,241,231,0.96)_100%)]" />
        </div>

        <div className="relative mx-auto max-w-7xl">
          <div className="mx-auto max-w-5xl overflow-hidden rounded-[38px] border border-[rgba(184,145,86,0.18)] bg-[linear-gradient(180deg,rgba(255,252,247,0.92)_0%,rgba(250,244,235,0.96)_100%)] px-6 py-10 shadow-[0_34px_90px_rgba(120,85,37,0.08)] backdrop-blur-sm md:px-10 md:py-14">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent_0%,rgba(184,145,86,0.46)_50%,transparent_100%)]" />
            <div className="mx-auto flex w-fit items-center gap-3 rounded-full border border-[rgba(184,145,86,0.18)] bg-[linear-gradient(180deg,rgba(255,255,255,0.9)_0%,rgba(249,240,226,0.92)_100%)] px-4 py-2 text-[11px] uppercase tracking-[0.18em] text-[#8b673f] shadow-[0_12px_30px_rgba(120,85,37,0.08)]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#b89156]" />
              Premium Clinical Line
            </div>
            <h2 className="display-font headline-balance mt-6 text-4xl font-semibold leading-[1.12] tracking-[-0.03em] text-stone-900 md:text-[56px]">
              병원에서 먼저 소개된
              <br className="hidden md:block" />
              <span className="bg-[linear-gradient(135deg,#b89156_0%,#8b673f_100%)] bg-clip-text text-transparent">
                프리미엄 더마코스메틱 루틴
              </span>
            </h2>
            <p className="copy-pretty mx-auto mt-6 max-w-2xl text-[15px] leading-[1.9] text-stone-700 md:text-[16px]">
              병원 채널에서 먼저 소개된 CAREIS 제품을
              <br className="hidden md:block" />
              일상에서도 자연스럽게 사용할 수 있도록 더 세련된 루틴으로 정리했습니다.
            </p>
            <div className="mx-auto mt-6 flex flex-wrap items-center justify-center gap-3 text-[11px] uppercase tracking-[0.16em] text-[#8b673f]">
              <span className="rounded-full border border-[rgba(184,145,86,0.18)] bg-white/84 px-4 py-2 shadow-[0_10px_24px_rgba(120,85,37,0.05)]">Hospital Channel</span>
              <span className="rounded-full border border-[rgba(184,145,86,0.18)] bg-white/84 px-4 py-2 shadow-[0_10px_24px_rgba(120,85,37,0.05)]">Premium Texture</span>
              <span className="rounded-full border border-[rgba(184,145,86,0.18)] bg-white/84 px-4 py-2 shadow-[0_10px_24px_rgba(120,85,37,0.05)]">Day &amp; Night Routine</span>
            </div>
            <div className="mx-auto mt-10 grid max-w-4xl gap-4 text-left md:grid-cols-2">
              <div className="relative overflow-hidden rounded-[24px] border border-[rgba(184,145,86,0.2)] bg-[linear-gradient(180deg,#fffdfa_0%,#f7efe3_100%)] p-6 shadow-[0_24px_54px_rgba(120,85,37,0.08)]">
                <div className="absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent_0%,rgba(184,145,86,0.5)_50%,transparent_100%)]" />
                <div className="absolute right-0 top-0 h-24 w-24 rounded-full bg-[#d8ba86]/12 blur-2xl" />
                <div className="relative flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.18em] text-[#8b673f]">Sun Pack</p>
                    <p className="mt-3 text-xl font-semibold tracking-[-0.02em] text-stone-900">Patent Film Technology</p>
                  </div>
                  <span className="rounded-full border border-[rgba(184,145,86,0.18)] bg-white/90 px-3 py-1 text-[11px] uppercase tracking-[0.16em] text-[#8b673f]">
                    Day Care
                  </span>
                </div>
                <p className="mt-4 text-sm leading-7 text-stone-700">
                  특허 기반 셀룰로오스 필름막 기술과 가벼운 사용감으로, 데일리 선케어를 더 편안하게
                  이어갈 수 있도록 돕습니다.
                </p>
                <div className="mt-5 flex items-center gap-3 text-[12px] uppercase tracking-[0.14em] text-[#8b673f]">
                  <span>SPF50+</span>
                  <span className="h-1 w-1 rounded-full bg-[#b89156]" />
                  <span>PA+++</span>
                  <span className="h-1 w-1 rounded-full bg-[#b89156]" />
                  <span>Light Texture</span>
                </div>
              </div>
              <div className="relative overflow-hidden rounded-[24px] border border-[rgba(184,145,86,0.18)] bg-[linear-gradient(180deg,#fffdfa_0%,#f4eee6_100%)] p-6 shadow-[0_24px_54px_rgba(120,85,37,0.08)]">
                <div className="absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent_0%,rgba(184,145,86,0.42)_50%,transparent_100%)]" />
                <div className="absolute right-0 top-0 h-24 w-24 rounded-full bg-[#d7c2a4]/12 blur-2xl" />
                <div className="relative flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.18em] text-[#8b673f]">Illuminator</p>
                    <p className="mt-3 text-xl font-semibold tracking-[-0.02em] text-stone-900">Cysteamine 5% Care</p>
                  </div>
                  <span className="rounded-full border border-[rgba(184,145,86,0.18)] bg-white/90 px-3 py-1 text-[11px] uppercase tracking-[0.16em] text-[#8b673f]">
                    Night Care
                  </span>
                </div>
                <p className="mt-4 text-sm leading-7 text-stone-700">
                  시스테아민 5%를 중심으로 한 집중 브라이트닝 케어로, 밤사이 더 정돈된 피부 인상을
                  위한 루틴을 완성합니다.
                </p>
                <div className="mt-5 flex items-center gap-3 text-[12px] uppercase tracking-[0.14em] text-[#8b673f]">
                  <span>5%</span>
                  <span className="h-1 w-1 rounded-full bg-[#b89156]" />
                  <span>Brightening</span>
                  <span className="h-1 w-1 rounded-full bg-[#b89156]" />
                  <span>Night Routine</span>
                </div>
              </div>
            </div>
            <p className="mx-auto mt-7 max-w-2xl text-[13px] leading-[1.8] text-stone-600 md:text-[14px]">
              병원 유통 기반의 신뢰감과 프리미엄 사용감을 함께 보여주는 두 제품을 아래에서 바로 확인할
              수 있습니다.
            </p>
          </div>
        </div>
      </section>

      {sunPack && illuminator ? (
        <section className="relative overflow-hidden scroll-mt-32 md:scroll-mt-36 lg:scroll-mt-32" id="product">
          <div className="bg-white px-4 pb-10 pt-6 md:px-6 md:pb-14 md:pt-8">
            <div className="relative mx-auto max-w-6xl overflow-hidden rounded-[34px] bg-[linear-gradient(145deg,#fbf7f0_0%,#ffffff_54%,#f7f1e8_100%)] px-6 py-10 md:px-10 md:py-14">
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
                <h2 className="display-font headline-balance mt-5 text-4xl font-semibold leading-[1.08] tracking-[-0.04em] text-stone-900 md:text-[64px]">
                  낮과 밤을 나누는
                  <span className="block text-[44px] italic tracking-[-0.03em] text-[#8b673f] md:text-[76px]">
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
        </section>
      ) : null}

      <section className="bg-[#f8f2ea] px-4 py-8 md:px-6 md:py-10">
        <div className="mx-auto max-w-6xl">
          <FeatureBannerSlider slides={featureBannerSlides} />
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

