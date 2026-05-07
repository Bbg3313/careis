"use client";

import { useEffect, useRef } from "react";

import type { SunPackStorySlide } from "@/lib/site-assets";

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
  const ext = slide.src.split(".").pop()?.toLowerCase() ?? "";

  if (ext === "mp4" || ext === "webm") {
    const mime = ext === "webm" ? "video/webm" : "video/mp4";
    return <AutoPlayVideo src={slide.src} mime={mime} />;
  }

  const isGif = ext === "gif";

  return (
    // GIF는 레이아웃·애니메이션 안정성을 위해 next/image 미사용 (정적 최적화 시 프레임 고정 방지)
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={slide.src}
      alt={`선팩 상세 ${index + 1}`}
      width={slide.width}
      height={slide.height}
      className="block h-auto w-full max-w-full"
      loading={isGif || index === 0 ? "eager" : "lazy"}
      decoding={isGif ? "sync" : "async"}
      fetchPriority={index === 0 ? "high" : undefined}
    />
  );
}
