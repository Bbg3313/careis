import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { FeatureBannerSlider } from "@/components/feature-banner-slider";
import { HomeVideoBanner } from "@/components/home-video-banner";
import { MotionMedia } from "@/components/motion-media";
import { products } from "@/lib/product-data";
import { homeVisuals, productVisuals } from "@/lib/site-assets";
import { DEFAULT_DESCRIPTION, DEFAULT_OG_IMAGE_PATH, SITE_NAME, SITE_TAGLINE } from "@/lib/site-seo";

export const metadata: Metadata = {
  title: "공식 몰",
  description: DEFAULT_DESCRIPTION,
  alternates: { canonical: "/" },
  openGraph: {
    url: "/",
    title: `${SITE_NAME} — ${SITE_TAGLINE}`,
    description: DEFAULT_DESCRIPTION,
    images: [{ url: DEFAULT_OG_IMAGE_PATH, alt: `${SITE_NAME} 선팩 제품 비주얼` }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} — ${SITE_TAGLINE}`,
    description: DEFAULT_DESCRIPTION,
    images: [DEFAULT_OG_IMAGE_PATH],
  },
};

const featureBannerSlides = [
  {
    label: "NIGHT CARE",
    title: "밤사이 더 맑고 정돈된 피부",
    description:
      "시스테아민 5%와 나이아신아마이드, 알부틴을 담아 칙칙한 피부 인상을 더 환하고 정돈된 느낌으로 가꿔주는 브라이트닝 인텐시브 케어입니다.",
    highlights: ["색소 케어", "브라이트닝", "피부 결 정돈"],
    image: "/images/feature-banner-illum-night.png",
    imageAlt: "일루미네이터 나이트 케어 비주얼",
    tone: "dark" as const,
  },
  {
    label: "DAY CARE",
    title: "햇빛 아래 더 맑고 편안한 피부",
    description:
      "가볍게 밀착되는 사용감과 자연스러운 피부 표현으로 자외선이 강한 날에도 부담 없이 손이 가는 프리미엄 선케어입니다.",
    highlights: ["자외선 보호", "데일리 선케어", "가벼운 밀착감"],
    image: "/images/feature-banner-sun-day.png",
    imageAlt: "선팩 선크림 스틱 데이 케어 비주얼",
    tone: "light" as const,
  },
];

export default function HomePage() {
  const sunPack = products.find((product) => product.slug === "sun-pack");
  const illuminator = products.find((product) => product.slug === "illuminator");

  return (
    <div className="space-y-8 pb-12 text-pretty break-keep md:space-y-24 md:pb-24">
      <section className="relative overflow-hidden px-0 pb-4 pt-1 sm:px-2 md:pb-8 md:pt-4">
        <div className="absolute right-[-2rem] top-8 h-48 w-48 rounded-full bg-[#d4af37]/10 blur-3xl" />
        <div className="mx-auto grid max-w-7xl gap-5 md:gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-10">
          <div className="space-y-4 px-5 py-4 md:space-y-6 md:px-6 md:py-6 lg:px-0">
            <div className="space-y-4">
              <p className="text-[13px] uppercase tracking-[0.15em] text-stone-500">
                Day To Night Dermacosmetic
              </p>
              <h1 className="display-font headline-balance text-[clamp(1.65rem,5.2vw+0.6rem,2.5rem)] font-semibold leading-[1.12] tracking-[-0.03em] text-stone-900 sm:text-5xl sm:leading-[1.08] md:text-[64px]">
                낮과 밤을 채우는
                <span className="mt-1 block sm:mt-0 sm:inline sm:whitespace-normal">
                  {" "}
                  <span className="whitespace-nowrap sm:whitespace-normal">2-Step</span> Dermacosmetic
                </span>
              </h1>
              <p className="copy-pretty max-w-xl pt-2 text-[15px] leading-[1.85] text-stone-600 md:pt-3 md:text-[17px]">
                CAREIS는 낮에는 가볍게 보호하고, 밤에는 집중적으로 정돈하는 2-Step 루틴을 선보입니다.
                일상 속에서 매일 손이 가는 사용감과 프리미엄 무드를 담아 하루의 피부 리듬을 우아하게
                채웁니다.
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

          <div className="hero-motion-root relative mx-auto aspect-square w-full max-w-[min(100vw-2.5rem,440px)] overflow-hidden rounded-[22px] bg-[linear-gradient(135deg,#f5f1ea_0%,#ffffff_100%)] sm:max-w-[460px] md:max-w-[min(560px,48vw)] md:rounded-[28px] lg:max-w-[min(640px,44vw)]">
            <MotionMedia
              frames={homeVisuals.heroMotion}
              alt="CAREIS hero visual"
              priority
              className="absolute inset-0"
              objectFit="cover"
              quality={92}
              overlayClassName="absolute inset-0 bg-[linear-gradient(135deg,rgba(245,241,234,0.16)_0%,rgba(255,255,255,0.22)_100%)]"
            />
          </div>
        </div>
      </section>

      <HomeVideoBanner />

      <section
        id="brand"
        className="relative scroll-mt-32 overflow-hidden bg-[linear-gradient(165deg,#fffdfb_0%,#faf4ea_42%,#f3ead8_100%)] px-4 py-8 md:px-6 md:py-24 md:scroll-mt-36 lg:scroll-mt-32"
      >
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(184,145,86,0.13),transparent_55%)]" />
          <div className="absolute right-[8%] top-[12%] h-44 w-44 rounded-full bg-[#d4af37]/14 blur-3xl md:h-56 md:w-56" />
          <div className="absolute bottom-[8%] left-[5%] h-40 w-40 rounded-full bg-[#8ea4c5]/12 blur-3xl md:h-52 md:w-52" />
          <div
            className="absolute inset-0 opacity-[0.35]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23b89156' fill-opacity='0.06'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
        </div>

        <div className="relative mx-auto max-w-6xl">
          <header className="mx-auto max-w-3xl text-center">
            <div className="mx-auto flex w-fit items-center gap-2 rounded-full border border-[rgba(184,145,86,0.35)] bg-[linear-gradient(180deg,rgba(255,255,255,0.95)_0%,rgba(252,246,236,0.92)_100%)] px-5 py-2 shadow-[0_12px_32px_rgba(120,85,37,0.08)]">
              <span className="h-2 w-2 rounded-full bg-[linear-gradient(135deg,#d4af37_0%,#9d7442_100%)] shadow-[0_0_12px_rgba(212,175,55,0.45)]" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#7a5a36]">Clinical line</span>
            </div>
            <h2 className="display-font headline-balance mt-3 text-[26px] font-semibold leading-[1.22] tracking-[-0.03em] text-stone-900 md:mt-6 md:text-[42px] md:leading-[1.12]">
              병원 채널에서 먼저 알려진{" "}
              <span className="bg-[linear-gradient(135deg,#c49a5c_0%,#8b673f_55%,#6b4f2e_100%)] bg-clip-text text-transparent">
                더마 루틴
              </span>
            </h2>
            <p className="copy-pretty mx-auto mt-3 max-w-xl text-[14px] leading-[1.8] text-stone-600 md:mt-6 md:text-[16px] md:leading-relaxed">
              클리닉 유통을 통해 검증된 라인업으로, 낮에는 보호·밤에는 집중하는 리듬을 일상에 옮겼습니다.
            </p>
            <div className="mx-auto mt-4 flex flex-wrap items-center justify-center gap-2 md:mt-6 md:gap-3">
              {["Hospital channel", "2-Step routine", "Premium texture"].map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-[rgba(184,145,86,0.22)] bg-white/80 px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.14em] text-[#8b673f] shadow-[0_6px_18px_rgba(120,85,37,0.06)] md:px-4 md:text-[11px]"
                >
                  {tag}
                </span>
              ))}
            </div>
          </header>

          <div className="relative mx-auto mt-6 max-w-2xl md:mt-12 md:max-w-4xl">
            <ul className="grid grid-cols-2 gap-2 sm:gap-2.5 md:gap-3">
              {[
                "병원·클리닉 유통 채널을 통해 먼저 소개된 라인",
                "낮·밤 역할을 나눈 2-Step 데일리 루틴",
                "선팩은 특허 필름 기술과 SPF50+ PA+++ 고보호",
                "일루미네이터는 시스테아민 5% 중심 야간 브라이트닝",
              ].map((line, i) => (
                <li
                  key={line}
                  className="group relative flex items-center gap-2 rounded-lg border border-[rgba(184,145,86,0.12)] bg-[linear-gradient(135deg,rgba(255,255,255,0.92)_0%,rgba(255,252,247,0.88)_100%)] px-2.5 py-2 shadow-[0_6px_22px_rgba(89,63,28,0.05)] ring-1 ring-white/60 transition hover:border-[rgba(184,145,86,0.26)] hover:shadow-[0_10px_28px_rgba(89,63,28,0.07)] sm:gap-2.5 sm:rounded-xl sm:px-3 sm:py-2.5 md:gap-3 md:px-4 md:py-3"
                >
                  <span
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-[linear-gradient(145deg,#d4af37_0%,#b89156_48%,#8b673f_100%)] text-[10px] font-bold tabular-nums text-white shadow-[0_4px_12px_rgba(184,145,86,0.3)] sm:h-8 sm:w-8 sm:rounded-lg sm:text-[11px] md:h-9 md:w-9 md:rounded-xl md:text-[12px]"
                    aria-hidden
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="min-w-0 flex-1 text-[11px] font-medium leading-[1.45] text-stone-800 [word-break:keep-all] sm:text-[13px] sm:leading-snug md:text-[14px]">
                    {line}
                  </span>
                </li>
              ))}
            </ul>

            <div className="mt-6 flex snap-x snap-mandatory gap-3 overflow-x-auto pb-1 pl-0.5 pr-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:mt-10 md:grid md:grid-cols-2 md:gap-4 md:overflow-visible md:pb-0 md:pl-0 md:pr-0">
            <article className="relative w-[min(82vw,16.75rem)] shrink-0 snap-center snap-always overflow-hidden rounded-2xl border border-[rgba(184,145,86,0.22)] bg-white/95 p-3 shadow-[0_4px_28px_rgba(62,44,18,0.06)] ring-1 ring-black/[0.02] backdrop-blur-sm md:w-auto md:max-w-none md:shrink md:snap-none md:p-5">
              <div
                className="pointer-events-none absolute inset-y-3 left-0 w-[3px] rounded-full bg-[linear-gradient(180deg,#e8c96b_0%,#b8893a_55%,#9a7346_100%)] md:inset-y-4"
                aria-hidden
              />
              <div className="relative pl-3 md:pl-5">
                <div className="flex items-center gap-2.5 md:gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#fffaf0] text-[#a67c2e] ring-1 ring-[rgba(212,175,55,0.28)] md:h-10 md:w-10 md:rounded-xl">
                    <BrandDayGlyph />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[#9a7346] md:text-[10px] md:tracking-[0.2em]">Sun Pack</p>
                    <h3 className="mt-1 text-[15px] font-semibold leading-snug tracking-[-0.02em] text-stone-900 md:mt-2 md:text-[17px]">
                      가벼운 고보호
                    </h3>
                  </div>
                </div>
                <ul className="mt-3 space-y-1.5 border-t border-stone-100 pt-3 text-[12px] leading-relaxed text-stone-600 md:mt-4 md:space-y-2 md:pt-4 md:text-[14px]">
                  <li className="flex gap-2.5 [word-break:keep-all]">
                    <span className="mt-[0.4rem] h-1.5 w-1.5 shrink-0 rounded-sm bg-[#c9a227]" aria-hidden />
                    특허 기반 셀룰로오스 필름 — 밀착·보호
                  </li>
                  <li className="flex gap-2.5 [word-break:keep-all]">
                    <span className="mt-[0.4rem] h-1.5 w-1.5 shrink-0 rounded-sm bg-[#c9a227]" aria-hidden />
                    SPF50+ PA+++ 자외선 차단
                  </li>
                  <li className="flex gap-2.5 [word-break:keep-all]">
                    <span className="mt-[0.4rem] h-1.5 w-1.5 shrink-0 rounded-sm bg-[#c9a227]" aria-hidden />
                    데일리용 가벼운 사용감
                  </li>
                </ul>
              </div>
            </article>

            <article className="relative w-[min(82vw,16.75rem)] shrink-0 snap-center snap-always overflow-hidden rounded-2xl border border-[rgba(123,143,168,0.28)] bg-white/95 p-3 shadow-[0_4px_28px_rgba(45,58,78,0.06)] ring-1 ring-black/[0.02] backdrop-blur-sm md:w-auto md:max-w-none md:shrink md:snap-none md:p-5">
              <div
                className="pointer-events-none absolute inset-y-3 left-0 w-[3px] rounded-full bg-[linear-gradient(180deg,#b8c8dc_0%,#6b7f9c_55%,#5c6d84_100%)] md:inset-y-4"
                aria-hidden
              />
              <div className="relative pl-3 md:pl-5">
                <div className="flex items-center gap-2.5 md:gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#f4f7fb] text-[#5c6d84] ring-1 ring-[rgba(123,143,168,0.3)] md:h-10 md:w-10 md:rounded-xl">
                    <BrandNightGlyph />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[#5c6d84] md:text-[10px] md:tracking-[0.2em]">Illuminator</p>
                    <h3 className="mt-1 text-[15px] font-semibold leading-snug tracking-[-0.02em] text-stone-900 md:mt-2 md:text-[17px]">
                      야간 집중 케어
                    </h3>
                  </div>
                </div>
                <ul className="mt-3 space-y-1.5 border-t border-stone-100 pt-3 text-[12px] leading-relaxed text-stone-600 md:mt-4 md:space-y-2 md:pt-4 md:text-[14px]">
                  <li className="flex gap-2.5 [word-break:keep-all]">
                    <span className="mt-[0.4rem] h-1.5 w-1.5 shrink-0 rounded-sm bg-[#6b7f9c]" aria-hidden />
                    시스테아민 5% 집중 케어
                  </li>
                  <li className="flex gap-2.5 [word-break:keep-all]">
                    <span className="mt-[0.4rem] h-1.5 w-1.5 shrink-0 rounded-sm bg-[#6b7f9c]" aria-hidden />
                    야간 브라이트닝 · 색소 고민 보조
                  </li>
                  <li className="flex gap-2.5 [word-break:keep-all]">
                    <span className="mt-[0.4rem] h-1.5 w-1.5 shrink-0 rounded-sm bg-[#6b7f9c]" aria-hidden />
                    밤 루틴으로 피부 결 정돈
                  </li>
                </ul>
              </div>
            </article>
            </div>
          </div>

          <p className="copy-pretty mx-auto mt-6 max-w-lg px-2 text-center text-[13px] leading-relaxed text-stone-500 md:mt-12 md:max-w-2xl md:text-sm">
            상세 제품 정보는 아래 <span className="font-semibold text-[#8b673f]">PRODUCT</span>에서 확인할 수 있습니다.
          </p>
        </div>
      </section>

      {sunPack && illuminator ? (
        <section className="relative overflow-hidden scroll-mt-32 md:scroll-mt-36 lg:scroll-mt-32" id="product">
          <div className="bg-white px-4 pb-5 pt-4 md:px-6 md:pb-10 md:pt-8">
            <div className="relative mx-auto max-w-6xl overflow-hidden rounded-[28px] border border-[rgba(184,145,86,0.1)] bg-[linear-gradient(145deg,#fbf7f0_0%,#ffffff_54%,#f7f1e8_100%)] shadow-[0_20px_50px_rgba(89,63,28,0.06)] md:rounded-[34px] md:shadow-[0_24px_60px_rgba(89,63,28,0.07)]">
              <div className="absolute left-10 top-8 h-28 w-28 rounded-full bg-[#d4af37]/12 blur-3xl" />
              <div className="absolute bottom-6 right-10 h-32 w-32 rounded-full bg-[#8ea4c5]/12 blur-3xl" />

              <div className="relative border-b border-[rgba(184,145,86,0.12)] px-4 pb-4 pt-4 text-center md:px-10 md:pb-6 md:pt-8">
                <div className="mx-auto flex max-w-[19.5rem] flex-nowrap items-center justify-center gap-1.5 sm:max-w-none sm:gap-2 md:gap-3">
                  <span className="inline-flex min-w-0 flex-1 items-center justify-center gap-1 rounded-full bg-white/72 px-2 py-1.5 text-[8px] font-medium uppercase leading-tight tracking-[0.08em] text-stone-500 sm:flex-none sm:gap-2 sm:px-3 sm:text-[10px] sm:tracking-[0.14em] md:px-4 md:py-2 md:text-[11px] md:tracking-[0.2em]">
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#d4af37]" />
                    Day Signature
                  </span>
                  <span className="inline-flex min-w-0 flex-1 items-center justify-center gap-1 rounded-full bg-white/72 px-2 py-1.5 text-[8px] font-medium uppercase leading-tight tracking-[0.08em] text-stone-500 sm:flex-none sm:gap-2 sm:px-3 sm:text-[10px] sm:tracking-[0.14em] md:px-4 md:py-2 md:text-[11px] md:tracking-[0.2em]">
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#8ea4c5]" />
                    Night Signature
                  </span>
                </div>

                <p className="mt-4 text-[11px] uppercase tracking-[0.26em] text-stone-500 md:mt-5 md:text-[12px]">
                  Two Essential Solutions
                </p>
                <h2 className="display-font headline-balance mt-3 text-[28px] font-semibold leading-[1.12] tracking-[-0.04em] text-stone-900 sm:text-[30px] md:mt-4 md:text-[52px] md:leading-[1.08] lg:text-[56px]">
                  <span className="block">낮과 밤을 나누는</span>
                  <span className="mt-2 block text-[32px] italic leading-[1.1] tracking-[-0.03em] text-[#8b673f] sm:text-[34px] md:mt-3 md:text-[56px] lg:text-[68px]">
                    2-Step Solution
                  </span>
                </h2>
                <p className="copy-pretty mx-auto mt-4 max-w-xl text-[14px] leading-[1.75] text-stone-600 md:mt-5 md:text-[16px] md:leading-relaxed">
                  햇빛 아래에서는 더 맑고 가볍게, 밤이 깊어질수록 더 차분하고 깊게.
                </p>

                <div className="relative mx-auto mt-4 flex w-full max-w-[19.5rem] flex-nowrap items-center justify-center gap-x-4 gap-y-0 px-0.5 text-[9px] font-medium uppercase leading-tight tracking-[0.12em] text-stone-400 sm:max-w-none sm:gap-x-7 sm:text-[10px] sm:tracking-[0.16em] md:mt-5 md:gap-x-8 md:text-[12px] md:tracking-[0.2em]">
                  <span className="shrink-0 whitespace-nowrap text-[#8b673f]">Light Protection</span>
                  <span className="shrink-0 whitespace-nowrap text-stone-400">Intensive Brightening</span>
                </div>
              </div>

              <div className="grid gap-px overflow-hidden bg-[rgba(184,145,86,0.1)] lg:min-h-[100vh] lg:grid-cols-2">
                <article className="relative overflow-hidden bg-[linear-gradient(145deg,#FBF8F1_0%,#F5F1EA_55%,#EDE8DD_100%)] px-5 py-10 md:px-8 md:py-20">
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
                <div className="relative mb-5 md:mb-10">
                  <SunHeroIcon />
                  <div className="absolute inset-0 rounded-full bg-[#D4AF37]/20 blur-xl" />
                </div>

                <p className="text-[13px] uppercase tracking-[0.2em] text-stone-500">Day Protection</p>
                <h2 className="display-font headline-balance mt-4 text-[40px] font-semibold tracking-[-0.02em] text-stone-900 md:text-[56px]">
                  DAY CARE
                </h2>
                <div className="mt-5 text-center text-[18px] font-medium leading-[1.75] text-stone-700 md:text-[20px]">
                  <p className="copy-pretty">
                    자외선으로부터 피부를 보호하는 프리미엄 선케어 솔루션
                  </p>
                </div>

                <div className="group mt-5 overflow-hidden border border-black/8 bg-white/50 p-4 transition duration-500 hover:border-black/12 hover:bg-white/60 hover:shadow-[0_18px_40px_rgba(104,78,41,0.12)] md:mt-10 md:p-6 backdrop-blur-sm">
                  <div className="hero-motion-root relative h-[18rem] w-[14rem] overflow-hidden rounded-[20px] shadow-[inset_0_0_0_1px_rgba(0,0,0,0.04)] md:h-[28rem] md:w-[21rem] md:rounded-[24px]">
                    <MotionMedia
                      frames={homeVisuals.productDayNightSunPackMotion}
                      alt={productVisuals["sun-pack"].alt}
                      objectFit="contain"
                      quality={92}
                      frameSizes="(max-width: 768px) 272px, 336px"
                      className="absolute inset-0 drop-shadow-[0_24px_36px_rgba(104,78,41,0.22)]"
                      overlayClassName="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,250,242,0.22)_0%,transparent_42%,rgba(104,78,41,0.05)_100%)]"
                    />
                  </div>
                </div>

                <div className="mx-auto mt-4 max-w-md md:mt-8">
                  <p className="copy-pretty text-[15px] leading-[1.9] text-stone-600 md:text-[16px]">
                    백탁과 답답함 부담을 낮추고, 메이크업 전후에도 자연스럽게 손이 가는 데일리 선케어
                    루틴입니다.
                  </p>
                </div>

                <Link
                  href="/products/sun-pack"
                  className="mt-5 inline-flex w-full items-center justify-center gap-2 border border-black/20 bg-white/80 px-8 py-3 text-[13px] tracking-[0.1em] text-stone-900 transition hover:bg-white sm:w-auto md:mt-8"
                >
                  자세히 보기
                  <ArrowAccent />
                </Link>
              </div>
            </article>

                <article className="relative overflow-hidden bg-[linear-gradient(145deg,#1A1F2E_0%,#252B3D_55%,#2A3247_100%)] px-5 py-10 text-white md:px-8 md:py-20">
              <div className="absolute left-12 top-12 h-72 w-72 rounded-full bg-[#7B8FA8]/20 blur-3xl" />

              <div className="relative z-10 flex h-full flex-col items-center justify-center text-center">
                <div className="relative mb-5 md:mb-10">
                  <MoonHeroIcon />
                  <div className="absolute inset-0 rounded-full bg-[#A8BCD4]/20 blur-xl" />
                </div>

                <p className="text-[13px] uppercase tracking-[0.2em] text-white/55">Night Renewal</p>
                <h2 className="display-font headline-balance mt-4 text-[40px] font-semibold tracking-[-0.02em] text-white md:text-[56px]">
                  NIGHT CARE
                </h2>
                <div className="mt-5 text-center text-[18px] font-medium leading-[1.75] text-white/82 md:text-[20px]">
                  <p className="copy-pretty">
                    밤사이 집중 관리하는 브라이트닝 인텐시브 케어
                  </p>
                </div>

                <div className="group mt-5 overflow-hidden border border-white/10 bg-white/5 p-4 transition duration-500 hover:border-white/16 hover:bg-white/8 hover:shadow-[0_18px_40px_rgba(0,0,0,0.18)] md:mt-10 md:p-6 backdrop-blur-sm">
                  <div className="hero-motion-root relative h-[18rem] w-[14rem] overflow-hidden rounded-[20px] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)] md:h-[28rem] md:w-[21rem] md:rounded-[24px]">
                    <MotionMedia
                      frames={homeVisuals.productDayNightIlluminatorMotion}
                      alt={productVisuals["illuminator"].alt}
                      objectFit="contain"
                      quality={92}
                      frameSizes="(max-width: 768px) 272px, 336px"
                      className="absolute inset-0 drop-shadow-[0_24px_36px_rgba(0,0,0,0.28)]"
                      overlayClassName="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(26,31,46,0.12)_0%,transparent_38%,rgba(0,0,0,0.15)_100%)]"
                    />
                  </div>
                </div>

                <div className="mx-auto mt-4 max-w-md md:mt-8">
                  <p className="copy-pretty text-[15px] leading-[1.9] text-white/72 md:text-[16px]">
                    기미, 잡티, PIH 고민을 위한 야간 브라이트닝 루틴으로, 더 맑고 정돈된 피부 컨디션을
                    차분하게 완성합니다.
                  </p>
                </div>

                <Link
                  href="/products/illuminator"
                  className="mt-5 inline-flex w-full items-center justify-center gap-2 border border-white/20 bg-white/10 px-8 py-3 text-[13px] tracking-[0.1em] text-white transition hover:bg-white/15 sm:w-auto md:mt-8"
                >
                  자세히 보기
                  <ArrowAccent />
                </Link>
              </div>
            </article>
              </div>
            </div>
          </div>
        </section>
      ) : null}

      <section className="overflow-x-clip py-5 md:py-10">
        <FeatureBannerSlider slides={featureBannerSlides} />
      </section>

      <section
        id="inquiry"
        className="scroll-mt-32 bg-[linear-gradient(145deg,#FAFAF8_0%,#ffffff_100%)] px-4 py-10 md:px-6 md:py-32 md:scroll-mt-36 lg:scroll-mt-32"
      >
        <div className="mx-auto max-w-4xl border border-black/10 bg-white p-5 sm:p-8 md:p-16">
          <div className="text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-black/5 text-stone-700">
              <BuildingIcon />
            </div>

            <p className="mt-5 text-[13px] uppercase tracking-[0.15em] text-stone-500 md:mt-8">
              Purchase Guide
            </p>
            <h2 className="display-font headline-balance mt-4 text-[28px] font-semibold leading-[1.2] tracking-[-0.02em] text-stone-900 sm:text-4xl md:text-[48px] md:leading-[1.15]">
              지금 바로 루틴을 시작하세요
            </h2>
            <p className="copy-pretty mx-auto mt-4 max-w-xl text-[15px] leading-[1.85] text-stone-600 sm:mt-5 sm:text-[16px] sm:leading-[1.9]">
              DAY CARE와 NIGHT CARE 중 필요한 루틴부터 선택해 바로 구매할 수 있습니다. 두 제품의 분위기와
              역할을 비교한 뒤, 나에게 더 잘 맞는 케어부터 가볍게 시작해 보세요.
            </p>

            <div className="pt-6 md:pt-10">
              <Link
                href="/order"
                className="btn-luxe-primary inline-flex w-full max-w-md items-center justify-center px-8 py-4 text-[14px] tracking-[0.1em] md:px-12 md:py-5"
              >
                구매 페이지로 이동하기
              </Link>
              <p className="mt-4 text-[12px] text-stone-500">원하는 제품을 고른 뒤 바로 주문할 수 있도록 간편 결제 환경을 준비했습니다.</p>
            </div>

            <div className="mt-8 border-t border-black/5 pt-6 md:mt-12 md:pt-12">
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

      <section className="bg-[#FAFAF8] px-4 py-10 md:px-6 md:py-24">
        <div className="relative mx-auto max-w-5xl overflow-hidden rounded-[30px] border border-[rgba(184,145,86,0.22)] bg-[linear-gradient(165deg,#ffffff_0%,#fdfbf7_48%,#faf6ef_100%)] px-5 py-7 text-center shadow-[0_22px_56px_rgba(89,63,28,0.07)] md:px-10 md:py-14">
          <div className="pointer-events-none absolute -right-16 -top-20 h-52 w-52 rounded-full bg-[#d7b27d]/14 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -left-12 h-48 w-48 rounded-full bg-[#c9a66b]/12 blur-3xl" />
          <div className="pointer-events-none absolute inset-x-10 top-0 h-px bg-[linear-gradient(90deg,transparent_0%,rgba(184,145,86,0.35)_50%,transparent_100%)]" />

          <div className="relative">
            <p className="text-[12px] font-medium tracking-[0.18em] text-[#8b673f]">레퍼럴 안내</p>
            <h2 className="display-font headline-balance mt-4 text-[30px] font-semibold leading-[1.22] tracking-[-0.02em] text-stone-900 md:text-[42px] md:leading-[1.18]">
              안내된 링크와 코드로
              <span className="mt-1 block bg-[linear-gradient(92deg,#9d7442_0%,#c49a5c_42%,#8b673f_100%)] bg-clip-text text-transparent md:mt-0 md:inline">
                주문하기
              </span>
            </h2>
            <p className="copy-pretty mx-auto mt-4 max-w-2xl text-[15px] leading-[1.85] text-stone-600 md:mt-6">
              인플루언서 등으로 받은 링크로 들어오거나, 주문 시 추천 코드를 입력하면 안내된 조건 그대로
              결제할 수 있습니다.
            </p>

            <div className="mx-auto mt-5 grid max-w-3xl gap-3 text-left md:mt-8 md:grid-cols-3 md:gap-4">
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
                  제품 담기 후 주문 화면에서 코드만 입력하세요.
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

            <div className="pt-6 md:pt-10">
              <Link
                href="/order"
                className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-[rgba(184,145,86,0.35)] bg-[linear-gradient(135deg,#f6e8d4_0%,#d2aa73_52%,#b89156_100%)] px-10 py-4 text-[13px] font-medium tracking-[0.06em] text-stone-900 shadow-[0_14px_36px_rgba(184,145,86,0.22)] transition hover:brightness-[1.03] sm:w-auto"
              >
                추천 코드와 함께 주문하기
                <ArrowAccent />
              </Link>
            </div>

            <p className="mt-5 text-[11px] leading-relaxed text-stone-500 md:mt-8">
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

function BrandDayGlyph() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="shrink-0">
      <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="1.45" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="12" y1="1" x2="12" y2="3" stroke="currentColor" strokeWidth="1.45" strokeLinecap="round" />
      <line x1="12" y1="21" x2="12" y2="23" stroke="currentColor" strokeWidth="1.45" strokeLinecap="round" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" stroke="currentColor" strokeWidth="1.45" strokeLinecap="round" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" stroke="currentColor" strokeWidth="1.45" strokeLinecap="round" />
      <line x1="1" y1="12" x2="3" y2="12" stroke="currentColor" strokeWidth="1.45" strokeLinecap="round" />
      <line x1="21" y1="12" x2="23" y2="12" stroke="currentColor" strokeWidth="1.45" strokeLinecap="round" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" stroke="currentColor" strokeWidth="1.45" strokeLinecap="round" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" stroke="currentColor" strokeWidth="1.45" strokeLinecap="round" />
    </svg>
  );
}

function BrandNightGlyph() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true" className="shrink-0">
      <path
        fill="currentColor"
        d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
      />
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

