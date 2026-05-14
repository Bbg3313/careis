import Image from "next/image";
import clsx from "clsx";

import { DetailAccordionItem } from "@/components/detail-accordion-item";
import type { ProductContent } from "@/lib/product-data";
import { ILLUMINATOR_DETAIL_MAX_WIDTH_PX, illuminatorDetailAssets } from "@/lib/site-assets";
import { splitParagraphs } from "@/lib/text-paragraphs";

/** 갤러리 썸네일과 동일 7장 순서 — product.sections(일루미 7개)와 1:1 대응 */
const cuts = illuminatorDetailAssets.thumbnailImages;

type SectionDeco = {
  badgeClass: string;
  panelGradient: string;
  stats: { label: string; value: string }[];
};

const SECTION_DECO: Record<string, SectionDeco> = {
  Solution: {
    badgeClass: "bg-indigo-600 text-white shadow-sm shadow-indigo-900/20",
    panelGradient: "from-indigo-50/95 via-white to-slate-50/90",
    stats: [
      { label: "케어 축", value: "기미·PIH" },
      { label: "제형", value: "ODT 막" },
      { label: "타이밍", value: "야간 집중" },
    ],
  },
  Cysteamine: {
    badgeClass: "bg-violet-600 text-white shadow-sm shadow-violet-900/20",
    panelGradient: "from-violet-50/90 via-white to-slate-50/90",
    stats: [
      { label: "함량", value: "5%" },
      { label: "포인트", value: "다중 기전" },
      { label: "방향", value: "브라이트닝" },
    ],
  },
  Synergy: {
    badgeClass: "bg-sky-600 text-white shadow-sm shadow-sky-900/20",
    panelGradient: "from-sky-50/90 via-white to-slate-50/90",
    stats: [
      { label: "B3", value: "나이아신아마이드" },
      { label: "보조", value: "알부틴" },
      { label: "설계", value: "삼각 배합" },
    ],
  },
  Adherence: {
    badgeClass: "bg-teal-600 text-white shadow-sm shadow-teal-900/20",
    panelGradient: "from-teal-50/85 via-white to-slate-50/90",
    stats: [
      { label: "초기 반응", value: "따가움 완화" },
      { label: "집중", value: "4개월" },
      { label: "유지", value: "주 2회" },
    ],
  },
  Evidence: {
    badgeClass: "bg-slate-800 text-white shadow-sm shadow-slate-900/30",
    panelGradient: "from-slate-100/90 via-white to-indigo-50/40",
    stats: [
      { label: "문헌", value: "Mansouri 등" },
      { label: "비교", value: "Karrabi 등" },
      { label: "전제", value: "개인차" },
    ],
  },
  ODT: {
    badgeClass: "bg-indigo-800 text-white shadow-sm shadow-indigo-950/30",
    panelGradient: "from-indigo-100/70 via-white to-slate-50/90",
    stats: [
      { label: "막", value: "폐쇄·보습" },
      { label: "분자", value: "500 Da 설계" },
      { label: "전달", value: "침투 보강" },
    ],
  },
  "How to": {
    badgeClass: "bg-amber-600 text-white shadow-sm shadow-amber-900/25",
    panelGradient: "from-amber-50/90 via-white to-slate-50/90",
    stats: [
      { label: "단계", value: "4-Step" },
      { label: "금지", value: "1h 초과" },
      { label: "룰", value: "야간·1일1회" },
    ],
  },
};

const DEFAULT_DECO: SectionDeco = {
  badgeClass: "bg-slate-700 text-white",
  panelGradient: "from-slate-50 to-white",
  stats: [],
};

function decoFor(accent?: string): SectionDeco {
  if (!accent) return DEFAULT_DECO;
  return SECTION_DECO[accent] ?? DEFAULT_DECO;
}

