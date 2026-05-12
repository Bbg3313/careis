import Image from "next/image";

import { DetailAccordionItem } from "@/components/detail-accordion-item";
import type { ProductContent } from "@/lib/product-data";
import { ILLUMINATOR_DETAIL_MAX_WIDTH_PX } from "@/lib/site-assets";
import { splitParagraphs } from "@/lib/text-paragraphs";

const BANNER = "/images/illum-hero-marble.png";
const HERO = "/images/illum-hero-hands.png";
const MODEL = "/images/illum-hero-apply.png";

export function IlluminatorDetailStory({ product }: { product: ProductContent }) {
  const [s0, s1, s2, s3] = product.sections;

  return (
    <section className="w-full bg-[linear-gradient(180deg,#e8edf7_0%,#f4f6fb_45%,#eef2f9_100%)] py-2">
      <div className="mx-auto w-full space-y-10 px-0 sm:space-y-14" style={{ maxWidth: ILLUMINATOR_DETAIL_MAX_WIDTH_PX }}>
        <div className="overflow-hidden rounded-[24px] border border-slate-200/80 bg-white shadow-[0_28px_80px_rgba(30,41,59,0.08)]">
          <div className="relative aspect-[8/5] w-full min-h-[220px] sm:aspect-[16/9] sm:min-h-[280px]">
            <Image
              src={BANNER}
              alt={`${product.name} 비주얼`}
              fill
              className="object-cover"
              sizes={`(max-width: 768px) 100vw, min(${ILLUMINATOR_DETAIL_MAX_WIDTH_PX}px, 96vw)`}
              quality={95}
              priority
            />
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,transparent_40%,rgba(15,23,42,0.55)_100%)]" />
            <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-8">
              <p className="text-[11px] uppercase tracking-[0.28em] text-white/80">{s0.accent}</p>
              <p className="mt-2 display-font text-2xl font-semibold tracking-[-0.03em] text-white sm:text-3xl md:text-4xl">
                {s0.title}
              </p>
            </div>
          </div>
        </div>

        <article className="grid gap-8 rounded-[28px] border border-slate-200/90 bg-white/95 p-6 shadow-[0_24px_70px_rgba(30,41,59,0.06)] sm:p-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-12">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-slate-500">{s0.accent}</p>
            <h3 className="display-font mt-3 text-3xl font-semibold tracking-[-0.03em] text-slate-900 sm:text-4xl">
              {s0.title}
            </h3>
            <div className="mt-5 space-y-4 text-sm leading-8 text-slate-600 sm:text-base">
              {splitParagraphs(s0.description).map((p, i) => (
                <p key={i} className="copy-pretty">
                  {p}
                </p>
              ))}
            </div>
            {s0.bullets?.length ? (
              <ul className="mt-6 space-y-2.5 text-sm leading-8 text-slate-700">
                {s0.bullets.map((b) => (
                  <li key={b} className="flex gap-2">
                    <span className="mt-0.5 font-semibold text-indigo-500">·</span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
          <div className="relative min-h-[320px] overflow-hidden rounded-[22px] bg-slate-100 shadow-inner sm:min-h-[380px] lg:min-h-[420px]">
            <Image src={MODEL} alt={`${product.name} 모델`} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 42vw" quality={92} />
          </div>
        </article>

        <div className="overflow-hidden rounded-[28px] border border-slate-800/80 bg-[#0f172a] shadow-[0_40px_100px_rgba(15,23,42,0.35)]">
          <div className="grid gap-10 p-6 sm:p-10 lg:grid-cols-[1fr_1.05fr] lg:items-center lg:gap-12 lg:p-12">
            <div className="space-y-6">
              <p className="text-xs uppercase tracking-[0.28em] text-indigo-200/90">{s2.accent}</p>
              <h3 className="display-font text-3xl font-semibold tracking-[-0.03em] text-white sm:text-4xl">{s2.title}</h3>
              <div className="space-y-4 text-sm leading-8 text-slate-300 sm:text-base">
                {splitParagraphs(s2.description).map((p, i) => (
                  <p key={i} className="copy-pretty">
                    {p}
                  </p>
                ))}
              </div>
              {s2.bullets?.length ? (
                <ol className="grid gap-3 sm:grid-cols-2">
                  {s2.bullets.map((step, i) => (
                    <li
                      key={step}
                      className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-white/95 backdrop-blur-sm"
                    >
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-500/90 text-xs font-bold text-white">
                        {i + 1}
                      </span>
                      <span className="pt-1">{step}</span>
                    </li>
                  ))}
                </ol>
              ) : null}
            </div>
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl ring-1 ring-white/10 sm:aspect-[16/11]">
              <Image src={HERO} alt={`${product.name} 나이트 케어`} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 480px" quality={92} />
            </div>
          </div>
        </div>

        <article className="rounded-[28px] border border-slate-200/90 bg-white p-6 shadow-[0_24px_70px_rgba(30,41,59,0.06)] sm:p-10">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-slate-500">{s1.accent}</p>
              <h3 className="display-font mt-3 text-3xl font-semibold tracking-[-0.03em] text-slate-900 sm:text-4xl">{s1.title}</h3>
              <div className="mt-5 space-y-4 text-sm leading-8 text-slate-600 sm:text-base">
                {splitParagraphs(s1.description).map((p, i) => (
                  <p key={i} className="copy-pretty">
                    {p}
                  </p>
                ))}
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              {[BANNER, HERO, MODEL].map((src, i) => (
                <div
                  key={src}
                  className="flex flex-col items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50/80 p-4 text-center"
                >
                  <div className="relative h-24 w-24 overflow-hidden rounded-full ring-2 ring-indigo-200/60">
                    <Image src={src} alt="" fill className="object-cover" sizes="96px" quality={88} />
                  </div>
                  <p className="text-sm font-semibold leading-snug text-slate-900">{s1.bullets?.[i] ?? ""}</p>
                </div>
              ))}
            </div>
          </div>
        </article>

        <article className="grid gap-8 overflow-hidden rounded-[28px] border border-slate-200/90 bg-white p-6 shadow-[0_24px_70px_rgba(30,41,59,0.06)] sm:p-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <div className="relative min-h-[280px] overflow-hidden rounded-[22px] bg-slate-100 lg:order-2 lg:min-h-[360px]">
            <Image src={BANNER} alt={`${product.name} 배너`} fill className="object-cover object-top" sizes="(max-width: 1024px) 100vw, 44vw" quality={90} />
          </div>
          <div className="lg:order-1">
            <p className="text-xs uppercase tracking-[0.28em] text-slate-500">{s3.accent}</p>
            <h3 className="display-font mt-3 text-3xl font-semibold tracking-[-0.03em] text-slate-900 sm:text-4xl">{s3.title}</h3>
            <div className="mt-5 space-y-4 text-sm leading-8 text-slate-600 sm:text-base">
              {splitParagraphs(s3.description).map((p, i) => (
                <p key={i} className="copy-pretty">
                  {p}
                </p>
              ))}
            </div>
            {s3.bullets?.length ? (
              <ul className="mt-6 space-y-2 text-sm leading-7 text-slate-700">
                {s3.bullets.map((b) => (
                  <li key={b}>— {b}</li>
                ))}
              </ul>
            ) : null}
          </div>
        </article>

        <div className="rounded-[28px] border border-slate-200/90 bg-white/95 p-6 shadow-[0_20px_60px_rgba(30,41,59,0.05)] sm:p-8">
          <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Product Info</p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {product.info.map((entry) => (
              <div key={entry.label} className="rounded-2xl border border-slate-100 bg-slate-50/90 p-5">
                <p className="text-sm font-semibold text-slate-900">{entry.label}</p>
                <p className="mt-2 text-sm leading-7 text-slate-600">{entry.value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[28px] border border-slate-200/90 bg-white p-6 sm:p-8">
          <p className="text-xs uppercase tracking-[0.28em] text-slate-500">FAQ</p>
          <div className="mt-2">
            {product.faq.map((item) => (
              <DetailAccordionItem key={item.question} title={item.question} summaryClassName="text-base font-semibold text-slate-900">
                <div className="space-y-3 text-sm leading-7 text-slate-600">
                  {splitParagraphs(item.answer).map((para, i) => (
                    <p key={i}>{para}</p>
                  ))}
                </div>
              </DetailAccordionItem>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
