import Image from "next/image";
import Link from "next/link";

import { homeVisuals } from "@/lib/site-assets";

export default function BrandPage() {
  return (
    <div className="space-y-16 pb-24">
      <section className="grid gap-8 overflow-hidden rounded-[42px] bg-[linear-gradient(145deg,#fbf3eb_0%,#eef2fa_100%)] p-10 shadow-[0_30px_90px_rgba(62,46,24,0.08)] md:p-14 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
        <div>
        <p className="text-xs uppercase tracking-[0.34em] text-stone-500">Brand</p>
        <h1 className="display-font mt-4 text-5xl font-semibold tracking-tight text-stone-900 md:text-6xl">
          CAREIS는 적게, 깊게 설명하는 더마 코스메틱 커머스입니다.
        </h1>
        <p className="mt-6 max-w-3xl text-base leading-8 text-stone-600 md:text-lg">
          병원 유통 기반의 신뢰를 바탕으로, 낮에는 피부를 보호하고 밤에는 집중적으로 관리하는
          2-step 루틴을 구성합니다. SKU가 적기 때문에 더 많은 배너 대신 더 깊은 설명과 더
          높은 완성도의 상세페이지에 집중합니다.
        </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/products" className="rounded-full bg-stone-900 px-5 py-3 text-sm font-semibold text-white">
              제품 보기
            </Link>
            <Link href="/order?product=sun-pack" className="rounded-full border border-stone-900/10 bg-white/70 px-5 py-3 text-sm font-semibold text-stone-900">
              주문 흐름 보기
            </Link>
          </div>
        </div>
        <div className="relative min-h-[420px] overflow-hidden rounded-[32px]">
          <Image src={homeVisuals.sunHero} alt="케어이즈 브랜드 이미지" fill className="object-cover" sizes="(max-width: 1024px) 100vw, 50vw" />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0)_25%,rgba(0,0,0,0.35)_100%)]" />
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-3">
        <article className="rounded-[30px] border border-[rgba(116,88,59,0.12)] bg-white p-8 shadow-[0_18px_60px_rgba(73,53,26,0.05)]">
          <h2 className="text-xl font-semibold text-stone-900">Clinical Premium</h2>
          <p className="mt-3 text-sm leading-7 text-stone-600">
            자극적인 화장품 광고보다 병원 유통 기반의 정돈된 프리미엄 톤을 우선합니다.
          </p>
        </article>
        <article className="rounded-[30px] border border-[rgba(116,88,59,0.12)] bg-white p-8 shadow-[0_18px_60px_rgba(73,53,26,0.05)]">
          <h2 className="text-xl font-semibold text-stone-900">Protect + Correct</h2>
          <p className="mt-3 text-sm leading-7 text-stone-600">
            선팩은 데일리 보호, 일루미네이터는 야간 집중 관리라는 명확한 역할 분리를 갖습니다.
          </p>
        </article>
        <article className="rounded-[30px] border border-[rgba(116,88,59,0.12)] bg-white p-8 shadow-[0_18px_60px_rgba(73,53,26,0.05)]">
          <h2 className="text-xl font-semibold text-stone-900">Referral Ready</h2>
          <p className="mt-3 text-sm leading-7 text-stone-600">
            공구 유입은 referral_code로 기록되며, 주문 데이터와 함께 관리자 화면에서 추적됩니다.
          </p>
        </article>
      </section>
    </div>
  );
}
