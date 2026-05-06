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
    <div className="relative overflow-hidden rounded-[36px]">
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
              className={`grid min-h-[460px] items-center gap-6 px-6 py-8 md:min-h-[560px] md:px-10 md:py-10 lg:grid-cols-[0.78fr_1.22fr] lg:px-12 ${
                slide.tone === "light"
                  ? "bg-[linear-gradient(180deg,#fbf7f1_0%,#f6efe6_100%)] text-stone-900"
                  : "bg-[linear-gradient(180deg,#1d2230_0%,#252b3d_100%)] text-white"
              }`}
            >
              <div className="relative z-10 max-w-xl text-center lg:text-left">
                <p
                  className={`text-[11px] uppercase tracking-[0.24em] ${
                    slide.tone === "light" ? "text-stone-500" : "text-white/55"
                  }`}
                >
                  {slide.label}
                </p>
                <h2 className="headline-balance whitespace-pre-line mt-6 text-4xl font-semibold leading-[1.14] tracking-[-0.03em] md:text-6xl">
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

              <div className="relative min-h-[300px] md:min-h-[420px] lg:min-h-[540px]">
                <Image
                  src={slide.image}
                  alt={slide.imageAlt}
                  fill
                  className="object-contain object-center"
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
