"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

type FeatureBannerSlide = {
  label: string;
  title: string;
  description: string;
  highlights: string[];
  image: string;
  imageAlt: string;
  tone: "light" | "dark";
};

export function FeatureBannerSlider({ slides }: { slides: FeatureBannerSlide[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const slide = slides[activeIndex];
  const activeTone = slide?.tone ?? "light";

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % slides.length);
    }, 5000);

    return () => window.clearInterval(interval);
  }, [slides.length]);

  if (!slide) {
    return null;
  }

  return (
    <div className="relative isolate overflow-hidden rounded-[22px] sm:rounded-[28px] md:rounded-[36px] lg:rounded-[44px]">
      <div key={activeIndex} className="motion-safe:animate-[featureBannerFade_380ms_ease-out_both]">
        <div
          className={`relative grid min-h-[380px] grid-cols-1 items-start gap-5 px-4 pb-[3.25rem] pt-5 sm:min-h-[420px] sm:gap-6 sm:px-5 sm:pb-14 md:min-h-[500px] md:gap-8 md:px-11 md:py-10 md:pb-[4.5rem] lg:min-h-[540px] lg:grid-cols-[1.04fr_0.96fr] lg:items-center lg:px-14 lg:pb-12 ${
            slide.tone === "light" ? "text-stone-900" : "text-[#1e3355]"
          }`}
        >
          <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden rounded-[inherit]">
            {slide.tone === "light" ? (
              <>
                <div className="absolute -left-[28%] top-[-18%] h-[95%] w-[62%] rounded-full bg-[radial-gradient(circle_at_center,rgba(224,196,152,0.38)_0%,rgba(250,242,228,0.12)_42%,transparent_72%)] blur-2xl" />
                <div className="absolute -right-[22%] bottom-[-28%] h-[88%] w-[58%] rounded-full bg-[radial-gradient(circle_at_center,rgba(255,253,248,0.85)_0%,rgba(252,247,238,0.2)_45%,transparent_70%)] blur-3xl" />
                <div className="absolute left-[38%] top-1/2 h-[45%] w-[40%] -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(184,145,86,0.08)_0%,transparent_65%)] blur-3xl" />
              </>
            ) : (
              <>
                <div className="absolute inset-0 bg-[linear-gradient(135deg,#eef4fb_0%,#dfeaf7_38%,#d2e2f3_72%,#c8daf0_100%)]" />
                <div className="absolute -right-[14%] top-[4%] h-[70%] w-[48%] rounded-full bg-[radial-gradient(circle_at_center,rgba(120,160,220,0.22)_0%,transparent_70%)] blur-3xl" />
                <div className="absolute inset-y-0 left-0 w-full max-w-[min(100%,640px)] bg-[linear-gradient(90deg,rgba(248,251,255,0.95)_0%,rgba(232,241,252,0.55)_55%,transparent_100%)] lg:w-[58%]" />
              </>
            )}
          </div>
          <div
            className={`relative z-10 order-1 text-center lg:order-none lg:max-w-[min(640px,92vw)] lg:text-left ${
              slide.tone === "dark"
                ? "rounded-[22px] border border-[#9eb6d4]/50 bg-white/[0.96] p-6 shadow-[0_16px_44px_rgba(70,100,150,0.12)] md:rounded-[26px] md:p-8"
                : "max-lg:rounded-[20px] max-lg:border max-lg:border-[rgba(184,145,86,0.22)] max-lg:bg-white/[0.96] max-lg:p-5 max-lg:shadow-[0_12px_32px_rgba(89,63,28,0.08)] lg:border-transparent lg:bg-transparent lg:p-0 lg:shadow-none"
            }`}
          >
            <div className="lg:-translate-y-4">
              <p
                className={`font-medium tracking-[0.2em] md:tracking-[0.24em] ${
                  slide.tone === "light"
                    ? "text-[11px] uppercase text-[#8b673f] md:text-[12px]"
                    : "text-[12px] text-[#3d5a80] md:text-[13px]"
                }`}
              >
                {slide.label}
              </p>
              <h2
                className={`headline-balance mt-2.5 text-[22px] font-semibold leading-[1.15] tracking-[-0.04em] text-balance md:mt-3 md:text-[32px] lg:mt-4 lg:text-[36px] ${
                  slide.tone === "light" ? "text-stone-900" : "text-[#1a2f4a]"
                }`}
              >
                {slide.title}
              </h2>
            </div>
            <p
              className={`copy-pretty mt-5 text-[15px] leading-[1.85] md:mt-6 md:text-[17px] ${
                slide.tone === "light" ? "text-stone-600" : "text-[#3d4f66]"
              }`}
            >
              {slide.description}
            </p>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-2 md:mt-8 md:gap-2.5 lg:justify-start">
              {slide.highlights.map((highlight) => (
                <div
                  key={highlight}
                  className={`inline-flex items-center gap-2.5 rounded-full border font-semibold md:gap-3 ${
                    slide.tone === "light"
                      ? "border-[rgba(184,145,86,0.26)] bg-white px-5 py-3 text-[13px] tracking-[0.06em] text-[#5c4228] shadow-[0_8px_22px_rgba(89,63,28,0.06)] md:px-6 md:py-3.5"
                      : "border-[#a3bddc]/55 bg-white px-5 py-3 text-[13px] tracking-[0.05em] text-[#243652] shadow-[0_8px_22px_rgba(65,105,160,0.08)] md:px-6 md:py-3.5 md:text-[14px]"
                  }`}
                >
                  <span
                    className={`h-2.5 w-2.5 shrink-0 rounded-full md:h-3 md:w-3 ${
                      slide.tone === "light" ? "bg-[#b89156]" : "bg-[#5a7fb8]"
                    }`}
                  />
                  <span>{highlight}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="relative z-[1] order-2 flex min-h-[160px] w-full max-w-full items-end justify-center self-stretch sm:min-h-[220px] md:min-h-[360px] lg:order-none lg:min-h-[440px]">
            {slide.tone === "dark" ? (
              <div
                className="pointer-events-none absolute inset-x-0 bottom-0 top-[8%] z-[1] bg-[linear-gradient(90deg,rgba(232,241,252,0.75)_0%,transparent_50%)] md:top-[6%]"
                aria-hidden
              />
            ) : null}
            <Image
              src={slide.image}
              alt={slide.imageAlt}
              width={1400}
              height={1800}
              className={`relative z-[2] h-auto max-h-[38vh] w-auto max-w-full object-contain object-bottom sm:max-h-[42vh] sm:min-h-[200px] md:max-h-none md:h-[420px] md:min-h-0 lg:h-[520px] xl:h-[560px] ${
                slide.tone === "dark" ? "drop-shadow-[0_16px_36px_rgba(70,100,140,0.18)]" : ""
              }`}
              sizes="(max-width: 768px) 92vw, (max-width: 1024px) 70vw, 55vw"
              priority={activeIndex === 0}
            />
          </div>
        </div>
      </div>

      <div
        className={`pointer-events-none absolute inset-x-0 bottom-0 z-20 flex justify-center pb-3 pt-8 md:pb-4 md:pt-10 ${
          activeTone === "dark"
            ? "bg-[linear-gradient(180deg,transparent_0%,rgba(236,242,252,0.88)_40%,rgba(220,232,246,0.97)_100%)]"
            : "bg-[linear-gradient(180deg,transparent_0%,rgba(252,250,247,0.92)_35%,rgba(248,242,234,0.98)_100%)]"
        }`}
      >
        <div className="pointer-events-auto flex gap-2 px-2">
          {slides.map((item, index) => (
            <button
              key={item.title}
              type="button"
              aria-label={`${item.title} 슬라이드 보기`}
              onClick={() => setActiveIndex(index)}
              className={`h-2.5 rounded-full transition-all ${
                index === activeIndex
                  ? activeTone === "dark"
                    ? "w-8 bg-[#4a6fa5] shadow-[0_4px_14px_rgba(74,111,165,0.35)]"
                    : "w-8 bg-stone-900/85 shadow-[0_4px_12px_rgba(0,0,0,0.12)]"
                  : activeTone === "dark"
                    ? "w-2.5 bg-[#8fa8c4]/55"
                    : "w-2.5 bg-stone-400/60"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
