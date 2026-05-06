import Image from "next/image";
import Link from "next/link";

import { MotionMedia } from "@/components/motion-media";
import type { ProductContent } from "@/lib/product-data";
import { productVisuals, sunPackDetailAssets } from "@/lib/site-assets";
import { formatCurrency } from "@/lib/utils";

export function ProductDetailPage({ product }: { product: ProductContent }) {
  const warmTheme = product.theme === "warm";
  const visual = productVisuals[product.slug];
  const isSunPack = product.slug === "sun-pack";

  return (
    <div className="space-y-24 pb-24">
      <section className="relative overflow-hidden rounded-[30px] bg-[#111111] p-6 shadow-[0_40px_140px_rgba(10,10,10,0.18)] md:rounded-[46px] md:p-10 lg:p-14">
        <MotionMedia
          frames={[visual.hero, ...visual.gallery.slice(0, 3)]}
          alt={`${product.name} 히어로 모션`}
          priority
          className="absolute inset-0"
          overlayClassName={`absolute inset-0 ${
            warmTheme
              ? "bg-[linear-gradient(90deg,rgba(10,10,10,0.8)_0%,rgba(10,10,10,0.32)_46%,rgba(10,10,10,0.64)_100%)]"
              : "bg-[linear-gradient(90deg,rgba(10,10,10,0.84)_0%,rgba(10,10,10,0.34)_46%,rgba(10,10,10,0.68)_100%)]"
          }`}
        />

        <div className="relative z-10 grid items-start gap-10 lg:grid-cols-[0.88fr_1.12fr] lg:gap-12">
          <div className="space-y-6">
            <p className="text-xs uppercase tracking-[0.32em] text-white/58">{product.englishName}</p>
            <div className="space-y-4">
              <p className="inline-flex rounded-full border border-white/12 bg-white/8 px-4 py-2 text-xs tracking-[0.18em] text-white/72 backdrop-blur">
                {warmTheme ? "Day Ritual Essential" : "Night Ritual Essential"}
              </p>
              <h1 className="display-font headline-balance text-4xl font-semibold tracking-[-0.04em] text-white sm:text-5xl md:text-6xl lg:text-7xl">
                {product.heroTitle}
              </h1>
              <p className="copy-pretty max-w-2xl text-base leading-8 text-white/72 md:text-lg">
                {product.heroDescription}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {product.keywords.map((keyword) => (
                <span
                  key={keyword}
                  className="rounded-full border border-white/12 bg-white/8 px-4 py-2 text-sm text-white/80 backdrop-blur"
                >
                  {keyword}
                </span>
              ))}
            </div>
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <p className="text-2xl font-semibold text-white">{formatCurrency(product.price)}</p>
              <Link
                href={`/order?product=${product.slug}`}
                className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-stone-900"
              >
                바로 구매
              </Link>
              <Link
                href="/contact"
                className="rounded-full border border-white/16 bg-white/8 px-5 py-3 text-sm font-semibold text-white backdrop-blur"
              >
                제휴 문의
              </Link>
            </div>
            <div className="grid gap-3 pt-2 sm:grid-cols-2 xl:grid-cols-3">
              {product.introPoints.map((point) => (
                <div
                  key={point}
                  className="rounded-[20px] border border-white/10 bg-white/8 p-4 text-sm leading-7 text-white/76 backdrop-blur"
                >
                  {point}
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_220px]">
            <div className="relative min-h-[320px] overflow-hidden rounded-[26px] bg-white/10 shadow-[0_34px_90px_rgba(0,0,0,0.3)] sm:min-h-[420px] md:rounded-[34px] lg:min-h-[540px]">
              <Image
                src={visual.hero}
                alt={visual.alt}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
            </div>
            <div className="hidden gap-4 lg:grid">
              {visual.gallery.slice(0, 2).map((image, index) => (
                <div key={index} className="relative min-h-[258px] overflow-hidden rounded-[28px] bg-white/10">
                  <Image
                    src={image}
                    alt={`${product.name} 서브 이미지 ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 18vw"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {isSunPack ? <SunPackDetailStory /> : null}

      {!isSunPack && product.problemPoints?.length ? (
        <section className="grid gap-8 lg:grid-cols-[0.74fr_1.26fr] lg:items-start">
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-[0.3em] text-stone-500">Problem</p>
            <h2 className="display-font headline-balance text-4xl font-semibold tracking-[-0.03em] text-stone-900 md:text-5xl">
              왜 이 루틴이 더 매력적으로 느껴질까요?
            </h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {product.problemPoints.map((problem) => (
              <article
                key={problem}
                className="rounded-[28px] border border-[rgba(116,88,59,0.12)] bg-white p-7 text-stone-700 shadow-[0_20px_60px_rgba(65,45,20,0.04)]"
              >
                {problem}
              </article>
            ))}
          </div>
        </section>
      ) : null}

      {!isSunPack ? (
      <section className="grid gap-12">
        {product.sections.map((section, index) => (
          <article
            key={section.title}
            className="grid gap-8 rounded-[30px] border border-[rgba(116,88,59,0.12)] bg-white p-7 shadow-[0_24px_80px_rgba(65,45,20,0.04)] md:rounded-[38px] md:p-10 lg:grid-cols-[1.02fr_0.98fr] lg:items-center"
          >
            <div className={index % 2 === 1 ? "lg:order-2" : undefined}>
              <p className="text-xs uppercase tracking-[0.28em] text-stone-500">{section.accent}</p>
              <h3 className="display-font headline-balance mt-4 text-4xl font-semibold tracking-[-0.03em] text-stone-900">
                {section.title}
              </h3>
              <p className="copy-pretty mt-4 text-sm leading-8 text-stone-600 md:text-base">{section.description}</p>
              {section.bullets?.length ? (
                <ul className="mt-6 space-y-2 text-sm leading-8 text-stone-700">
                  {section.bullets.map((bullet) => (
                    <li key={bullet}>- {bullet}</li>
                  ))}
                </ul>
              ) : null}
            </div>

            <div className={index % 2 === 1 ? "lg:order-1" : undefined}>
              <div className="relative min-h-[280px] overflow-hidden rounded-[24px] bg-[#f7f4ef] sm:min-h-[320px] md:rounded-[30px] md:min-h-[360px]">
                <Image
                  src={visual.gallery[(index + 2) % visual.gallery.length]}
                  alt={`${product.name} 섹션 이미지 ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 40vw"
                />
              </div>
            </div>
          </article>
        ))}
      </section>
      ) : null}

      {!isSunPack ? (
      <section className="rounded-[42px] border border-[rgba(116,88,59,0.12)] bg-[linear-gradient(145deg,#f8f3ed_0%,#ffffff_100%)] p-8 shadow-[0_24px_80px_rgba(65,45,20,0.04)] md:p-12">
        <div className="grid gap-8 lg:grid-cols-[0.75fr_1.25fr]">
          <div className="space-y-4">
            <p className="text-xs uppercase tracking-[0.3em] text-stone-500">Benefits</p>
            <h2 className="display-font headline-balance text-4xl font-semibold tracking-[-0.03em] text-stone-900 md:text-5xl">
              {product.tagline}
            </h2>
            <p className="copy-pretty text-sm leading-8 text-stone-600 md:text-base">
              핵심 성분과 사용 포인트를 과하지 않게 정리해, 제품의 분위기와 루틴의 이유가 함께
              읽히도록 구성했습니다. 설명은 가볍게, 사용 장면은 더 또렷하게 전달하는 데 집중했습니다.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {product.benefits.map((benefit) => (
              <div
                key={benefit}
                className="rounded-[24px] bg-[#f8f5ef] p-5 text-sm leading-7 text-stone-700"
              >
                {benefit}
              </div>
            ))}
          </div>
        </div>
      </section>
      ) : null}

      {!isSunPack ? (
      <section className="grid gap-8 lg:grid-cols-[1fr_1fr]">
        <div className="rounded-[36px] border border-[rgba(116,88,59,0.12)] bg-white p-8 shadow-[0_24px_80px_rgba(65,45,20,0.04)] md:p-12">
          <p className="text-xs uppercase tracking-[0.3em] text-stone-500">FAQ</p>
          <div className="mt-6 space-y-6">
            {product.faq.map((item) => (
              <div key={item.question} className="border-b border-stone-100 pb-6 last:border-b-0">
                <p className="text-lg font-semibold text-stone-900">{item.question}</p>
                <p className="mt-3 text-sm leading-7 text-stone-600">{item.answer}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[36px] border border-[rgba(116,88,59,0.12)] bg-white p-8 shadow-[0_24px_80px_rgba(65,45,20,0.04)] md:p-12">
          <p className="text-xs uppercase tracking-[0.3em] text-stone-500">Product Info</p>
          <div className="mt-6 space-y-4">
            {product.info.map((entry) => (
              <div key={entry.label} className="rounded-[22px] bg-[#f8f5ef] p-5">
                <p className="text-sm font-semibold text-stone-900">{entry.label}</p>
                <p className="mt-2 text-sm leading-7 text-stone-600">{entry.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      ) : null}

      <section className="rounded-[40px] bg-stone-900 px-8 py-12 text-white shadow-[0_40px_100px_rgba(23,19,18,0.18)] md:px-12 md:py-16">
        <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-white/70">Purchase + Referral</p>
            <h2 className="headline-balance mt-4 text-3xl font-semibold tracking-[-0.03em] md:text-5xl">
              지금 바로 구매하거나, 추천 코드와 함께 시작할 수 있습니다.
            </h2>
            <p className="copy-pretty mt-3 max-w-2xl text-sm leading-8 text-white/75 md:text-base">
              일반 구매는 바로 주문 페이지로, 추천 코드가 있는 경우에는 `referral_code` 기반의
              레퍼럴 흐름으로 자연스럽게 이어질 수 있도록 구성했습니다. 제휴 문의가 필요한 경우에는
              별도 페이지에서 확인할 수 있습니다.
            </p>
          </div>

          <div className="flex gap-3">
            <Link
              href={`/order?product=${product.slug}`}
              className="rounded-full border border-white/20 px-5 py-3 text-sm font-semibold"
            >
              바로 구매
            </Link>
            <Link
              href="/contact"
              className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-stone-900"
            >
              제휴 문의
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function SunPackDetailStory() {
  return (
    <section className="space-y-10">
      <div className="mx-auto max-w-5xl text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-stone-500">Sun Pack Detail</p>
        <h2 className="display-font headline-balance mt-4 text-4xl font-semibold tracking-[-0.03em] text-stone-900 md:text-5xl">
          보내주신 선팩 상세 원본을 그대로 중심에 배치했습니다.
        </h2>
        <p className="copy-pretty mt-4 text-sm leading-8 text-stone-600 md:text-base">
          제품 소개, 특허 기술, 사용 장면, FAQ, 상품 정보 고시까지 실제 상세페이지 흐름이 한 번에
          읽히도록 원본 이미지 시퀀스를 그대로 노출합니다.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {sunPackDetailAssets.motionFrames.map((image, index) => (
          <div
            key={image}
            className="relative overflow-hidden rounded-[28px] border border-[rgba(116,88,59,0.12)] bg-white shadow-[0_24px_80px_rgba(65,45,20,0.05)]"
          >
            <div className="relative aspect-[3/2]">
              <Image
                src={image}
                alt={`선팩 사용 장면 ${index + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-8">
        {sunPackDetailAssets.storyImages.map((image, index) => (
          <div
            key={image}
            className="relative mx-auto max-w-5xl overflow-hidden rounded-[30px] border border-[rgba(116,88,59,0.12)] bg-white shadow-[0_28px_90px_rgba(65,45,20,0.06)]"
          >
            <Image
              src={image}
              alt={`선팩 상세 원본 ${index + 1}`}
              width={1200}
              height={1800}
              className="h-auto w-full"
              sizes="(max-width: 1280px) 100vw, 1100px"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
