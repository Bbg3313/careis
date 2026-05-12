"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

const SLIDES = [
  {
    src: "/images/home-hero-strip-sun.png",
    alt: "심플스틱 선팩 SIMPLE STICK SUN PACK 제품 이미지",
  },
  {
    src: "/images/home-hero-strip-night.png",
    alt: "심플스틱 일루미네이터 SIMPLE STICK 야간 케어 제품 이미지",
  },
] as const;

const IMG_W = 1024;
const IMG_H = 426;
const INTERVAL_MS = 4800;

export function HomeHeroStripBanner() {
  const [active, setActive] = useState(0);
  const len = SLIDES.length;

  const go = useCallback((index: number) => {
    setActive(((index % len) + len) % len);
  }, [len]);

  useEffect(() => {
    const id = window.setInterval(() => {
      setActive((c) => (c + 1) % len);
    }, INTERVAL_MS);
    return () => window.clearInterval(id);
  }, [len]);

  return (
    <section aria-label="제품 비주얼" className="w-full px-0 sm:px-2">
      <div className="mx-auto w-full max-w-7xl">
        <div className="relative overflow-hidden rounded-[22px] border border-black/[0.06] bg-stone-900 shadow-[0_18px_50px_rgba(0,0,0,0.12)] ring-1 ring-white/60 md:rounded-[28px]">
          <div
            className="relative w-full"
            style={{ aspectRatio: `${IMG_W} / ${IMG_H}` }}
          >
            {SLIDES.map((slide, index) => {
              const isOn = index === active;
              return (
                <div
                  key={slide.src}
                  className={`absolute inset-0 transition-opacity duration-700 ease-out ${
                    isOn ? "z-[1] opacity-100" : "z-0 opacity-0"
                  }`}
                  aria-hidden={!isOn}
                >
                  <Image
                    src={slide.src}
                    alt={slide.alt}
                    fill
                    className="object-cover object-center"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) min(100vw, 1280px), 1280px"
                    quality={100}
                    priority={index === 0}
                    draggable={false}
                  />
                </div>
              );
            })}
          </div>

          <div className="absolute bottom-3 left-0 right-0 z-[2] flex justify-center gap-2 md:bottom-4">
            {SLIDES.map((_, index) => (
              <button
                key={String(index)}
                type="button"
                onClick={() => go(index)}
                className={`h-2 w-2 rounded-full transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${
                  index === active ? "w-6 bg-white shadow-sm" : "bg-white/40 hover:bg-white/70"
                }`}
                aria-label={`배너 ${index + 1}번`}
                aria-current={index === active}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
