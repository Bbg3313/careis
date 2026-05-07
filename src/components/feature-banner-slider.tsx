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
                    <div className="absolute -left-[32%] top-[8%] h-[92%] w-[58%] rounded-full bg-[radial-gradient(circle_at_center,rgba(49,65,120,0.42)_0%,rgba(30,41,78,0.14)_38%,transparent_72%)] blur-3xl" />
                    <div className="absolute -right-[26%] bottom-[-12%] h-[85%] w-[56%] rounded-full bg-[radial-gradient(circle_at_center,rgba(28,38,72,0.38)_0%,rgba(15,23,42,0.1)_40%,transparent_74%)] blur-3xl" />
                    <div className="absolute left-[45%] top-[-10%] h-[55%] w-[48%] rounded-full bg-[radial-gradient(circle,rgba(147,172,232,0.18)_0%,transparent_68%)] blur-3xl" />
                  </>
                )}
              </div>
              <div className="relative z-10 text-center lg:max-w-[640px] lg:text-left">
                <div className="lg:-translate-y-6">
                  <p
                    className={`text-[11px] uppercase tracking-[0.24em] ${
                      slide.tone === "light"
                        ? "text-[#8b673f]"
                        : "text-[#d4defc] [text-shadow:0_1px_18px_rgba(15,23,42,0.55)]"
                    }`}
                  >
                    {slide.label}
                  </p>
                  <h2
                    className={`headline-balance mt-3 text-[23px] font-semibold leading-[1.16] tracking-[-0.04em] md:text-[32px] lg:mt-4 lg:text-[36px] lg:whitespace-nowrap ${
                      slide.tone === "light"
                        ? "text-stone-900"
                        : "text-white [text-shadow:0_2px_28px_rgba(15,23,42,0.62)]"
                    }`}
                  >
                    {slide.title}
                  </h2>
                </div>
                <p
                  className={`copy-pretty mt-6 text-[15px] leading-[1.9] md:text-[17px] ${
                    slide.tone === "light"
                      ? "text-stone-600"
                      : "text-white/78 [text-shadow:0_1px_16px_rgba(15,23,42,0.5)]"
                  }`}
                >
                  {slide.description}
                </p>

                <div className="mt-7 flex flex-wrap items-center justify-center gap-2.5 md:mt-8 md:gap-3 lg:justify-start">
                  {slide.highlights.map((highlight) => (
                    <div
                      key={highlight}
                      className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-[10px] font-medium tracking-[0.12em] md:px-4 md:text-[11px] md:tracking-[0.14em] ${
                        slide.tone === "light"
                          ? "border-[rgba(184,145,86,0.16)] bg-white/80 text-[#8b673f] shadow-[0_10px_24px_rgba(89,63,28,0.06)] backdrop-blur-sm"
                          : "border-white/14 bg-white/10 text-[#eef2ff] shadow-[0_12px_32px_rgba(15,23,42,0.2)] backdrop-blur-md"
                      }`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          slide.tone === "light" ? "bg-[#b89156]" : "bg-[#b7c8ff]"
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
