import Image from "next/image";

import type { SiteImageSource } from "@/lib/site-assets";

type MotionMediaProps = {
  frames: SiteImageSource[];
  alt: string;
  priority?: boolean;
  className?: string;
  overlayClassName?: string;
  /** next/image sizes — 고해상도 세로 히어로 등은 더 큰 값 권장 */
  frameSizes?: string;
  /** 기본 85. 히어로 정지컷 선명도 우선 시 92 등 */
  quality?: number;
  /** cover는 영역 채움(잘림), contain은 이미지 전체 표시 */
  objectFit?: "cover" | "contain";
};

const defaultFrameSizes =
  "(max-width: 767px) min(100vw, 440px), (max-width: 1024px) 50vw, 560px";

export function MotionMedia({
  frames,
  alt,
  priority = false,
  className,
  overlayClassName,
  frameSizes = defaultFrameSizes,
  quality = 85,
  objectFit = "cover",
}: MotionMediaProps) {
  const fitClass = objectFit === "contain" ? "object-contain object-center" : "object-cover object-center";
  /** 2장일 때 히어로용 stagger(3.5s)×6장 전제 주기와 맞지 않아 둘 다 opacity 0인 구간이 생김 → 전용 페어 크로스페이드 */
  const pairCrossfade = frames.length === 2;

  return (
    <div className={className}>
      {frames.map((frame, index) => (
        <div
          key={`${alt}-${index}`}
          className={pairCrossfade ? "motion-frame motion-frame--pair" : "motion-frame"}
          style={pairCrossfade ? undefined : { animationDelay: `${index * 3.5}s` }}
        >
          <Image
            src={frame}
            alt={`${alt} ${index + 1}`}
            fill
            className={fitClass}
            sizes={frameSizes}
            quality={quality}
            priority={priority && index === 0}
          />
        </div>
      ))}
      <div className={overlayClassName} />
    </div>
  );
}
