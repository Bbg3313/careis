"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

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

export function SunPackStorySlide({ slide, index }: { slide: SunPackStorySlide; index: number }) {
  const ext = mediaExtension(slide.src);

  if (ext === "mp4" || ext === "webm") {
    const mime = ext === "webm" ? "video/webm" : "video/mp4";
    return <AutoPlayVideo src={slide.src} mime={mime} />;
  }

  const isGif = ext === "gif";

  if (isGif) {
    return (
      // GIF는 next/image·최적화 파이프를 타지 않고 원본으로 로드 (애니메이션 유지)
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={slide.src}
        alt={`선팩 상세 ${index + 1}`}
        width={slide.width}
        height={slide.height}
        className="block h-auto w-full max-w-full"
        loading="eager"
        decoding="async"
        fetchPriority={index <= 4 ? "high" : "auto"}
      />
    );
  }

  return (
    <Image
      src={slide.src}
      alt={`선팩 상세 ${index + 1}`}
      width={slide.width}
      height={slide.height}
      className="block h-auto w-full max-w-full"
      sizes="(max-width: 640px) 100vw, (max-width: 1280px) min(960px, 94vw), min(960px, 1200px)"
      quality={92}
      loading={index < 2 ? "eager" : "lazy"}
      priority={index < 2}
    />
  );
}
