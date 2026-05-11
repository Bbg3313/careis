"use client";

import Image from "next/image";
import { useRef, useState } from "react";

import { SUN_PACK_DETAIL_MAX_WIDTH_PX } from "@/lib/site-assets";

function isGifPath(src: string) {
  return src.split("?")[0].toLowerCase().endsWith(".gif");
}

type SunPackDetailGalleryProps = {
  defaultMainSrc: string;
  thumbnailSrcs: string[];
  alt: string;
  pixelSize: { width: number; height: number };
  productName: string;
  /** 기본 960. 일루미네이터 등 다른 상세 폭에 맞출 때 사용 */
  maxWidthPx?: number;
  /** 썸네일 선택 링 색 — cool 은 슬레이트 톤 */
  accent?: "warm" | "cool";
};

const THUMB_SIZES = `(max-width: 640px) 28vw, (max-width: 1024px) 160px, 220px`;

export function SunPackDetailGallery({
  defaultMainSrc,
  thumbnailSrcs,
  alt,
  pixelSize,
  productName,
  maxWidthPx = SUN_PACK_DETAIL_MAX_WIDTH_PX,
  accent = "warm",
}: SunPackDetailGalleryProps) {
  const MAIN_SIZES = `(max-width: 768px) 100vw, (max-width: 1280px) min(${maxWidthPx}px, 90vw), min(${maxWidthPx}px, 1200px)`;
  const thumbRing =
    accent === "cool"
      ? "border-slate-600 ring-2 ring-slate-500/45"
      : "border-[#b89156] ring-2 ring-[#b89156]/40";
  const thumbRingIdle =
    accent === "cool" ? "border-slate-200 hover:border-slate-300" : "border-stone-200 hover:border-stone-300";
  const [mainSrc, setMainSrc] = useState(defaultMainSrc);
  const thumbBtnRefs = useRef<(HTMLButtonElement | null)[]>([]);

  function selectThumb(src: string, index: number) {
    setMainSrc(src);
    thumbBtnRefs.current[index]?.scrollIntoView({
      behavior: "smooth",
      inline: "nearest",
      block: "nearest",
    });
  }

  return (
    <div
      className="w-full space-y-4"
      style={{ maxWidth: maxWidthPx }}
    >
      <div className="overflow-hidden rounded-[20px] border border-stone-200 bg-white">
        {isGifPath(mainSrc) ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={mainSrc}
            alt={alt}
            width={pixelSize.width}
            height={pixelSize.height}
            className="block h-auto w-full max-w-full"
            loading="eager"
            decoding="async"
            fetchPriority="high"
          />
        ) : (
          <Image
            src={mainSrc}
            alt={alt}
            width={pixelSize.width}
            height={pixelSize.height}
            className="block h-auto w-full max-w-full"
            sizes={MAIN_SIZES}
            quality={100}
            unoptimized
            priority
          />
        )}
      </div>

      <div className="flex w-full gap-1.5 sm:gap-2">
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
              className={`relative aspect-[2/3] min-h-0 min-w-0 flex-1 basis-0 overflow-hidden rounded-[8px] border bg-white text-left shadow-sm transition ${
                selected ? thumbRing : thumbRingIdle
              }`}
              aria-label={`${productName} 썸네일 ${index + 1}번 보기`}
              aria-pressed={selected}
            >
              {isGifPath(src) ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={src}
                  alt={`${productName} 썸네일 ${index + 1}`}
                  className="absolute inset-0 h-full w-full object-cover"
                  loading="eager"
                  decoding="async"
                />
              ) : (
                <Image
                  src={src}
                  alt={`${productName} 썸네일 ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes={THUMB_SIZES}
                  quality={100}
                  unoptimized
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
