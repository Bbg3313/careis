"use client";

import Image from "next/image";
import { useState } from "react";

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

  return (
    <div
      className="mx-auto w-full space-y-5"
      style={{ maxWidth: SUN_PACK_DETAIL_MAX_WIDTH_PX }}
    >
      <div className="overflow-hidden rounded-[20px] border border-stone-200 bg-white">
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
      </div>

      <div className="grid grid-cols-3 gap-3 sm:gap-4">
        {thumbnailSrcs.map((src, index) => {
          const selected = mainSrc === src;
          return (
            <button
              key={src}
              type="button"
              onClick={() => setMainSrc(src)}
              className={`relative overflow-hidden rounded-[16px] border bg-white text-left transition ${
                selected
                  ? "border-[#b89156] ring-2 ring-[#b89156]/35"
                  : "border-stone-200 hover:border-stone-300"
              }`}
              aria-label={`${productName} 썸네일 ${index + 1}번 보기`}
              aria-pressed={selected}
            >
              <Image
                src={src}
                alt={`${productName} 썸네일 ${index + 1}`}
                width={pixelSize.width}
                height={pixelSize.height}
                className="h-auto w-full object-contain"
                sizes="(max-width: 768px) 33vw, 200px"
                unoptimized
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}
