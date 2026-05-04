import Image from "next/image";
import Link from "next/link";

import { ProductCard } from "@/components/product-card";
import { products, siteHighlights } from "@/lib/product-data";
import { homeVisuals } from "@/lib/site-assets";

export default function HomePage() {
  return (
    <div className="space-y-28 pb-24">
      <section className="relative overflow-hidden rounded-[44px] border border-white/50 bg-[linear-gradient(135deg,#f8eee3_0%,#f5efe7_32%,#eef1f7_61%,#edf6fb_100%)] px-8 py-10 shadow-[0_30px_80px_rgba(103,82,52,0.08)] md:px-14 md:py-16">
        <div className="absolute left-[-12%] top-[-22%] h-72 w-72 rounded-full bg-[#e9ceb0]/45 blur-3xl" />
        <div className="absolute bottom-[-12%] right-[-8%] h-80 w-80 rounded-full bg-[#cad8f0]/40 blur-3xl" />

        <div className="relative grid gap-10 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
          <div className="space-y-8">
            <p className="text-xs uppercase tracking-[0.34em] text-stone-500">
              Clinical Premium Dermacosmetic
            </p>
            <div className="space-y-5">
              <p className="inline-flex rounded-full border border-[rgba(116,88,59,0.12)] bg-white/70 px-4 py-2 text-xs tracking-[0.2em] text-stone-600 backdrop-blur">
                Protect + Correct
              </p>
              <h1 className="max-w-4xl text-5xl font-semibold tracking-[-0.04em] text-stone-900 md:text-7xl">
                병원 유통 기반의 더마 코스메틱을 더 고급스럽게.
              </h1>
              <p className="max-w-2xl text-base leading-8 text-stone-600 md:text-lg">
                CAREIS는 제품 수를 늘리는 대신, 낮의 보호와 밤의 집중 케어라는 두 개의 루틴을
                깊이 있게 설명하는 브랜드 커머스를 제안합니다.
              </p>
            </div>
            <div className="grid max-w-2xl gap-3 text-sm leading-7 text-stone-600 md:grid-cols-3">
              <div className="rounded-[22px] border border-[rgba(116,88,59,0.08)] bg-white/70 p-4 backdrop-blur">
                병원 유통 기반 신뢰
              </div>
              <div className="rounded-[22px] border border-[rgba(116,88,59,0.08)] bg-white/70 p-4 backdrop-blur">
                2개 SKU 집중 운영
              </div>
              <div className="rounded-[22px] border border-[rgba(116,88,59,0.08)] bg-white/70 p-4 backdrop-blur">
                공구 트래킹 대응 구조
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/products"
                className="rounded-full bg-stone-900 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-stone-900/10"
              >
                제품 보기
              </Link>
              <Link
                href="/order?product=sun-pack"
                className="rounded-full border border-stone-900/10 bg-white/70 px-6 py-3 text-sm font-semibold text-stone-900 backdrop-blur"
              >
                공구 구매하기
              </Link>
            </div>
          </div>

          <div className="grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="relative min-h-[520px] overflow-hidden rounded-[34px] shadow-[0_40px_90px_rgba(36,25,14,0.14)]">
              <Image
                src={homeVisuals.sunHero}
                alt="심플스틱 선팩 메인 이미지"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 40vw"
                priority
              />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0)_35%,rgba(0,0,0,0.42)_100%)]" />
              <div className="absolute bottom-0 left-0 right-0 p-7 text-white">
                <p className="text-xs uppercase tracking-[0.34em] text-white/75">Day Care</p>
                <h2 className="mt-3 text-3xl font-semibold">Simple Stick Sun Pack</h2>
                <p className="mt-2 text-sm leading-7 text-white/80">
                  필름막 기술을 통해 가볍고 오래가는 데일리 선 케어.
                </p>
              </div>
            </div>

            <div className="grid gap-5">
              <div className="relative min-h-[250px] overflow-hidden rounded-[34px] bg-white shadow-[0_24px_80px_rgba(30,33,61,0.12)]">
                <Image
                  src={homeVisuals.illuminatorHero}
                  alt="일루미네이터 메인 이미지"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 24vw"
                />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0)_0%,rgba(30,32,44,0.34)_100%)]" />
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <p className="text-xs uppercase tracking-[0.34em] text-white/75">Night Care</p>
                  <h2 className="mt-2 text-2xl font-semibold">Illuminator Cysteamine 5%</h2>
                </div>
              </div>

              <div className="rounded-[34px] border border-white/50 bg-white/70 p-7 backdrop-blur">
                <p className="text-xs uppercase tracking-[0.28em] text-stone-500">Design Direction</p>
                <p className="mt-4 text-2xl font-semibold tracking-[-0.03em] text-stone-900">
                  메인은 브랜드 신뢰를, 상세는 제품별 무드를 담당합니다.
                </p>
                <p className="mt-3 text-sm leading-7 text-stone-600">
                  선팩은 warm sand, 일루미네이터는 cool pearl 무드로 분리해 같은 브랜드 안에서
                  각 제품의 역할이 뚜렷하게 보이도록 구성했습니다.
                </p>
              </div>
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
          <p className="text-xs uppercase tracking-[0.3em] text-stone-500">Routine System</p>
          <h2 className="text-4xl font-semibold tracking-[-0.04em] text-stone-900 md:text-5xl">
            낮에는 보호, 밤에는 집중 케어.
          </h2>
        </div>
        <p className="max-w-3xl text-sm leading-8 text-stone-600 md:text-base">
          메인에서는 제품을 단순 나열하지 않고, 사용자의 피부 루틴 안에서 각 제품의 역할을
          명확히 분리해 이해시키는 구조로 설계했습니다. 공구 유입 시에도 제품 특성과 구매
          동선이 빠르게 이어질 수 있습니다.
        </p>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        {products.map((product) => (
          <ProductCard key={product.slug} product={product} />
        ))}
      </section>

      <section className="rounded-[42px] bg-stone-900 px-8 py-12 text-white shadow-[0_40px_100px_rgba(23,19,18,0.18)] md:px-12 md:py-16">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-white/60">Referral Ready Commerce</p>
            <h2 className="mt-4 text-3xl font-semibold tracking-[-0.03em] md:text-5xl">
              인플루언서 공구 링크는 저장되고,
              <br className="hidden md:block" /> 주문서와 정산 데이터에 그대로 남습니다.
            </h2>
          </div>
          <div className="space-y-5">
            <p className="text-sm leading-8 text-white/75 md:text-base">
              `?ref=mina` 같은 링크 유입은 브라우저에 저장되고, 주문 저장 시 `referral_code`,
              `paymentMethod`, `paymentStatus`와 함께 DB에 남습니다. 관리자 화면에서는 주문 조회와
              XLSX 다운로드까지 한 번에 처리할 수 있습니다.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/admin/orders"
                className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-stone-900"
              >
                관리자 주문 보기
              </Link>
              <Link
                href="/order?product=sun-pack"
                className="rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white"
              >
                구매 흐름 보기
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
