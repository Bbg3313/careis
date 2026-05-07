"use client";

import Image from "next/image";
import { useRef, useState } from "react";

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
      style={{ maxWidth: SUN_PACK_DETAIL_MAX_WIDTH_PX }}
    >
      <div className="overflow-hidden rounded-[20px] border border-stone-200 bg-white">
        <Image
          src={mainSrc}
          alt={alt}
          width={pixelSize.width}
          height={pixelSize.height}
          className="block h-auto w-full max-w-full"
          sizes={`(max-width: ${SUN_PACK_DETAIL_MAX_WIDTH_PX}px) 100vw, ${SUN_PACK_DETAIL_MAX_WIDTH_PX}px`}
          priority
          unoptimized
        />
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
                selected
                  ? "border-[#b89156] ring-2 ring-[#b89156]/40"
                  : "border-stone-200 hover:border-stone-300"
              }`}
              aria-label={`${productName} 썸네일 ${index + 1}번 보기`}
              aria-pressed={selected}
            >
              <Image
                src={src}
                alt={`${productName} 썸네일 ${index + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 15vw, 140px"
                unoptimized
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}