export function IlluminatorDetailStory({ product }: { product: ProductContent }) {
  const sections = product.sections;

  return (
    <section className="w-full bg-[linear-gradient(180deg,#e8edf7_0%,#f8fafc_38%,#eef2f9_100%)] py-6 sm:py-10">
      <div className="mx-auto w-full space-y-10 px-4 sm:space-y-14 sm:px-6" style={{ maxWidth: ILLUMINATOR_DETAIL_MAX_WIDTH_PX }}>
        {/* 상단: 상세페이지형 히어로 + 키워드 칩 */}
        <div className="relative overflow-hidden rounded-[32px] border border-indigo-200/50 bg-white shadow-[0_28px_80px_rgba(30,27,75,0.08)]">
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(125deg,#f8fafc_0%,#eef2ff_42%,#ffffff_72%)]" />
          <div className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full bg-indigo-400/15 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -left-10 h-48 w-48 rounded-full bg-violet-400/10 blur-3xl" />
          <div className="relative z-10 space-y-6 px-6 py-8 md:px-10 md:py-10">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full border border-indigo-200/80 bg-white/90 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-indigo-700">
                Product detail
              </span>
              <span className="rounded-full bg-slate-900/90 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-white">
                Illuminator
              </span>
            </div>
            <div className="grid gap-8 lg:grid-cols-[1.15fr_minmax(0,0.85fr)] lg:items-end">
              <div>
                <h2 className="display-font text-3xl font-semibold tracking-[-0.035em] text-slate-900 sm:text-4xl md:text-[2.65rem] md:leading-[1.12]">
                  일루미네이터
                  <span className="block text-[0.58em] font-medium tracking-[-0.02em] text-slate-500 sm:inline sm:before:content-['_·_']">
                    집중 케어 스토리
                  </span>
                </h2>
                <p className="copy-pretty mt-4 max-w-xl text-sm leading-relaxed text-slate-600 sm:text-base">
                  {product.tagline}
                </p>
                <p className="mt-3 max-w-xl text-sm leading-relaxed text-slate-500">
                  성분·제형·임상 근거·사용 순서를 사진과 함께 확인할 수 있습니다.
                </p>
              </div>
              <div className="flex flex-wrap gap-2 lg:justify-end">
                {product.keywords.map((kw) => (
                  <span
                    key={kw}
                    className="rounded-full border border-slate-200/90 bg-white/95 px-3.5 py-1.5 text-xs font-medium text-slate-800 shadow-sm"
                  >
                    {kw}
                  </span>
                ))}
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              {[
                { k: "Main", v: "Cysteamine 5%" },
                { k: "Tech", v: "ODT film" },
                { k: "Cycle", v: "4M → 주 2회" },
              ].map((row) => (
                <div
                  key={row.k}
                  className="rounded-2xl border border-indigo-100/90 bg-[linear-gradient(180deg,#ffffff_0%,#f4f6ff_100%)] px-4 py-3 text-center shadow-sm sm:text-left"
                >
                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-indigo-500">{row.k}</p>
                  <p className="mt-1 text-sm font-semibold text-slate-900">{row.v}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 본문 섹션: 이미지 + 카드형 타이포 교차 */}
        <div className="space-y-10 sm:space-y-12">
          {cuts.map((src, index) => {
            const block = sections[index];
            if (!block) return null;
            const reversed = index % 2 === 1;
            const deco = decoFor(block.accent);

            return (
              <article key={src} className="relative">
                {index > 0 ? (
                  <div className="mb-10 flex justify-center sm:mb-12" aria-hidden>
                    <div className="h-10 w-px bg-[linear-gradient(180deg,transparent_0%,rgba(99,102,241,0.35)_50%,transparent_100%)]" />
                  </div>
                ) : null}

                <div
                  className={clsx(
                    "overflow-hidden rounded-[32px] border border-slate-200/90 bg-white shadow-[0_24px_70px_rgba(30,41,59,0.07)] ring-1 ring-black/[0.03]",
                    "transition-shadow duration-300 hover:shadow-[0_32px_90px_rgba(30,41,59,0.09)]",
                  )}
                >
                  <div className="grid lg:grid-cols-2">
                    <div
                      className={clsx(
                        "relative min-h-[280px] w-full overflow-hidden bg-slate-100 sm:min-h-[360px] lg:min-h-[420px]",
                        reversed ? "lg:order-2" : "lg:order-1",
                      )}
                    >
                      <Image
                        src={src}
                        alt={`${product.name} — ${block.title}`}
                        fill
                        className="object-cover"
                        sizes={`(max-width: 1024px) 100vw, min(${ILLUMINATOR_DETAIL_MAX_WIDTH_PX / 2}px, 48vw)`}
                        quality={95}
                        priority={index === 0}
                      />
                      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(15,23,42,0.12)_0%,transparent_40%,rgba(15,23,42,0.35)_100%)]" />
                      <div
                        className={clsx(
                          "absolute left-4 top-4 flex h-11 w-11 items-center justify-center rounded-2xl text-sm font-bold tabular-nums text-white shadow-lg sm:left-5 sm:top-5 sm:h-12 sm:w-12 sm:text-base",
                          deco.badgeClass,
                        )}
                      >
                        {String(index + 1).padStart(2, "0")}
                      </div>
                      <div className="absolute bottom-4 left-4 right-4 sm:bottom-5 sm:left-5 sm:right-5">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.26em] text-white/80 sm:text-[11px]">
                          {block.accent}
                        </p>
                        <p className="display-font mt-1 text-lg font-semibold leading-snug tracking-[-0.02em] text-white drop-shadow sm:text-xl md:text-2xl">
                          {block.title}
                        </p>
                      </div>
                    </div>

                    <div
                      className={clsx(
                        "flex flex-col justify-center bg-gradient-to-br p-6 sm:p-9 lg:p-11",
                        deco.panelGradient,
                        reversed ? "lg:order-1" : "lg:order-2",
                      )}
                    >
                      <div className="flex flex-wrap items-center gap-2 lg:hidden">
                        <span
                          className={clsx(
                            "inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.18em]",
                            deco.badgeClass,
                          )}
                        >
                          {block.accent}
                        </span>
                      </div>
                      <h3 className="display-font mt-2 hidden text-2xl font-semibold tracking-[-0.03em] text-slate-900 lg:block lg:text-[1.65rem] lg:leading-snug">
                        {block.title}
                      </h3>
                      <div className="mt-4 hidden h-1 w-14 rounded-full bg-gradient-to-r from-indigo-500 via-violet-500 to-transparent lg:block" />

                      {deco.stats.length > 0 ? (
                        <div className="mt-6 grid grid-cols-3 gap-2 sm:gap-3">
                          {deco.stats.map((s) => (
                            <div
                              key={s.label}
                              className="rounded-2xl border border-white/80 bg-white/70 px-2 py-2.5 text-center shadow-sm backdrop-blur-sm sm:px-3 sm:py-3"
                            >
                              <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-slate-500 sm:text-[10px]">
                                {s.label}
                              </p>
                              <p className="mt-1 text-[11px] font-semibold leading-tight text-slate-900 sm:text-xs">{s.value}</p>
                            </div>
                          ))}
                        </div>
                      ) : null}

                      <div className="mt-5 space-y-3 text-sm leading-7 text-slate-600 sm:text-[15px] sm:leading-7">
                        {splitParagraphs(block.description).map((p, i) => (
                          <p key={i} className="copy-pretty first:font-medium first:text-slate-800">
                            {p}
                          </p>
                        ))}
                      </div>

                      {block.bullets?.length ? (
                        <ul className="mt-6 space-y-2.5 border-t border-slate-200/60 pt-5">
                          {block.bullets.map((b, bi) => (
                            <li
                              key={b}
                              className="relative flex gap-3 rounded-2xl border border-slate-200/70 bg-white/80 px-3 py-3 pl-4 shadow-sm sm:gap-4 sm:px-4 sm:py-3.5"
                            >
                              <span
                                className="absolute bottom-3 left-0 top-3 w-0.5 rounded-full bg-gradient-to-b from-indigo-500 to-violet-500"
                                aria-hidden
                              />
                              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-700">
                                {bi + 1}
                              </span>
                              <span className="text-sm leading-relaxed text-slate-800">{b}</span>
                            </li>
                          ))}
                        </ul>
                      ) : null}
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* 제품 정보: 벤토 그리드 */}
        <div className="overflow-hidden rounded-[32px] border border-slate-200/90 bg-white p-[1px] shadow-[0_20px_60px_rgba(30,41,59,0.06)]">
          <div className="rounded-[31px] bg-[linear-gradient(145deg,#f8fafc_0%,#ffffff_55%)] p-6 sm:p-8">
            <div className="flex flex-wrap items-end justify-between gap-4 border-b border-slate-200/80 pb-5">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-indigo-600/90">Spec sheet</p>
                <h3 className="display-font mt-2 text-xl font-semibold text-slate-900 sm:text-2xl">제품 정보</h3>
              </div>
              <p className="max-w-xs text-right text-xs leading-relaxed text-slate-500">
                성분, 용량, 권장 루틴과 주의사항입니다.
              </p>
            </div>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
              {product.info.map((entry, i) => (
                <div
                  key={entry.label}
                  className={clsx(
                    "rounded-2xl border p-5 shadow-sm transition hover:border-indigo-200/80 hover:shadow-md",
                    i === 0
                      ? "border-indigo-100/90 bg-gradient-to-br from-indigo-50/90 to-white sm:col-span-2 lg:col-span-3"
                      : i === 1
                        ? "border-slate-100 bg-white/95 sm:col-span-2 lg:col-span-3"
                        : "border-slate-100 bg-white/95 lg:col-span-2",
                  )}
                >
                  <div className="flex items-start gap-3">
                    <span
                      className={clsx(
                        "mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-xs font-bold",
                        i === 0 ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-600",
                      )}
                      aria-hidden
                    >
                      {i + 1}
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{entry.label}</p>
                      <p className="mt-2 text-sm leading-7 text-slate-600">{entry.value}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="overflow-hidden rounded-[32px] border border-slate-200/80 bg-slate-50/80 shadow-inner">
          <div className="border-b border-slate-200/80 bg-white/90 px-6 py-5 sm:px-8">
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-500">FAQ</p>
            <h3 className="display-font mt-2 text-xl font-semibold text-slate-900">자주 묻는 질문</h3>
          </div>
          <div className="px-4 py-2 sm:px-6 sm:py-4">
            {product.faq.map((item) => (
              <DetailAccordionItem
                key={item.question}
                title={item.question}
                summaryClassName="text-base font-semibold text-slate-900"
              >
                <div className="space-y-3 rounded-xl bg-white/90 px-3 py-3 text-sm leading-7 text-slate-600 sm:px-4">
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
