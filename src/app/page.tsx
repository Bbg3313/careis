import Link from "next/link";

import { MotionMedia } from "@/components/motion-media";
import { ProductCard } from "@/components/product-card";
import { SiteLogo } from "@/components/site-logo";
import { products, siteHighlights } from "@/lib/product-data";
import { homeVisuals } from "@/lib/site-assets";

export default function HomePage() {
  return (
    <div className="space-y-28 pb-24">
      <section className="relative min-h-[92vh] overflow-hidden rounded-[46px] bg-[#111111] shadow-[0_40px_140px_rgba(10,10,10,0.24)]">
        <MotionMedia
          frames={homeVisuals.heroMotion}
          alt="케어이즈 히어로 모션"
          priority
          className="absolute inset-0"
          overlayClassName="absolute inset-0 bg-[linear-gradient(90deg,rgba(9,9,9,0.82)_0%,rgba(9,9,9,0.38)_45%,rgba(9,9,9,0.58)_100%)]"
        />

        <div className="relative z-10 flex min-h-[92vh] flex-col justify-between px-8 py-8 md:px-14 md:py-12">
          <div className="pt-2">
            <SiteLogo dark compact />
          </div>

          <div className="max-w-3xl pt-12 md:pt-20">
            <p className="text-xs uppercase tracking-[0.34em] text-white/60">
              Hospital Distributed Dermacosmetic
            </p>
            <h1 className="display-font mt-6 text-6xl font-semibold leading-[0.9] text-white md:text-8xl">
              Elevated dermacosmetic
              <br />
              for clinics and
              <br />
              curated retail.
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

          <div className="grid gap-4 md:grid-cols-[1.1fr_0.9fr_0.7fr]">
            <div className="soft-panel rounded-[30px] border border-white/10 p-6 text-stone-800">
              <p className="text-[11px] uppercase tracking-[0.3em] text-stone-500">Brand Positioning</p>
              <p className="mt-4 text-xl font-semibold tracking-[-0.03em] text-stone-900">
                판매보다 먼저, 신뢰와 설명의 깊이를 보여줍니다.
              </p>
            </div>
            <div className="soft-panel rounded-[30px] border border-white/10 p-6 text-stone-800">
              <p className="text-[11px] uppercase tracking-[0.3em] text-stone-500">Open Referral Purchase</p>
              <p className="mt-4 text-sm leading-7 text-stone-700">
                레퍼럴 링크 유입은 공개 구매 동선으로 연결되며, 주문 데이터에는 추적 코드가 함께 남습니다.
              </p>
            </div>
            <div className="rounded-[30px] border border-white/10 bg-white/6 p-6 text-white backdrop-blur">
              <p className="text-[11px] uppercase tracking-[0.3em] text-white/55">Brand Film</p>
              <p className="mt-4 text-sm leading-7 text-white/78">
                영상 자산이 들어오면 이 히어로 구조 그대로 교체할 수 있도록 설계했습니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-5 md:grid-cols-3">
        {siteHighlights.map((highlight) => (
          <article
            key={highlight.title}
            className="rounded-[30px] border border-[rgba(116,88,59,0.12)] bg-white/85 p-8 shadow-[0_18px_60px_rgba(73,53,26,0.05)]"
          >
            <div className="h-12 w-12 rounded-full bg-[linear-gradient(135deg,#f0dcc3_0%,#dbe5f8_100%)]" />
            <h2 className="mt-6 text-2xl font-semibold tracking-[-0.03em] text-stone-900">{highlight.title}</h2>
            <p className="mt-3 text-sm leading-7 text-stone-600">{highlight.description}</p>
          </article>
        ))}
      </section>

      <section className="grid gap-8 lg:grid-cols-[0.75fr_1.25fr] lg:items-end">
        <div className="space-y-4">
          <p className="text-xs uppercase tracking-[0.3em] text-stone-500">Product Edit</p>
          <h2 className="display-font text-5xl font-semibold tracking-[-0.03em] text-stone-900 md:text-6xl">
            Less products.
            <br />
            Stronger story.
          </h2>
        </div>
        <p className="max-w-3xl text-sm leading-8 text-stone-600 md:text-base">
          선팩은 데일리 보호 솔루션, 일루미네이터는 야간 집중 관리 솔루션으로 구분됩니다.
          사이트는 두 제품의 역할과 기술적 차별점을 병원/클리닉 관점에서 먼저 설명하고,
          일반 구매는 보조적으로 연결합니다.
        </p>
      </section>

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
