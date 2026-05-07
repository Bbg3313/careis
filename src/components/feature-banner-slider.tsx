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
    <div className="relative overflow-hidden rounded-[32px] border border-[rgba(184,145,86,0.18)] bg-[linear-gradient(145deg,rgba(255,254,251,0.98)_0%,rgba(248,239,227,0.98)_52%,rgba(243,232,214,0.96)_100%)] shadow-[0_24px_60px_rgba(89,63,28,0.1)] md:rounded-[48px] md:shadow-[0_34px_90px_rgba(89,63,28,0.1)]">
      <div className="pointer-events-none absolute inset-0 rounded-[32px] shadow-[inset_0_1px_0_rgba(255,255,255,0.72),inset_0_-1px_0_rgba(184,145,86,0.08)] md:rounded-[48px]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-px bg-[linear-gradient(90deg,transparent_0%,rgba(184,145,86,0.58)_50%,transparent_100%)]" />
      <div className="pointer-events-none absolute -left-12 top-10 h-40 w-40 rounded-full bg-[#d5b27e]/18 blur-3xl" />
      <div className="pointer-events-none absolute -right-10 bottom-8 h-44 w-44 rounded-full bg-[#f4e2c6]/44 blur-3xl" />
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
              className={`relative grid min-h-[520px] items-center gap-6 overflow-hidden px-5 py-7 md:min-h-[560px] md:gap-8 md:px-11 md:py-11 lg:grid-cols-[1.04fr_0.96fr] lg:px-14 ${
                slide.tone === "light"
                  ? "bg-[radial-gradient(circle_at_18%_18%,rgba(211,180,132,0.2)_0%,rgba(255,255,255,0)_30%),radial-gradient(circle_at_84%_22%,rgba(255,255,255,0.42)_0%,rgba(255,255,255,0)_32%),linear-gradient(135deg,#fffdf9_0%,#faf2e6_54%,#f1e6d4_100%)] text-stone-900"
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
              <div className="relative z-10 text-center lg:max-w-[640px] lg:text-left">
                <div className="lg:-translate-y-6">
                  <p
                    className={`text-[11px] uppercase tracking-[0.24em] ${
                      slide.tone === "light" ? "text-[#8b673f]" : "text-white/55"
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
                    slide.tone === "light" ? "text-stone-600" : "text-white/72"
                  }`}
                >
                  {slide.description}
                </p>

                <div className="mt-7 flex flex-wrap items-center justify-center gap-2.5 md:mt-8 md:gap-3 lg:justify-start">
                  {slide.highlights.map((highlight) => (
                    <div
                      key={highlight}
                      className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-[10px] font-medium tracking-[0.12em] shadow-[0_10px_24px_rgba(89,63,28,0.06)] md:px-4 md:text-[11px] md:tracking-[0.14em] ${
                        slide.tone === "light"
                          ? "border-[rgba(184,145,86,0.16)] bg-[linear-gradient(180deg,rgba(255,255,255,0.9)_0%,rgba(248,238,224,0.96)_100%)] text-[#8b673f]"
                          : "border-white/14 bg-white/8 text-white/78"
                      }`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          slide.tone === "light" ? "bg-[#b89156]" : "bg-[#d4b389]"
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
              index === activeIndex ? "w-8 bg-stone-900/85 shadow-[0_4px_12px_rgba(0,0,0,0.12)]" : "w-2.5 bg-stone-400/60"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
