import Image from "next/image";
import Link from "next/link";

import { DetailAccordionItem } from "@/components/detail-accordion-item";
import { IlluminatorDetailStory } from "@/components/illuminator-detail-story";
import { MobileProductStickyCta } from "@/components/mobile-product-sticky-cta";
import { MotionMedia } from "@/components/motion-media";
import { SunPackDetailGallery } from "@/components/sun-pack-detail-gallery";
import { SunPackStorySlide as SunPackStorySlideView } from "@/components/sun-pack-story-slide";
import { SunPackDetailTabs } from "@/components/sun-pack-detail-tabs";
import type { ProductContent } from "@/lib/product-data";
import { splitParagraphs } from "@/lib/text-paragraphs";
import {
  illuminatorDetailAssets,
  ILLUMINATOR_DETAIL_MAX_WIDTH_PX,
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
  const visual = productVisuals[product.slug];

  if (product.slug === "sun-pack") {
    return (
      <SunPackDetailPage
        product={product}
        visual={visual}
        storySlides={sunPackStorySlides ?? sunPackDetailAssets.storyImages}
      />
    );
  }

  if (product.slug === "illuminator") {
    return (
      <IlluminatorDetailPage
        product={product}
        visual={visual as (typeof productVisuals)["illuminator"]}
      />
    );
  }

  return null;
}

