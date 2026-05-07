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
  const activeTone = slides[activeIndex]?.tone ?? "light";

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % slides.length);
    }, 5000);

    return () => window.clearInterval(interval);
  }, [slides.length]);

  return (
    <div className="relative overflow-hidden rounded-[36px] md:rounded-[44px]">
      {slides.map((slide, index) => {
        const isActive = index === activeIndex;

        return (
          <div
            key={slide.title}
            className={`absolute inset-0 transition-all duration-700 ${
              isActive ? "translate-x-0 opacity-100" : "pointer-events-none translate-x-4 opacity-0"
            }`}
          >
            <div
              className={`relative grid min-h-[520px] items-center gap-6 overflow-visible px-5 py-7 md:min-h-[560px] md:gap-8 md:px-11 md:py-11 lg:grid-cols-[1.04fr_0.96fr] lg:px-14 ${
                slide.tone === "light" ? "text-stone-900" : "text-white"
              }`}
            >
              <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]">
                {slide.tone === "light" ? (
                  <>
                    <div className="absolute -left-[28%] top-[-18%] h-[95%] w-[62%] rounded-full bg-[radial-gradient(circle_at_center,rgba(224,196,152,0.38)_0%,rgba(250,242,228,0.12)_42%,transparent_72%)] blur-2xl" />
                    <div className="absolute -right-[22%] bottom-[-28%] h-[88%] w-[58%] rounded-full bg-[radial-gradient(circle_at_center,rgba(255,253,248,0.85)_0%,rgba(252,247,238,0.2)_45%,transparent_70%)] blur-3xl" />
                    <div className="absolute left-[38%] top-1/2 h-[45%] w-[40%] -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(184,145,86,0.08)_0%,transparent_65%)] blur-3xl" />
                  </>
                ) : (
                  <>
                    <div className="absolute inset-0 bg-[linear-gradient(105deg,#0b0f18_0%,#121a28_42%,rgba(18,26,40,0.82)_58%,rgba(32,38,52,0.35)_100%)]" />
                    <div className="absolute -right-[18%] top-[6%] h-[78%] w-[52%] rounded-full bg-[radial-gradient(circle_at_center,rgba(76,96,160,0.28)_0%,transparent_68%)] blur-3xl" />
                    <div className="absolute inset-y-0 left-0 w-[58%] bg-[linear-gradient(90deg,rgba(8,11,18,0.72)_0%,rgba(8,11,18,0.35)_55%,transparent_100%)]" />
                  </>
                )}
              </div>
              <div
                className={`relative z-10 text-center lg:max-w-[640px] lg:text-left ${
                  slide.tone === "dark"
                    ? "rounded-[26px] border border-white/12 bg-[rgba(10,14,22,0.55)] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.35)] backdrop-blur-md md:p-8"
                    : ""
                }`}
              >
                <div className="lg:-translate-y-6">
                  <p
                    className={`text-[11px] uppercase tracking-[0.24em] md:text-[12px] ${
                      slide.tone === "light"
                        ? "text-[#8b673f]"
                        : "text-[#c8d7ff]"
                    }`}
                  >
                    {slide.label}
                  </p>
                  <h2
                    className={`headline-balance mt-3 text-[23px] font-semibold leading-[1.16] tracking-[-0.04em] md:text-[32px] lg:mt-4 lg:text-[36px] lg:whitespace-nowrap ${
                      slide.tone === "light" ? "text-stone-900" : "text-white"
                    }`}
                  >
                    {slide.title}
                  </h2>
                </div>
                <p
                  className={`copy-pretty mt-6 text-[15px] leading-[1.9] md:text-[17px] ${
                    slide.tone === "light" ? "text-stone-600" : "text-white/92"
                  }`}
                >
                  {slide.description}
                </p>

                <div className="mt-7 flex flex-wrap items-center justify-center gap-3 md:mt-9 md:gap-3.5 lg:justify-start">
                  {slide.highlights.map((highlight) => (
                    <div
                      key={highlight}
                      className={`inline-flex items-center gap-2.5 rounded-full border font-semibold md:gap-3 ${
                        slide.tone === "light"
                          ? "border-[rgba(184,145,86,0.22)] bg-white/90 px-5 py-3 text-[12px] tracking-[0.08em] text-[#6b4f2f] shadow-[0_10px_28px_rgba(89,63,28,0.08)] backdrop-blur-sm md:px-6 md:py-3.5 md:text-[13px]"
                          : "border-white/25 bg-[rgba(18,24,38,0.85)] px-5 py-3 text-[12px] tracking-[0.09em] text-white shadow-[0_14px_36px_rgba(0,0,0,0.45)] backdrop-blur-sm md:px-7 md:py-4 md:text-[13px]"
                      }`}
                    >
                      <span
                        className={`h-2 w-2 shrink-0 rounded-full md:h-2.5 md:w-2.5 ${
                          slide.tone === "light" ? "bg-[#b89156]" : "bg-[#a8bcff]"
                        }`}
                      />
                      <span>{highlight}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative z-10 flex min-h-[260px] self-stretch items-end justify-center md:min-h-[480px] lg:min-h-[560px]">
                <Image
                  src={slide.image}
                  alt={slide.imageAlt}
                  width={1400}
                  height={1800}
                  className="h-[260px] w-auto max-w-full object-contain object-center sm:h-[320px] md:h-[480px] lg:h-[560px]"
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  priority={index === 0}
                />
              </div>
            </div>
          </div>
        );
      })}

      <div className="invisible min-h-[520px] md:min-h-[560px]" />

      <div className="absolute bottom-5 left-1/2 z-20 flex -translate-x-1/2 gap-2">
        {slides.map((slide, index) => (
          <button
            key={slide.title}
            type="button"
            aria-label={`${slide.title} 슬라이드 보기`}
            onClick={() => setActiveIndex(index)}
            className={`h-2.5 rounded-full transition-all ${
              index === activeIndex
                ? activeTone === "dark"
                  ? "w-8 bg-white/90 shadow-[0_4px_18px_rgba(15,23,42,0.35)]"
                  : "w-8 bg-stone-900/85 shadow-[0_4px_12px_rgba(0,0,0,0.12)]"
                : activeTone === "dark"
                  ? "w-2.5 bg-white/30"
                  : "w-2.5 bg-stone-400/60"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
