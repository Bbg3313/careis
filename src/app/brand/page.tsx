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
          <h1 className="display-font headline-balance mt-4 text-4xl font-semibold tracking-tight text-stone-900 sm:text-5xl md:text-6xl">
            CAREIS는 하루의 루틴을 더 우아하게 완성하는 브랜드여야 합니다.
          </h1>
          <p className="copy-pretty mt-6 max-w-3xl text-base leading-8 text-stone-600 md:text-lg">
            낮에는 가볍게 보호하고 밤에는 깊이 있게 정돈하는 2-step 루틴을 보여줍니다. 제품 수를
            늘리기보다, 매일 손이 가는 사용감과 오래 남는 무드, 그리고 두 제품이 주는 인상을 더 선명하게
            전하는 데 집중합니다.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/order?product=sun-pack" className="btn-luxe-primary rounded-full px-5 py-3 text-sm font-semibold">
              구매하기
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
          <h2 className="text-xl font-semibold text-stone-900">Editorial Mood First</h2>
          <p className="mt-3 text-sm leading-7 text-stone-600">
            자극적인 표현보다, 오래 바라보고 싶어지는 정제된 비주얼과 프리미엄 무드를 먼저 전합니다.
          </p>
        </article>
        <article className="rounded-[30px] border border-[rgba(116,88,59,0.12)] bg-white p-8 shadow-[0_18px_60px_rgba(73,53,26,0.05)]">
          <h2 className="text-xl font-semibold text-stone-900">2-Step Daily Rhythm</h2>
          <p className="mt-3 text-sm leading-7 text-stone-600">
            선팩은 낮 시간 보호, 일루미네이터는 야간 집중 관리라는 명확한 역할 분리로 사용 이유가
            직관적으로 읽힙니다.
          </p>
        </article>
        <article className="rounded-[30px] border border-[rgba(116,88,59,0.12)] bg-white p-8 shadow-[0_18px_60px_rgba(73,53,26,0.05)]">
          <h2 className="text-xl font-semibold text-stone-900">Purchase Flow Ready</h2>
          <p className="mt-3 text-sm leading-7 text-stone-600">
            제품을 충분히 본 뒤 바로 구매할 수 있고, 추천 코드가 있는 경우에는 레퍼럴 링크로도 편하게
            이어갈 수 있습니다.
          </p>
        </article>
      </section>
    </div>
  );
}