function IlluminatorDetailPage({
  product,
  visual,
}: {
  product: ProductContent;
  visual: (typeof productVisuals)["illuminator"];
}) {
  const heroMotionSizes = "(max-width: 1024px) 100vw, min(1920px, min(100vw, 90rem))";
  const heroCardSizes = "(max-width: 1024px) 100vw, min(1200px, 52vw)";
  const motionFrames = [visual.hero, ...visual.gallery.slice(0, 4)];

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

      <div className="rounded-[18px] bg-slate-50 p-5">
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
          href={`/cart?product=${product.slug}`}
          className="btn-luxe-secondary inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold"
        >
          장바구니
        </Link>
      </div>
    </>
  );

  return (
    <div className="pb-[calc(9.5rem+env(safe-area-inset-bottom,0px))] lg:pb-24">
      <div className="relative mx-auto grid w-full max-w-[1380px] grid-cols-1 px-4 sm:px-6 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-x-8 lg:px-8 xl:grid-cols-[minmax(0,1fr)_420px]">
        <div className="min-w-0 space-y-10 overflow-x-hidden">
          <section className="space-y-8">
            <div className="mb-2 space-y-2 lg:hidden">
              <p className="text-xs uppercase tracking-[0.16em] text-slate-500">{product.englishName}</p>
              <h1 className="text-2xl font-semibold tracking-[-0.03em] text-slate-900">{product.name}</h1>
              <p className="line-clamp-3 whitespace-pre-line text-sm leading-relaxed text-slate-600">
                {product.heroDescription}
              </p>
            </div>

            <div className="relative overflow-hidden rounded-[28px] border border-slate-800/50 bg-[#070b14] p-6 shadow-[0_40px_120px_rgba(15,23,42,0.5)] md:rounded-[40px] md:p-10 lg:p-12">
              <MotionMedia
                frames={motionFrames}
                alt={`${product.name} 히어로 모션`}
                priority
                className="absolute inset-0"
                frameSizes={heroMotionSizes}
                quality={92}
                objectFit="cover"
                overlayClassName="absolute inset-0 bg-[linear-gradient(100deg,rgba(8,12,24,0.92)_0%,rgba(15,23,42,0.45)_48%,rgba(30,27,75,0.55)_100%)]"
              />

              <div className="relative z-10 grid items-start gap-10 lg:grid-cols-[0.88fr_1.12fr] lg:gap-12">
                <div className="space-y-6">
                  <p className="text-xs uppercase tracking-[0.32em] text-indigo-200/75">{product.englishName}</p>
                  <div className="space-y-4">
                    <p className="inline-flex rounded-full border border-white/12 bg-white/10 px-4 py-2 text-xs tracking-[0.18em] text-indigo-100/90 backdrop-blur">
                      Night Ritual Essential
                    </p>
                    <h2 className="display-font headline-balance text-4xl font-semibold tracking-[-0.04em] text-white sm:text-5xl md:text-6xl lg:text-7xl">
                      {product.heroTitle}
                    </h2>
                    <div className="max-w-2xl space-y-4 text-base leading-8 text-slate-200/90 md:text-lg">
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
                        className="rounded-full border border-white/14 bg-white/10 px-4 py-2 text-sm text-indigo-50/95 backdrop-blur"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                  <div className="flex flex-wrap items-center gap-4 pt-2">
                    <p className="text-2xl font-semibold text-white">{formatCurrency(product.price)}</p>
                    <Link
                      href={`/order?product=${product.slug}`}
                      className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-900"
                    >
                      바로 구매
                    </Link>
                    <Link
                      href={`/cart?product=${product.slug}`}
                      className="rounded-full border border-white/20 bg-white/10 px-5 py-3 text-sm font-semibold text-white backdrop-blur"
                    >
                      장바구니
                    </Link>
                  </div>
                  <div className="grid gap-3 pt-2 sm:grid-cols-2 xl:grid-cols-3">
                    {product.introPoints.map((point) => (
                      <div
                        key={point}
                        className="rounded-[20px] border border-white/12 bg-white/8 p-4 text-sm leading-7 text-indigo-50/90 backdrop-blur"
                      >
                        {point}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_220px]">
                  <div className="relative mx-auto aspect-square w-full max-w-[min(100%,440px)] overflow-hidden rounded-[26px] bg-white/10 shadow-[0_34px_90px_rgba(0,0,0,0.35)] md:max-w-[min(100%,520px)] md:rounded-[34px] lg:mx-0 lg:max-w-none">
                    <Image
                      src={visual.hero}
                      alt={visual.alt}
                      fill
                      className="object-cover"
                      sizes={heroCardSizes}
                      quality={92}
                      priority
                    />
                  </div>
                  <div className="hidden gap-4 lg:grid">
                    {visual.gallery.slice(1, 3).map((image, index) => (
                      <div
                        key={image + index}
                        className="relative aspect-square w-full min-h-0 overflow-hidden rounded-[26px] bg-white/10"
                      >
                        <Image
                          src={image}
                          alt={`${product.name} 서브 이미지 ${index + 1}`}
                          fill
                          className="object-cover"
                          sizes="(max-width: 1024px) 100vw, 18vw"
                          quality={90}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {product.problemPoints?.length ? (
            <section className="rounded-[28px] border border-slate-200/90 bg-white p-6 shadow-[0_24px_70px_rgba(30,41,59,0.06)] md:p-10">
              <div className="grid gap-8 lg:grid-cols-[0.7fr_1.3fr] lg:items-start">
                <div>
                  <p className="text-xs uppercase tracking-[0.28em] text-indigo-600/90">Night insight</p>
                  <h3 className="display-font mt-3 text-3xl font-semibold tracking-[-0.03em] text-slate-900 md:text-4xl">
                    루틴이 끊기지 않게 만드는 이유
                  </h3>
                </div>
                <div className="grid gap-4 sm:grid-cols-3">
                  {product.problemPoints.map((problem, i) => (
                    <article
                      key={problem}
                      className="rounded-2xl border border-slate-100 bg-slate-50/90 p-5 text-sm leading-7 text-slate-700"
                    >
                      <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-700">
                        {i + 1}
                      </span>
                      <p className="mt-3">{problem}</p>
                    </article>
                  ))}
                </div>
              </div>
            </section>
          ) : null}

          <section className="rounded-[24px] border border-indigo-100/80 bg-gradient-to-r from-indigo-50/90 via-white to-slate-50 px-4 py-4 md:px-6">
            <p className="text-[11px] uppercase tracking-[0.22em] text-indigo-700/80">Core benefits</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {product.benefits.map((benefit) => (
                <span
                  key={benefit}
                  className="rounded-full border border-indigo-100 bg-white/95 px-4 py-2 text-xs font-medium leading-snug text-slate-800 shadow-sm"
                >
                  {benefit}
                </span>
              ))}
            </div>
          </section>

          <section>
            <SunPackDetailGallery
              accent="cool"
              mainFrame="square"
              maxWidthPx={ILLUMINATOR_DETAIL_MAX_WIDTH_PX}
              defaultMainSrc={illuminatorDetailAssets.heroImage}
              thumbnailSrcs={[...illuminatorDetailAssets.thumbnailImages]}
              alt={visual.alt}
              pixelSize={illuminatorDetailAssets.heroPixelSize}
              productName={product.name}
            />
          </section>

          <SunPackDetailTabs />

          <section id="detail" className="scroll-mt-[var(--site-sticky-offset)]">
            <IlluminatorDetailStory product={product} />
          </section>

          <section
            id="guide"
            className="scroll-mt-[var(--site-sticky-offset)] overflow-hidden rounded-[28px] border border-[rgba(184,145,86,0.18)] bg-[linear-gradient(180deg,#fffdfa_0%,#f8f1e7_100%)] shadow-[0_24px_60px_rgba(89,63,28,0.06)]"
          >
            <PurchaseExchangeReturnGuideHeader />
            <div id="exchange-return" className="px-4 py-2 md:px-6 md:py-4">
              <ExchangeReturnAccordionList />
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
        </div>

        <aside className="pointer-events-auto hidden min-h-0 w-full lg:block">
          <div className="sticky top-[calc(var(--site-sticky-offset)+env(safe-area-inset-top,0px))] z-40 max-h-[calc(100dvh-var(--site-sticky-offset)-max(1rem,env(safe-area-inset-bottom,0px)))] space-y-6 overflow-y-auto overscroll-contain rounded-[22px] border border-stone-200 bg-white p-7 shadow-[0_24px_70px_rgba(15,15,15,0.14)]">
            {purchaseAsideBody}
          </div>
        </aside>
      </div>

      <MobileProductStickyCta product={product} />
    </div>
  );
}

function ExchangeReturnAccordionList() {
  const panel = "rounded-[22px] bg-white/80 p-5 md:p-6";
  const notePanel =
    "rounded-[22px] border border-[rgba(184,145,86,0.22)] bg-[linear-gradient(180deg,rgba(255,255,255,0.92)_0%,rgba(250,244,235,0.96)_100%)] p-5 md:p-6";
  const shipCell = "rounded-[16px] bg-[#f8f5ef] p-4";

  return (
    <>
      <DetailAccordionItem title="배송 안내" summaryClassName="text-base font-semibold text-stone-900">
        <div className={panel}>
          <div className="grid gap-3 text-sm text-stone-700 md:grid-cols-2">
            <div className={shipCell}>
              <p className="font-medium text-stone-900">배송 방법</p>
              <p className="mt-2 leading-7">택배 / 전국 지역</p>
            </div>
            <div className={shipCell}>
              <p className="font-medium text-stone-900">배송 비용</p>
              <p className="mt-2 leading-7">3,000원 / 50,000원 이상 구매 시 무료</p>
            </div>
            <div className={shipCell}>
              <p className="font-medium text-stone-900">배송 기간</p>
              <p className="mt-2 leading-7">입금 확인 후 1~3일 이내 순차 출고</p>
            </div>
            <div className={shipCell}>
              <p className="font-medium text-stone-900">안내 사항</p>
              <p className="mt-2 leading-7">도서산간 지역은 추가 배송비가 발생할 수 있습니다.</p>
            </div>
          </div>
        </div>
      </DetailAccordionItem>

      <DetailAccordionItem title="교환 및 반품 주소" summaryClassName="text-base font-semibold text-stone-900">
        <div className={panel}>
          <p className="text-sm leading-7 text-stone-600">
            서울특별시 강남구 테헤란로43길 14 청수빌딩 13층 케어이즈
          </p>
          <p className="mt-5 text-sm font-medium text-stone-900">문의</p>
          <p className="mt-1 text-sm leading-7 text-stone-600">010-2556-3263</p>
          <p className="mt-4 text-sm font-medium text-stone-900">고객센터 운영시간</p>
          <p className="mt-1 text-sm leading-7 text-stone-600">
            평일 10:00~17:00 (점심 12:00~13:00), 주말·공휴일 휴무
          </p>
        </div>
      </DetailAccordionItem>

      <DetailAccordionItem
        title="교환 및 반품이 가능한 경우"
        summaryClassName="text-base font-semibold text-stone-900"
      >
        <div className={panel}>
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
        <div className={panel}>
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
        <div className={notePanel}>
          <p className="text-sm leading-7 text-stone-700">
            ※ 고객님의 마음이 바뀌어 교환, 반품을 하실 경우 상품반송 비용은 고객님께서 부담하셔야 합니다.
            <br />
            (색상 교환, 사이즈 교환 등 포함)
          </p>
        </div>
      </DetailAccordionItem>
    </>
  );
}

function PurchaseExchangeReturnGuideHeader() {
  return (
    <div className="border-b border-[rgba(184,145,86,0.16)] px-6 py-6 md:px-8">
      <p className="text-[12px] uppercase tracking-[0.22em] text-[#8b673f]">Purchase · Exchange &amp; Return</p>
      <h2 className="mt-3 text-2xl font-semibold tracking-[-0.02em] text-stone-900 md:text-3xl">
        상품구매 교환/반품
      </h2>
      <p className="mt-3 max-w-3xl text-sm leading-7 text-stone-600">
        상품 수령 후 교환 및 반품이 필요한 경우 아래를 확인해 주세요.
      </p>
    </div>
  );
}

function ProductExchangeReturnSection() {
  return (
    <section
      id="exchange-return"
      className="overflow-hidden rounded-[28px] border border-[rgba(184,145,86,0.18)] bg-[linear-gradient(180deg,#fffdfa_0%,#f8f1e7_100%)] shadow-[0_24px_60px_rgba(89,63,28,0.06)]"
    >
      <PurchaseExchangeReturnGuideHeader />

      <div className="px-4 py-2 md:px-6 md:py-4">
        <ExchangeReturnAccordionList />
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
          href={`/cart?product=${product.slug}`}
          className="btn-luxe-secondary inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold"
        >
          장바구니
        </Link>
      </div>
    </>
  );

  return (
    <div className="pb-[calc(9.5rem+env(safe-area-inset-bottom,0px))] lg:pb-24">
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
            className="scroll-mt-[var(--site-sticky-offset)] overflow-hidden rounded-[28px] border border-[rgba(184,145,86,0.18)] bg-[linear-gradient(180deg,#fffdfa_0%,#f8f1e7_100%)] shadow-[0_24px_60px_rgba(89,63,28,0.06)]"
          >
            <PurchaseExchangeReturnGuideHeader />
            <div id="exchange-return" className="px-4 py-2 md:px-6 md:py-4">
              <ExchangeReturnAccordionList />
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
        </div>

        <aside className="pointer-events-auto hidden min-h-0 w-full lg:block">
          <div className="sticky top-[calc(var(--site-sticky-offset)+env(safe-area-inset-top,0px))] z-40 max-h-[calc(100dvh-var(--site-sticky-offset)-max(1rem,env(safe-area-inset-bottom,0px)))] space-y-6 overflow-y-auto overscroll-contain rounded-[22px] border border-stone-200 bg-white p-7 shadow-[0_24px_70px_rgba(15,15,15,0.14)]">
            {purchaseAsideBody}
          </div>
        </aside>
      </div>

      <MobileProductStickyCta product={product} />
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
