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
              Product Value
            </p>
            <h2 className="display-font headline-balance text-4xl font-semibold leading-[1.2] tracking-[-0.02em] text-stone-900 md:text-[48px]">
              하루의 피부는 하나의 텍스처로 설명되지 않습니다.
            </h2>
            <p className="copy-pretty mx-auto mt-6 max-w-2xl text-[15px] leading-[1.9] text-stone-600 md:text-[16px]">
              선팩은 가볍고 편안하게, 일루미네이터는 더 깊고 밀도 있게. 서로 다른 시간에 필요한 결을
              나눠 담아 CAREIS만의 2-step 루틴을 완성했습니다.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
            <article className="overflow-hidden rounded-[34px] border border-[rgba(116,88,59,0.12)] bg-[linear-gradient(145deg,#fbf7f0_0%,#ffffff_62%,#f6efe5_100%)] p-8 shadow-[0_24px_80px_rgba(73,53,26,0.06)] md:p-10">
              <div className="flex items-center justify-between gap-6">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.2em] text-stone-500">Day Care Essence</p>
                  <h3 className="display-font headline-balance mt-4 text-4xl font-semibold tracking-[-0.03em] text-stone-900 md:text-[44px]">
                    가볍게 밀착되고,
                    <br />
                    오래 남는 데일리 보호감
                  </h3>
                </div>
                <div className="hidden h-20 w-20 rounded-full bg-[#d4af37]/14 blur-2xl md:block" />
              </div>

              <p className="copy-pretty mt-6 max-w-2xl text-sm leading-8 text-stone-600 md:text-base">
                선팩은 답답함보다 산뜻함이 먼저 느껴지고, 백탁보다 자연스러운 피부 표현이 오래 남도록
                설계된 데이 루틴입니다. 외출 전, 메이크업 전후, 햇빛이 강한 하루에도 리듬을 흐트러뜨리지
                않는 사용감이 매력의 중심이 됩니다.
              </p>

              <div className="mt-8 grid gap-4 md:grid-cols-[0.72fr_0.28fr] md:items-end">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-[24px] border border-[rgba(116,88,59,0.1)] bg-white/80 p-5">
                    <p className="text-[11px] uppercase tracking-[0.18em] text-stone-500">Texture</p>
                    <p className="mt-3 text-sm leading-7 text-stone-700">
                      번들거림보다 부드럽고 얇게 밀착되는 텍스처로 낮 시간 내내 편안한 인상을 남깁니다.
                    </p>
                  </div>
                  <div className="rounded-[24px] border border-[rgba(116,88,59,0.1)] bg-white/80 p-5">
                    <p className="text-[11px] uppercase tracking-[0.18em] text-stone-500">Finish</p>
                    <p className="mt-3 text-sm leading-7 text-stone-700">
                      메이크업 위에서도 부담이 적고, 피부 위에 얹는 순간 전체 인상을 정돈하는 마무리감이
                      돋보입니다.
                    </p>
                  </div>
                </div>

                <div className="relative mx-auto h-[220px] w-[170px] md:h-[260px] md:w-[190px]">
                  <Image
                    src={productVisuals["sun-pack"].card}
                    alt={productVisuals["sun-pack"].alt}
                    fill
                    className="object-contain drop-shadow-[0_28px_46px_rgba(116,88,59,0.18)]"
                    sizes="190px"
                  />
                </div>
              </div>
            </article>

            <article className="relative overflow-hidden rounded-[34px] border border-[rgba(116,88,59,0.12)] bg-[#1f1b18] p-8 text-white shadow-[0_24px_80px_rgba(29,20,11,0.16)] md:p-10">
              <div className="absolute inset-0 opacity-[0.22]">
                <Image
                  src={productVisuals["illuminator"].hero}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="50vw"
                />
              </div>
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(23,19,18,0.32)_0%,rgba(23,19,18,0.88)_100%)]" />

              <div className="relative z-10">
                <p className="text-[11px] uppercase tracking-[0.22em] text-white/50">Night Care Essence</p>
                <h3 className="display-font headline-balance mt-4 text-4xl font-semibold leading-[1.08] tracking-[-0.03em] md:text-[44px]">
                  더 깊고 조용하게,
                  <br />
                  밤에 완성되는 브라이트닝 밀도
                </h3>
                <p className="copy-pretty mt-6 max-w-xl text-sm leading-8 text-white/74 md:text-base">
                  일루미네이터는 낮의 피로가 남은 피부를 밤 사이 더 차분하고 매끈한 결로 정돈하는 나이트
                  루틴입니다. 색소 고민을 위한 집중감과 스킨케어처럼 이어지는 부드러운 흐름을 함께 담아,
                  하루의 끝에서 피부 컨디션을 다시 세팅합니다.
                </p>

                <div className="mt-8 space-y-4">
                  <div className="rounded-[22px] border border-white/10 bg-white/6 p-5 backdrop-blur-sm">
                    <p className="text-[11px] uppercase tracking-[0.18em] text-white/45">Care Point</p>
                    <p className="mt-3 text-sm leading-7 text-white/78">
                      기미, 잡티, PIH처럼 밤에 더 깊게 다루고 싶은 고민을 위한 집중 브라이트닝 루틴
                    </p>
                  </div>
                  <div className="rounded-[22px] border border-white/10 bg-white/6 p-5 backdrop-blur-sm">
                    <p className="text-[11px] uppercase tracking-[0.18em] text-white/45">After Feel</p>
                    <p className="mt-3 text-sm leading-7 text-white/78">
                      무겁기보다 밀도 있고, 자극적이기보다 차분하게 남는 밤 전용 사용감으로 루틴의 완성도를
                      높입니다.
                    </p>
                  </div>
                </div>
              </div>
            </article>
          </div>

          <div className="mt-10 border-t border-[rgba(116,88,59,0.1)] pt-8 text-center">
            <p className="text-[11px] uppercase tracking-[0.2em] text-stone-500">Day To Night Flow</p>
            <p className="headline-balance mx-auto mt-4 max-w-3xl text-xl font-medium tracking-[-0.02em] text-stone-900 md:text-[28px]">
              아침에는 가볍고, 밤에는 깊게. 서로 다른 결이 하나의 루틴으로 이어질 때 CAREIS의 2-step
              매력이 또렷해집니다.
            </p>
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
                      src={productVisuals["sun-pack"].gallery[4]}
                      alt={productVisuals["sun-pack"].alt}
                      fill
                      className="object-cover drop-shadow-[0_24px_36px_rgba(104,78,41,0.16)]"
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
                      src={productVisuals["illuminator"].hero}
                      alt={productVisuals["illuminator"].alt}
                      fill
                      className="object-contain drop-shadow-[0_24px_36px_rgba(0,0,0,0.22)]"
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

      <section className="relative overflow-hidden bg-[#1A1A1A] px-4 py-20 text-white md:px-6 md:py-24">
        <div className="absolute left-[10%] top-16 h-48 w-48 rounded-full bg-[#d4af37]/10 blur-3xl" />
        <div className="absolute bottom-10 right-[8%] h-56 w-56 rounded-full bg-[#8ea4c5]/12 blur-3xl" />

        <div className="relative z-10 mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:items-center">
          <div className="text-center lg:text-left">
            <p className="text-[13px] uppercase tracking-[0.2em] text-white/50">Visual Direction</p>
            <h2 className="display-font headline-balance mt-6 text-5xl font-semibold leading-[1.08] tracking-[-0.02em] md:text-[72px]">
              Hero First, Explanation Later
            </h2>
            <p className="copy-pretty mx-auto mt-8 max-w-2xl text-[16px] leading-[1.9] text-white/65 lg:mx-0">
              시각이 먼저 말하고, 제품이 증명합니다. 정제된 무드와 프리미엄 톤을 먼저 전달해 제품을
              더 기대하게 만드는 비주얼 중심 섹션입니다.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div className="relative overflow-hidden rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.08)_0%,rgba(255,255,255,0.03)_100%)] p-6 shadow-[0_24px_70px_rgba(0,0,0,0.26)] backdrop-blur-sm md:p-8">
              <p className="text-[11px] uppercase tracking-[0.18em] text-white/45">Day Care Visual</p>
              <div className="relative mt-6 h-[320px] md:h-[380px]">
                <Image
                  src={productVisuals["sun-pack"].card}
                  alt={productVisuals["sun-pack"].alt}
                  fill
                  className="object-contain drop-shadow-[0_24px_50px_rgba(212,175,55,0.18)]"
                  sizes="(max-width: 768px) 100vw, 28vw"
                />
              </div>
            </div>

            <div className="relative overflow-hidden rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.08)_0%,rgba(255,255,255,0.03)_100%)] p-6 shadow-[0_24px_70px_rgba(0,0,0,0.26)] backdrop-blur-sm md:p-8">
              <p className="text-[11px] uppercase tracking-[0.18em] text-white/45">Night Care Visual</p>
              <div className="relative mt-6 h-[320px] md:h-[380px]">
                <Image
                  src={productVisuals["illuminator"].hero}
                  alt={productVisuals["illuminator"].alt}
                  fill
                  className="object-contain drop-shadow-[0_28px_56px_rgba(120,142,170,0.18)]"
                  sizes="(max-width: 768px) 100vw, 28vw"
                />
              </div>
            </div>
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

