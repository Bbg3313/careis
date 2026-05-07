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
}: MotionMediaProps) {
  return (
    <div className={className}>
      {frames.map((frame, index) => (
        <div
          key={`${alt}-${index}`}
          className="motion-frame"
          style={{ animationDelay: `${index * 3.5}s` }}
        >
          <Image
            src={frame}
            alt={`${alt} ${index + 1}`}
            fill
            className="object-cover object-center"
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
