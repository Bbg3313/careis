"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

import { SUN_PACK_DETAIL_MAX_WIDTH_PX } from "@/lib/site-assets";

type SunPackDetailGalleryProps = {
  defaultMainSrc: string;
  thumbnailSrcs: string[];
  alt: string;
  pixelSize: { width: number; height: number };
  productName: string;
};

export function SunPackDetailGallery({
  defaultMainSrc,
  thumbnailSrcs,
  alt,
  pixelSize,
  productName,
}: SunPackDetailGalleryProps) {
  const [mainSrc, setMainSrc] = useState(defaultMainSrc);
  const stripRef = useRef<HTMLDivElement>(null);
  const thumbBtnRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateScrollHints = useCallback(() => {
    const el = stripRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 2);
  }, []);

  useEffect(() => {
    updateScrollHints();
    const el = stripRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateScrollHints, { passive: true });
    const ro = new ResizeObserver(updateScrollHints);
    ro.observe(el);
    window.addEventListener("resize", updateScrollHints);
    return () => {
      el.removeEventListener("scroll", updateScrollHints);
      ro.disconnect();
      window.removeEventListener("resize", updateScrollHints);
    };
  }, [updateScrollHints, thumbnailSrcs.length]);

  function scrollStripNext() {
    const el = stripRef.current;
    if (!el) return;
    const step = Math.max(120, Math.round(el.clientWidth * 0.35));
    el.scrollBy({ left: step, behavior: "smooth" });
  }

  function selectThumb(src: string, index: number) {
    setMainSrc(src);
    thumbBtnRefs.current[index]?.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });
  }

  return (
    <div
      className="mx-auto w-full space-y-4"
      style={{ maxWidth: SUN_PACK_DETAIL_MAX_WIDTH_PX }}
    >
      <div className="overflow-hidden rounded-[20px] border border-stone-200 bg-white">
        {mainSrc.toLowerCase().endsWith(".gif") ? (
          // next/image는 GIF 애니메이션을 첫 프레임으로 고정하는 경우가 있어 네이티브 img 사용
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={mainSrc}
            alt={alt}
            width={pixelSize.width}
            height={pixelSize.height}
            className="block h-auto w-full max-w-full"
            decoding="async"
          />
        ) : (
          <Image
            src={mainSrc}
            alt={alt}
            width={pixelSize.width}
            height={pixelSize.height}
            className="block h-auto w-full"
            sizes={`(max-width: ${SUN_PACK_DETAIL_MAX_WIDTH_PX}px) 100vw, ${SUN_PACK_DETAIL_MAX_WIDTH_PX}px`}
            priority
            unoptimized
          />
        )}
      </div>

      <div className="relative">
        <div
          ref={stripRef}
          className="-mx-1 flex gap-1.5 overflow-x-auto scroll-smooth px-1 pb-1 pt-0.5 [scrollbar-width:none] snap-x snap-mandatory [&::-webkit-scrollbar]:hidden"
        >
          {thumbnailSrcs.map((src, index) => {
            const selected = mainSrc === src;
            return (
              <button
                key={`${src}-${index}`}
                ref={(node) => {
                  thumbBtnRefs.current[index] = node;
                }}
                type="button"
                onClick={() => selectThumb(src, index)}
                className={`relative aspect-[2/3] w-[calc((100%-1rem)/7)] min-w-[44px] max-w-[88px] shrink-0 snap-start overflow-hidden rounded-[8px] border bg-white text-left shadow-sm transition sm:max-w-[92px] md:min-w-[48px] md:max-w-[96px] ${
                  selected
                    ? "border-[#b89156] ring-2 ring-[#b89156]/40"
                    : "border-stone-200 hover:border-stone-300"
                }`}
                aria-label={`${productName} 썸네일 ${index + 1}번 보기`}
                aria-pressed={selected}
              >
                {src.toLowerCase().endsWith(".gif") ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={src}
                    alt={`${productName} 썸네일 ${index + 1}`}
                    className="absolute inset-0 h-full w-full object-cover"
                    loading="lazy"
                    decoding="async"
                  />
                ) : (
                  <Image
                    src={src}
                    alt={`${productName} 썸네일 ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="96px"
                    unoptimized
                  />
                )}
              </button>
            );
          })}
        </div>

        {canScrollRight ? (
          <>
            <div
              className="pointer-events-none absolute inset-y-0 right-12 z-[1] w-14 bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.9)_50%,#ffffff_100%)] md:right-14 md:w-16"
              aria-hidden
            />
            <button
              type="button"
              onClick={scrollStripNext}
              className="absolute right-1 top-1/2 z-[2] flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-stone-200 bg-white/95 text-stone-600 shadow-md transition hover:bg-white hover:text-stone-900 md:h-10 md:w-10"
              aria-label="다음 썸네일 보기"
            >
              <ChevronRightIcon />
            </button>
          </>
        ) : null}
      </div>
    </div>
  );
}

function ChevronRightIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M10 7l5 5-5 5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
