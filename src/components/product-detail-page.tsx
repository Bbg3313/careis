import Image from "next/image";
import Link from "next/link";

import { MotionMedia } from "@/components/motion-media";
import type { ProductContent } from "@/lib/product-data";
import { productVisuals } from "@/lib/site-assets";
import { formatCurrency } from "@/lib/utils";

export function ProductDetailPage({ product }: { product: ProductContent }) {
  const warmTheme = product.theme === "warm";
  const visual = productVisuals[product.slug];

  return (
    <div className="space-y-24 pb-24">
      <section className="relative overflow-hidden rounded-[46px] bg-[#111111] p-8 shadow-[0_40px_140px_rgba(10,10,10,0.18)] md:p-14">
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

        <div className="relative z-10 grid items-center gap-10 lg:grid-cols-[0.88fr_1.12fr]">
          <div className="space-y-6">
            <p className="text-xs uppercase tracking-[0.32em] text-white/58">{product.englishName}</p>
            <div className="space-y-4">
              <p className="inline-flex rounded-full border border-white/12 bg-white/8 px-4 py-2 text-xs tracking-[0.18em] text-white/72 backdrop-blur">
                {warmTheme ? "Clinic-ready Daily Solution" : "Clinic-focused Night Solution"}
              </p>
              <h1 className="display-font text-5xl font-semibold tracking-[-0.04em] text-white md:text-7xl">
                {product.heroTitle}
              </h1>
              <p className="max-w-2xl text-base leading-8 text-white/72 md:text-lg">
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
                href="/contact"
                className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-stone-900"
              >
                도입 문의
              </Link>
              <Link
                href={`/order?product=${product.slug}`}
                className="rounded-full border border-white/16 bg-white/8 px-5 py-3 text-sm font-semibold text-white backdrop-blur"
              >
                레퍼럴 구매
              </Link>
            </div>
            <div className="grid gap-3 pt-2 md:grid-cols-3">
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

          <div className="grid gap-4 md:grid-cols-[0.72fr_0.28fr]">
            <div className="relative min-h-[540px] overflow-hidden rounded-[34px] bg-white/10 shadow-[0_34px_90px_rgba(0,0,0,0.3)]">
              <Image
                src={visual.hero}
                alt={visual.alt}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
            </div>
            <div className="grid gap-4">
              {visual.gallery.slice(0, 2).map((image, index) => (
                <div key={index} className="relative min-h-[262px] overflow-hidden rounded-[28px] bg-white/10">
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

      {product.problemPoints?.length ? (
        <section className="grid gap-8 lg:grid-cols-[0.74fr_1.26fr] lg:items-start">
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-[0.3em] text-stone-500">Problem</p>
            <h2 className="display-font text-4xl font-semibold tracking-[-0.03em] text-stone-900 md:text-5xl">
              왜 새로운 루틴이 필요할까요?
            </h2>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
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

      <section className="grid gap-12">
        {product.sections.map((section, index) => (
          <article
            key={section.title}
            className="grid gap-8 rounded-[38px] border border-[rgba(116,88,59,0.12)] bg-white p-7 shadow-[0_24px_80px_rgba(65,45,20,0.04)] md:p-10 lg:grid-cols-[1.02fr_0.98fr] lg:items-center"
          >
            <div className={index % 2 === 1 ? "lg:order-2" : undefined}>
              <p className="text-xs uppercase tracking-[0.28em] text-stone-500">{section.accent}</p>
              <h3 className="display-font mt-4 text-4xl font-semibold tracking-[-0.03em] text-stone-900">
                {section.title}
              </h3>
              <p className="mt-4 text-sm leading-8 text-stone-600 md:text-base">{section.description}</p>
              {section.bullets?.length ? (
                <ul className="mt-6 space-y-2 text-sm leading-8 text-stone-700">
                  {section.bullets.map((bullet) => (
                    <li key={bullet}>- {bullet}</li>
                  ))}
                </ul>
              ) : null}
            </div>

            <div className={index % 2 === 1 ? "lg:order-1" : undefined}>
              <div className="relative min-h-[360px] overflow-hidden rounded-[30px] bg-[#f7f4ef]">
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

      <section className="rounded-[42px] border border-[rgba(116,88,59,0.12)] bg-[linear-gradient(145deg,#f8f3ed_0%,#ffffff_100%)] p-8 shadow-[0_24px_80px_rgba(65,45,20,0.04)] md:p-12">
        <div className="grid gap-8 lg:grid-cols-[0.75fr_1.25fr]">
          <div className="space-y-4">
            <p className="text-xs uppercase tracking-[0.3em] text-stone-500">Benefits</p>
            <h2 className="display-font text-4xl font-semibold tracking-[-0.03em] text-stone-900 md:text-5xl">
              {product.tagline}
            </h2>
            <p className="text-sm leading-8 text-stone-600 md:text-base">
              제품 소개서에서 확인한 강점을 병원/클리닉에서 설명 가능한 언어로 재구성했습니다.
              공개 구매는 가능하지만, 이 페이지의 1차 목적은 제품의 기술과 도입 맥락을 이해시키는
              것입니다.
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

      <section className="rounded-[40px] bg-stone-900 px-8 py-12 text-white shadow-[0_40px_100px_rgba(23,19,18,0.18)] md:px-12 md:py-16">
        <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-white/70">B2B + Referral</p>
            <h2 className="mt-4 text-3xl font-semibold tracking-[-0.03em] md:text-5xl">
              도입 문의는 앞단에 두고,
              <br className="hidden md:block" /> 레퍼럴 구매는 공개적으로 병행합니다.
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-8 text-white/75 md:text-base">
              병원 및 클리닉 대상 문의는 별도 상담 흐름으로, 인플루언서 유입은 `referral_code`
              기반 공개 구매 흐름으로 연결됩니다. 두 구조가 충돌하지 않도록 분리해 설계했습니다.
            </p>
          </div>

          <div className="flex gap-3">
            <Link
              href="/contact"
              className="rounded-full border border-white/20 px-5 py-3 text-sm font-semibold"
            >
              도입 문의
            </Link>
            <Link
              href={`/order?product=${product.slug}`}
              className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-stone-900"
            >
              레퍼럴 구매
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
