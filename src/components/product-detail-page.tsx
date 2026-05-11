import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";

import { MotionMedia } from "@/components/motion-media";
import { SunPackDetailGallery } from "@/components/sun-pack-detail-gallery";
import { SunPackStorySlide as SunPackStorySlideView } from "@/components/sun-pack-story-slide";
import { SunPackDetailTabs } from "@/components/sun-pack-detail-tabs";
import type { ProductContent } from "@/lib/product-data";
import { splitParagraphs } from "@/lib/text-paragraphs";
import {
  productVisuals,
  sunPackDetailAssets,
  SUN_PACK_DETAIL_MAX_WIDTH_PX,
  type SunPackStorySlide,
} from "@/lib/site-assets";
import { formatCurrency } from "@/lib/utils";

export function ProductDetailPage({
  product,
  sunPackStorySlides,
}: {
  product: ProductContent;
  sunPackStorySlides?: SunPackStorySlide[];
}) {
  const warmTheme = product.theme === "warm";
  const visual = productVisuals[product.slug];
  const isSunPack = product.slug === "sun-pack";
  const isIlluminator = product.slug === "illuminator";
  const heroMotionSizes =
    "(max-width: 1024px) 100vw, min(1920px, min(100vw, 90rem))";
  const heroCardSizes = "(max-width: 1024px) 100vw, min(1200px, 52vw)";

  if (isSunPack) {
    return (
      <SunPackDetailPage
        product={product}
        visual={visual}
        storySlides={sunPackStorySlides ?? sunPackDetailAssets.storyImages}
      />
    );
  }

  return (
    <div className="space-y-24 pb-24">
      <section className="relative overflow-hidden rounded-[30px] bg-[#111111] p-6 shadow-[0_40px_140px_rgba(10,10,10,0.18)] md:rounded-[46px] md:p-10 lg:p-14">
        <MotionMedia
          frames={[visual.hero, ...visual.gallery.slice(0, 3)]}
          alt={`${product.name} 히어로 모션`}
          priority
          className="absolute inset-0"
          frameSizes={isIlluminator ? heroMotionSizes : undefined}
          quality={isIlluminator ? 92 : undefined}
          objectFit="cover"
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
              <div className="max-w-2xl space-y-4 text-base leading-8 text-white/72 md:text-lg">
                {splitParagraphs(product.heroDescription).map((para, i) => (
                  <p key={i} className="copy-pretty">
                    {para}
                  </p>
                ))}
              </div>
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
                sizes={isIlluminator ? heroCardSizes : "(max-width: 1024px) 100vw, 50vw"}
                quality={isIlluminator ? 92 : 85}
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

      {product.problemPoints?.length ? (
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
              <div className="mt-4 space-y-4 text-sm leading-8 text-stone-600 md:text-base">
                {splitParagraphs(section.description).map((para, i) => (
                  <p key={i} className="copy-pretty">
                    {para}
                  </p>
                ))}
              </div>
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

      <section className="grid gap-8 lg:grid-cols-[1fr_1fr]">
        <div className="rounded-[36px] border border-[rgba(116,88,59,0.12)] bg-white p-8 shadow-[0_24px_80px_rgba(65,45,20,0.04)] md:p-12">
          <p className="text-xs uppercase tracking-[0.3em] text-stone-500">FAQ</p>
          <div className="mt-6 space-y-6">
            {product.faq.map((item) => (
              <div key={item.question} className="border-b border-stone-100 pb-6 last:border-b-0">
                <p className="text-lg font-semibold text-stone-900">{item.question}</p>
                <div className="mt-3 space-y-3 text-sm leading-7 text-stone-600">
                  {splitParagraphs(item.answer).map((para, i) => (
                    <p key={i}>{para}</p>
                  ))}
                </div>
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

      <ProductExchangeReturnSection />
    </div>
  );
}

function DetailAccordionItem({
  title,
  summaryClassName = "text-lg font-semibold text-stone-900",
  children,
}: {
  title: string;
  summaryClassName?: string;
  children: ReactNode;
}) {
  return (
    <details className="group border-t border-stone-100 first:border-t-0 [&_summary::-webkit-details-marker]:hidden">
      <summary
        className={`flex cursor-pointer list-none items-center justify-between gap-3 rounded-lg py-4 outline-none transition hover:text-stone-700 focus-visible:ring-2 focus-visible:ring-stone-400/50 focus-visible:ring-offset-2 ${summaryClassName}`}
      >
        <span>{title}</span>
        <span
          className="shrink-0 text-stone-400 transition-transform duration-200 group-open:rotate-180"
          aria-hidden
        >
          <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
            <path
              fillRule="evenodd"
              d="M5.23 7.21a.75.75 0 011.06.02L10 11.17l3.71-3.94a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
              clipRule="evenodd"
            />
          </svg>
        </span>
      </summary>
      <div className="border-t border-stone-100/80 pb-6 pt-2">{children}</div>
    </details>
  );
}

function ProductExchangeReturnSection() {
  return (
    <section
      id="exchange-return"
      className="overflow-hidden rounded-[28px] border border-[rgba(184,145,86,0.18)] bg-[linear-gradient(180deg,#fffdfa_0%,#f8f1e7_100%)] shadow-[0_24px_60px_rgba(89,63,28,0.06)]"
    >
      <div className="border-b border-[rgba(184,145,86,0.16)] px-6 py-6 md:px-8">
        <p className="text-[12px] uppercase tracking-[0.18em] text-[#8b673f]">Exchange &amp; Return Guide</p>
        <h2 className="mt-3 text-2xl font-semibold tracking-[-0.02em] text-stone-900 md:text-3xl">
          교환 / 반품 안내
        </h2>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-stone-600">
          상품 수령 후 교환 및 반품이 필요한 경우 아래 기준에 따라 접수할 수 있습니다. 접수 전 상품 상태와
          가능 여부를 먼저 확인해주세요.
        </p>
      </div>

      <div className="px-4 py-2 md:px-6 md:py-4">
        <DetailAccordionItem title="교환 및 반품 주소" summaryClassName="text-base font-semibold text-stone-900">
          <div className="rounded-[22px] bg-white/80 p-5 md:p-6">
            <p className="text-sm leading-7 text-stone-600">
              서울특별시 강남구 테헤란로43길 14 청수빌딩 13층 케어이즈
            </p>
          </div>
        </DetailAccordionItem>

        <DetailAccordionItem
          title="교환 및 반품이 가능한 경우"
          summaryClassName="text-base font-semibold text-stone-900"
        >
          <div className="rounded-[22px] bg-white/80 p-5 md:p-6">
            <ul className="space-y-3 text-sm leading-7 text-stone-600">
              <li>
                - 계약내용에 관한 서면을 받은 날부터 7일 이내. 단, 그 서면을 받은 때보다 재화 등의 공급이 늦게
                이루어진 경우에는 재화 등을 공급받거나 재화 등의 공급이 시작된 날부터 7일 이내
              </li>
              <li>
                - 공급받으신 상품 및 용역의 내용이 표시, 광고 내용과 다르거나 계약내용과 다르게 이행된 때에는
                당해 재화 등을 공급받은 날부터 3개월 이내, 그 사실을 알게 된 날 또는 알 수 있었던 날부터 30일
                이내
              </li>
            </ul>
          </div>
        </DetailAccordionItem>

        <DetailAccordionItem
          title="교환 및 반품이 불가능한 경우"
          summaryClassName="text-base font-semibold text-stone-900"
        >
          <div className="rounded-[22px] bg-white/80 p-5 md:p-6">
            <ul className="space-y-3 text-sm leading-7 text-stone-600">
              <li>
                - 이용자에게 책임 있는 사유로 재화 등이 멸실 또는 훼손된 경우(다만, 재화 등의 내용을 확인하기
                위하여 포장 등을 훼손한 경우에는 청약철회를 할 수 있습니다)
              </li>
              <li>- 이용자의 사용 또는 일부 소비에 의하여 재화 등의 가치가 현저히 감소한 경우</li>
              <li>- 시간의 경과에 의하여 재판매가 곤란할 정도로 재화 등의 가치가 현저히 감소한 경우</li>
              <li>- 복제가 가능한 재화 등의 포장을 훼손한 경우</li>
              <li>
                - 개별 주문 생산되는 재화 등 청약철회 시 판매자에게 회복할 수 없는 피해가 예상되어 소비자의 사전
                동의를 얻은 경우
              </li>
              <li>
                - 디지털 콘텐츠의 제공이 개시된 경우(다만, 가분적 용역 또는 가분적 디지털콘텐츠로 구성된 계약의
                경우 제공이 개시되지 아니한 부분은 청약철회를 할 수 있습니다.)
              </li>
            </ul>
          </div>
        </DetailAccordionItem>

        <DetailAccordionItem title="반송 비용 안내" summaryClassName="text-base font-semibold text-stone-900">
          <div className="rounded-[22px] border border-[rgba(184,145,86,0.22)] bg-[linear-gradient(180deg,rgba(255,255,255,0.92)_0%,rgba(250,244,235,0.96)_100%)] p-5 md:p-6">
            <p className="text-sm leading-7 text-stone-700">
              ※ 고객님의 마음이 바뀌어 교환, 반품을 하실 경우 상품반송 비용은 고객님께서 부담하셔야 합니다.
              <br />
              (색상 교환, 사이즈 교환 등 포함)
            </p>
          </div>
        </DetailAccordionItem>
      </div>
    </section>
  );
}

function SunPackDetailPage({
  product,
  visual,
  storySlides,
}: {
  product: ProductContent;
  visual: (typeof productVisuals)["sun-pack"];
  storySlides: SunPackStorySlide[];
}) {
  const purchaseAsideBody = (
    <>
      <div className="space-y-3 border-b border-stone-100 pb-6">
        <p className="text-sm text-stone-500">{product.englishName}</p>
        <h1 className="text-3xl font-semibold tracking-[-0.03em] text-stone-900">{product.name}</h1>
        <div className="space-y-3 text-base leading-7 text-stone-600">
          {splitParagraphs(product.heroDescription).map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>
      </div>

      <dl className="space-y-4 text-sm">
        <div className="grid grid-cols-[110px_1fr] gap-4 border-b border-stone-100 pb-4">
          <dt className="text-stone-500">상품명</dt>
          <dd className="font-medium text-stone-900">{product.name}</dd>
        </div>
        <div className="grid grid-cols-[110px_1fr] gap-4 border-b border-stone-100 pb-4">
          <dt className="text-stone-500">상품요약정보</dt>
          <dd className="leading-7 text-stone-700">{product.tagline}</dd>
        </div>
        <div className="grid grid-cols-[110px_1fr] gap-4 border-b border-stone-100 pb-4">
          <dt className="text-stone-500">판매가</dt>
          <dd className="text-xl font-semibold text-stone-900">{formatCurrency(product.price)}</dd>
        </div>
        <div className="grid grid-cols-[110px_1fr] gap-4 border-b border-stone-100 pb-4">
          <dt className="text-stone-500">배송방법</dt>
          <dd className="text-stone-700">택배</dd>
        </div>
        <div className="grid grid-cols-[110px_1fr] gap-4 pb-1">
          <dt className="text-stone-500">배송비</dt>
          <dd className="text-stone-700">3,000원 (50,000원 이상 구매 시 무료)</dd>
        </div>
      </dl>

      <div className="rounded-[18px] bg-[#f8f5ef] p-5">
        <div className="flex items-center justify-between gap-4">
          <span className="text-sm text-stone-500">총 상품금액</span>
          <strong className="text-2xl font-semibold text-stone-900">{formatCurrency(product.price)}</strong>
        </div>
      </div>

      <div className="flex gap-3">
        <Link
          href={`/order?product=${product.slug}`}
          className="btn-luxe-primary inline-flex flex-1 items-center justify-center rounded-full px-5 py-3 text-sm font-semibold"
        >
          바로 구매
        </Link>
        <Link
          href="/cart?product=sun-pack"
          className="btn-luxe-secondary inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold"
        >
          장바구니
        </Link>
      </div>
    </>
  );

  return (
    <div className="pb-28 lg:pb-24">
      <div className="relative mx-auto grid w-full max-w-[1380px] grid-cols-1 px-4 sm:px-6 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-x-8 lg:px-8 xl:grid-cols-[minmax(0,1fr)_420px]">
        <div className="min-w-0 space-y-10 overflow-x-hidden">
          <section>
            <div className="mb-6 space-y-2 lg:hidden">
              <p className="text-xs uppercase tracking-[0.16em] text-stone-500">{product.englishName}</p>
              <h1 className="text-2xl font-semibold tracking-[-0.03em] text-stone-900">{product.name}</h1>
              <p className="line-clamp-3 whitespace-pre-line text-sm leading-relaxed text-stone-600">
                {product.heroDescription}
              </p>
            </div>

            <SunPackDetailGallery
              defaultMainSrc={sunPackDetailAssets.heroImage}
              thumbnailSrcs={sunPackDetailAssets.thumbnailImages}
              alt={visual.alt}
              pixelSize={sunPackDetailAssets.heroPixelSize}
              productName={product.name}
            />
          </section>

          <SunPackDetailTabs />

          <section id="detail" className="scroll-mt-[var(--site-sticky-offset)]">
            <SunPackDetailStory slides={storySlides} />
          </section>

          <section
            id="guide"
            className="scroll-mt-[var(--site-sticky-offset)] rounded-[24px] border border-stone-200 bg-white p-6 md:p-8"
          >
            <h2 className="text-2xl font-semibold tracking-[-0.02em] text-stone-900">상품구매안내</h2>

            <div className="mt-2">
              <DetailAccordionItem title="결제 안내">
                <p className="text-sm leading-7 text-stone-600">
                  고액 결제의 경우 안전을 위해 카드사 확인 절차가 진행될 수 있습니다. 주문자명과 입금자명이
                  다를 경우 처리가 지연될 수 있으며, 일정 기간 내 입금이 확인되지 않으면 주문은 자동 취소될 수
                  있습니다.
                </p>
              </DetailAccordionItem>

              <DetailAccordionItem title="배송 안내">
                <div className="grid gap-3 text-sm text-stone-700 md:grid-cols-2">
                  <div className="rounded-[16px] bg-[#f8f5ef] p-4">
                    <p className="font-medium text-stone-900">배송 방법</p>
                    <p className="mt-2 leading-7">택배 / 전국 지역</p>
                  </div>
                  <div className="rounded-[16px] bg-[#f8f5ef] p-4">
                    <p className="font-medium text-stone-900">배송 비용</p>
                    <p className="mt-2 leading-7">3,000원 / 50,000원 이상 구매 시 무료</p>
                  </div>
                  <div className="rounded-[16px] bg-[#f8f5ef] p-4">
                    <p className="font-medium text-stone-900">배송 기간</p>
                    <p className="mt-2 leading-7">입금 확인 후 1~3일 이내 순차 출고</p>
                  </div>
                  <div className="rounded-[16px] bg-[#f8f5ef] p-4">
                    <p className="font-medium text-stone-900">안내 사항</p>
                    <p className="mt-2 leading-7">도서산간 지역은 추가 배송비가 발생할 수 있습니다.</p>
                  </div>
                </div>
              </DetailAccordionItem>

              <DetailAccordionItem title="교환/반품 요약">
                <div className="space-y-3 text-sm leading-7 text-stone-600">
                  <p>
                    교환 및 반품 관련 상세 기준은 페이지 하단의 안내 내용을 통해 확인할 수 있습니다. 단순 변심에
                    의한 반송 비용은 고객 부담이며, 상품 상태에 따라 교환 및 반품이 제한될 수 있습니다.
                  </p>
                  <p>교환 및 반품 주소: 서울특별시 강남구 테헤란로43길 14, 13층(역삼동, 청수빌딩 13층)</p>
                </div>
              </DetailAccordionItem>

              <DetailAccordionItem title="서비스문의">
                <p className="text-sm leading-7 text-stone-600">
                  제품 및 주문 관련 문의는 010-2556-3263 또는 startupscon@gmail.com으로 안내받을 수
                  있습니다. 고객센터 운영시간은 평일 10:00~17:00이며, 점심시간은 12:00~13:00, 주말·공휴일은
                  휴무입니다.
                </p>
              </DetailAccordionItem>
            </div>
          </section>

          <section id="review" className="scroll-mt-[var(--site-sticky-offset)] rounded-[24px] border border-stone-200 bg-white p-6 md:p-8">
            <h2 className="text-2xl font-semibold tracking-[-0.02em] text-stone-900">상품 리뷰</h2>
            <p className="mt-4 text-sm leading-7 text-stone-500">게시물이 없습니다.</p>
          </section>

          <section id="qa" className="scroll-mt-[var(--site-sticky-offset)] rounded-[24px] border border-stone-200 bg-white p-6 md:p-8">
            <h2 className="text-2xl font-semibold tracking-[-0.02em] text-stone-900">상품 Q&amp;A</h2>
            <p className="mt-4 text-sm leading-7 text-stone-500">게시물이 없습니다.</p>
          </section>

          <ProductExchangeReturnSection />
        </div>

        <aside className="pointer-events-auto hidden min-h-0 w-full lg:block">
          <div className="sticky top-[calc(var(--site-sticky-offset)+env(safe-area-inset-top,0px))] z-40 max-h-[calc(100dvh-var(--site-sticky-offset)-max(1rem,env(safe-area-inset-bottom,0px)))] space-y-6 overflow-y-auto overscroll-contain rounded-[22px] border border-stone-200 bg-white p-7 shadow-[0_24px_70px_rgba(15,15,15,0.14)]">
            {purchaseAsideBody}
          </div>
        </aside>
      </div>

      <div className="pointer-events-auto fixed inset-x-0 bottom-0 z-40 border-t border-stone-200/90 bg-white/95 px-4 pt-3 shadow-[0_-12px_40px_rgba(0,0,0,0.08)] backdrop-blur-md lg:hidden pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        <div className="mx-auto flex max-w-lg items-center gap-3 py-1">
          <div className="min-w-0 flex-1">
            <p className="truncate text-[13px] font-semibold text-stone-900">{product.name}</p>
            <p className="text-lg font-bold tabular-nums tracking-tight text-stone-900">
              {formatCurrency(product.price)}
            </p>
          </div>
          <Link
            href="/cart?product=sun-pack"
            className="btn-luxe-secondary shrink-0 rounded-full px-4 py-2.5 text-xs font-semibold"
          >
            장바구니
          </Link>
          <Link
            href={`/order?product=${product.slug}`}
            className="btn-luxe-primary shrink-0 rounded-full px-5 py-2.5 text-xs font-semibold"
          >
            바로 구매
          </Link>
        </div>
      </div>
    </div>
  );
}

function SunPackDetailStory({ slides }: { slides: SunPackStorySlide[] }) {
  return (
    <section className="w-full bg-[#f7f3f0] py-1">
      <div className="mx-auto w-full px-0" style={{ maxWidth: SUN_PACK_DETAIL_MAX_WIDTH_PX }}>
        <div className="space-y-0">
          {slides.map((slide, index) => {
            const paras = slide.body ? splitParagraphs(slide.body) : [];
            return (
              <div
                key={`${slide.src}-${index}`}
                className="mx-auto w-full min-w-0"
                style={{
                  maxWidth: Math.min(slide.width, SUN_PACK_DETAIL_MAX_WIDTH_PX),
                }}
              >
                <SunPackStorySlideView slide={slide} index={index} />
                {paras.length > 0 ? (
                  <div className="border-t border-[rgba(116,88,59,0.12)] bg-[#faf7f3] px-4 py-8 sm:px-8 md:py-10">
                    <div className="mx-auto max-w-[min(42rem,100%)] space-y-4 text-center text-sm leading-8 text-stone-700 md:text-base">
                      {paras.map((para, i) => (
                        <p key={i} className="copy-pretty">
                          {para}
                        </p>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
