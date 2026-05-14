import Image from "next/image";

import { DetailAccordionItem } from "@/components/detail-accordion-item";
import type { ProductContent } from "@/lib/product-data";
import { ILLUMINATOR_DETAIL_MAX_WIDTH_PX, illuminatorDetailAssets } from "@/lib/site-assets";
import { splitParagraphs } from "@/lib/text-paragraphs";

/** product.sections(4개)와 맞추기 — 갤러리 썸네일만 7장일 때 앞 4장만 스토리에 사용 */
const cuts = illuminatorDetailAssets.thumbnailImages.slice(0, 4);
const STORY_ASPECT = "aspect-[780/1024]";

export function IlluminatorDetailStory({ product }: { product: ProductContent }) {
  const sections = product.sections;

  return (
    <section className="w-full bg-[linear-gradient(180deg,#eef2f9_0%,#f8fafc_40%,#f1f5f9_100%)] py-4 sm:py-6">
      <div className="mx-auto w-full space-y-10 px-0 sm:space-y-14" style={{ maxWidth: ILLUMINATOR_DETAIL_MAX_WIDTH_PX }}>
        <header className="px-4 text-center sm:px-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-500">Editorial</p>
          <h2 className="display-font mt-3 text-3xl font-semibold tracking-[-0.03em] text-slate-900 sm:text-4xl">
            일루미네이터 스토리
          </h2>
          <p className="copy-pretty mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-base">
            갤러리 앞쪽 네 가지 컷을 순서대로 펼칩니다. 각 장면에 맞춰 제품의 포지션과 루틴을 정리했습니다.
          </p>
        </header>

        <div className="space-y-8 sm:space-y-10">
          {cuts.map((src, index) => {
            const block = sections[index];
            if (!block) return null;
            return (
              <article
                key={src}
                className="overflow-hidden rounded-[28px] border border-slate-200/90 bg-white shadow-[0_24px_70px_rgba(30,41,59,0.07)]"
              >
                <div
                  className={`relative w-full overflow-hidden bg-slate-100 ${STORY_ASPECT} min-h-[240px] sm:min-h-[320px]`}
                >
                  <Image
                    src={src}
                    alt={`${product.name} 에디토리얼 ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes={`(max-width: 768px) 100vw, min(${ILLUMINATOR_DETAIL_MAX_WIDTH_PX}px, 96vw)`}
                    quality={95}
                    priority={index === 0}
                  />
                  <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,transparent_50%,rgba(15,23,42,0.55)_100%)]" />
                  <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-8">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.26em] text-white/75 sm:text-[11px]">
                      {block.accent}
                    </p>
                    <p className="display-font mt-2 text-xl font-semibold tracking-[-0.02em] text-white sm:text-2xl md:text-3xl">
                      {block.title}
                    </p>
                  </div>
                </div>

                <div className="space-y-5 p-6 sm:p-10">
                  <div className="space-y-4 text-sm leading-8 text-slate-600 sm:text-base">
                    {splitParagraphs(block.description).map((p, i) => (
                      <p key={i} className="copy-pretty">
                        {p}
                      </p>
                    ))}
                  </div>
                  {block.bullets?.length ? (
                    <ul className="grid gap-3 sm:grid-cols-2">
                      {block.bullets.map((b) => (
                        <li
                          key={b}
                          className="flex gap-2.5 rounded-2xl border border-slate-100 bg-slate-50/90 px-4 py-3 text-sm leading-relaxed text-slate-800"
                        >
                          <span className="mt-0.5 font-semibold text-indigo-500">·</span>
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              </article>
            );
          })}
        </div>

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
