"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import type { SunPackStorySlide } from "@/lib/site-assets";

function mediaExtension(src: string) {
  return src.split("?")[0].split(".").pop()?.toLowerCase() ?? "";
}

function AutoPlayVideo({ src, mime }: { src: string; mime: string }) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const kick = () => {
      node.muted = true;
      node.defaultMuted = true;
      node.playsInline = true;
      node.play().catch(() => {});
    };

    kick();
    node.addEventListener("loadeddata", kick);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) kick();
          else node.pause();
        });
      },
      { threshold: 0.25 },
    );
    observer.observe(node);

    return () => {
      node.removeEventListener("loadeddata", kick);
      observer.disconnect();
    };
  }, [src]);

  return (
    <video
      ref={ref}
      className="block h-auto w-full bg-black object-contain"
      autoPlay
      loop
      muted
      playsInline
      preload="auto"
      controls={false}
      disablePictureInPicture
    >
      <source src={src} type={mime} />
    </video>
  );
}

function StoryGifSlide({
  slide,
  index,
  imageAltBase,
}: {
  slide: SunPackStorySlide;
  index: number;
  imageAltBase: string;
}) {
  const [gifBroken, setGifBroken] = useState(false);
  const poster = slide.posterSrc;
  const eager = index < 2;
  const loading = eager ? "eager" : "lazy";
  const alt = `${imageAltBase} ${index + 1}`;

  if (!poster) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={slide.src}
        alt={alt}
        width={slide.width}
        height={slide.height}
        className="block h-auto w-full max-w-full select-none"
        loading={loading}
        decoding="async"
        fetchPriority={index <= 4 ? "high" : "auto"}
        draggable={false}
      />
    );
  }

  return (
    <div className="relative w-full isolate [transform:translateZ(0)]">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={poster}
        alt=""
        width={slide.width}
        height={slide.height}
        className="block h-auto w-full max-w-full select-none"
        loading={loading}
        draggable={false}
        aria-hidden
      />
      {!gifBroken ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={slide.src}
          alt={alt}
          width={slide.width}
          height={slide.height}
          className="pointer-events-none absolute inset-0 block h-full w-full object-contain select-none"
          loading={loading}
          decoding="async"
          fetchPriority={index <= 4 ? "high" : "auto"}
          draggable={false}
          onError={() => setGifBroken(true)}
        />
      ) : null}
    </div>
  );
}

export function SunPackStorySlide({
  slide,
  index,
  imageAltBase = "선팩 상세",
}: {
  slide: SunPackStorySlide;
  index: number;
  /** 접근성 alt 접두 (예: 일루미 관리자 추가 슬라이드) */
  imageAltBase?: string;
}) {
  const ext = mediaExtension(slide.src);
  const alt = `${imageAltBase} ${index + 1}`;

  if (ext === "mp4" || ext === "webm") {
    const mime = ext === "webm" ? "video/webm" : "video/mp4";
    return <AutoPlayVideo src={slide.src} mime={mime} />;
  }

  const isGif = ext === "gif";

  if (isGif) {
    return <StoryGifSlide slide={slide} index={index} imageAltBase={imageAltBase} />;
  }

  return (
    <Image
      src={slide.src}
      alt={alt}
      width={slide.width}
      height={slide.height}
      className="block h-auto w-full max-w-full"
      sizes="(max-width: 640px) 100vw, (max-width: 1280px) min(960px, 94vw), min(960px, 1200px)"
      quality={100}
      unoptimized
      loading={index < 2 ? "eager" : "lazy"}
      priority={index < 2}
    />
  );
}
