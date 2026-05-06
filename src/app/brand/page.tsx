import Image from "next/image";
import Link from "next/link";

import { SiteLogo } from "@/components/site-logo";
import { homeVisuals } from "@/lib/site-assets";

export default function BrandPage() {
  return (
    <div className="space-y-16 pb-24">
      <section className="grid gap-8 overflow-hidden rounded-[28px] bg-[linear-gradient(145deg,#fbf3eb_0%,#eef2fa_100%)] p-8 shadow-[0_30px_90px_rgba(62,46,24,0.08)] md:rounded-[42px] md:p-14 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
        <div>
          <div className="mb-6">
            <SiteLogo compact />
          </div>
          <p className="text-xs uppercase tracking-[0.34em] text-stone-500">Brand</p>
          <h1 className="display-font mt-4 text-4xl font-semibold tracking-tight text-stone-900 sm:text-5xl md:text-6xl">
            CAREIS는 병원과 클리닉에서
            <br className="hidden sm:block" />
            먼저 설명 가능한 브랜드여야 합니다.
          </h1>
          <p className="mt-6 max-w-3xl text-base leading-8 text-stone-600 md:text-lg">
            병원 유통 기반의 신뢰를 바탕으로, 낮에는 피부를 보호하고 밤에는 집중적으로 관리하는
            2-step 제품 구조를 제안합니다. 제품 수보다 설명의 깊이, 과장보다 신뢰를 우선합니다.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/contact" className="btn-luxe-primary rounded-full px-5 py-3 text-sm font-semibold">
              도입 문의
            </Link>
            <Link href="/products" className="btn-luxe-secondary rounded-full px-5 py-3 text-sm font-semibold">
              제품 보기
            </Link>
          </div>
        </div>
        <div className="relative min-h-[420px] overflow-hidden rounded-[32px]">
          <Image src={homeVisuals.sunHero} alt="케어이즈 브랜드 이미지" fill className="object-cover" sizes="(max-width: 1024px) 100vw, 50vw" />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0)_25%,rgba(0,0,0,0.35)_100%)]" />
        </div>
      </section>

      <section className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        <article className="rounded-[30px] border border-[rgba(116,88,59,0.12)] bg-white p-8 shadow-[0_18px_60px_rgba(73,53,26,0.05)]">
          <h2 className="text-xl font-semibold text-stone-900">Clinical Premium</h2>
          <p className="mt-3 text-sm leading-7 text-stone-600">
            자극적인 화장품 광고보다 병원 유통 기반의 정돈된 프리미엄 톤을 우선합니다.
          </p>
        </article>
        <article className="rounded-[30px] border border-[rgba(116,88,59,0.12)] bg-white p-8 shadow-[0_18px_60px_rgba(73,53,26,0.05)]">
          <h2 className="text-xl font-semibold text-stone-900">Clinic-ready Structure</h2>
          <p className="mt-3 text-sm leading-7 text-stone-600">
            선팩은 데일리 보호, 일루미네이터는 야간 집중 관리라는 명확한 역할 분리를 갖습니다.
          </p>
        </article>
        <article className="rounded-[30px] border border-[rgba(116,88,59,0.12)] bg-white p-8 shadow-[0_18px_60px_rgba(73,53,26,0.05)]">
          <h2 className="text-xl font-semibold text-stone-900">Open Referral Purchase</h2>
          <p className="mt-3 text-sm leading-7 text-stone-600">
            공개 사이트에서도 인플루언서 레퍼럴 구매를 병행할 수 있도록 추적 구조가 준비되어 있습니다.
          </p>
        </article>
      </section>
    </div>
  );
}
