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

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % slides.length);
    }, 5000);

    return () => window.clearInterval(interval);
  }, [slides.length]);

  return (
    <div className="relative overflow-hidden rounded-[40px] border border-[rgba(184,145,86,0.14)] bg-[linear-gradient(180deg,rgba(255,253,249,0.92)_0%,rgba(247,239,228,0.96)_100%)] shadow-[0_28px_80px_rgba(89,63,28,0.08)]">
      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-px bg-[linear-gradient(90deg,transparent_0%,rgba(184,145,86,0.46)_50%,transparent_100%)]" />
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
              className={`relative grid min-h-[460px] items-center gap-6 overflow-hidden px-6 py-8 md:min-h-[560px] md:px-10 md:py-10 lg:grid-cols-[0.72fr_1.28fr] lg:px-12 ${
                slide.tone === "light"
                  ? "bg-[radial-gradient(circle_at_20%_18%,rgba(211,180,132,0.18)_0%,rgba(255,255,255,0)_28%),linear-gradient(135deg,#fffdf9_0%,#f8f0e5_52%,#f3e8d8_100%)] text-stone-900"
                  : "bg-[radial-gradient(circle_at_18%_18%,rgba(212,184,140,0.18)_0%,rgba(29,34,48,0)_30%),radial-gradient(circle_at_82%_24%,rgba(143,164,191,0.16)_0%,rgba(37,43,61,0)_28%),linear-gradient(135deg,#1a1f2e_0%,#252b3d_58%,#2d3347_100%)] text-white"
              }`}
            >
              <div className="pointer-events-none absolute inset-0">
                <div
                  className={`absolute inset-y-8 left-6 w-[42%] rounded-[28px] blur-3xl ${
                    slide.tone === "light" ? "bg-[#e6cda5]/14" : "bg-[#b98b54]/10"
                  }`}
                />
                <div
                  className={`absolute right-[-6%] top-1/2 h-[72%] w-[40%] -translate-y-1/2 rounded-full blur-3xl ${
                    slide.tone === "light" ? "bg-white/26" : "bg-[#aabed8]/10"
                  }`}
                />
                <div
                  className={`absolute inset-0 ${
                    slide.tone === "light"
                      ? "bg-[linear-gradient(180deg,rgba(255,255,255,0.18)_0%,rgba(255,255,255,0)_24%,rgba(170,132,84,0.04)_100%)]"
                      : "bg-[linear-gradient(180deg,rgba(255,255,255,0.08)_0%,rgba(255,255,255,0)_28%,rgba(0,0,0,0.12)_100%)]"
                  }`}
                />
              </div>
              <div className="relative z-10 max-w-xl text-center lg:text-left">
                <p
                  className={`text-[11px] uppercase tracking-[0.24em] ${
                    slide.tone === "light" ? "text-stone-500" : "text-white/55"
                  }`}
                >
                  {slide.label}
                </p>
                <h2 className="headline-balance whitespace-pre-line mt-6 text-3xl font-semibold leading-[1.18] tracking-[-0.03em] md:text-[48px] lg:text-[56px]">
                  {slide.title}
                </h2>
                <p
                  className={`copy-pretty mt-6 text-[15px] leading-[1.9] md:text-[17px] ${
                    slide.tone === "light" ? "text-stone-600" : "text-white/72"
                  }`}
                >
                  {slide.description}
                </p>

                <div
                  className={`mt-8 flex flex-wrap items-center justify-center gap-4 text-[12px] tracking-[0.08em] lg:justify-start ${
                    slide.tone === "light" ? "text-stone-500" : "text-white/58"
                  }`}
                >
                  {slide.highlights.map((highlight, highlightIndex) => (
                    <div key={highlight} className="inline-flex items-center gap-4">
                      {highlightIndex > 0 ? <span className="h-3 w-px bg-current/20" /> : null}
                      <span>{highlight}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative z-10 flex min-h-[340px] self-stretch items-end justify-center md:min-h-[480px] lg:min-h-[560px]">
                <Image
                  src={slide.image}
                  alt={slide.imageAlt}
                  width={1400}
                  height={1800}
                  className="h-[340px] w-auto object-contain object-center md:h-[480px] lg:h-[560px]"
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  priority={index === 0}
                />
              </div>
            </div>
          </div>
        );
      })}

      <div className="invisible min-h-[460px] md:min-h-[560px]" />

      <div className="absolute bottom-5 left-1/2 z-20 flex -translate-x-1/2 gap-2">
        {slides.map((slide, index) => (
          <button
            key={slide.title}
            type="button"
            aria-label={`${slide.title} 슬라이드 보기`}
            onClick={() => setActiveIndex(index)}
            className={`h-2.5 rounded-full transition-all ${
              index === activeIndex ? "w-8 bg-stone-900/85 shadow-[0_4px_12px_rgba(0,0,0,0.12)]" : "w-2.5 bg-stone-400/60"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
