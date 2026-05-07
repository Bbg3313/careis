import Image from "next/image";

import type { SiteImageSource } from "@/lib/site-assets";

type MotionMediaProps = {
  frames: SiteImageSource[];
  alt: string;
  priority?: boolean;
  className?: string;
  overlayClassName?: string;
};

export function MotionMedia({
  frames,
  alt,
  priority = false,
  className,
  overlayClassName,
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
            sizes="(max-width: 767px) min(100vw, 440px), (max-width: 1024px) 50vw, 560px"
            priority={priority && index === 0}
          />
        </div>
      ))}
      <div className={overlayClassName} />
    </div>
  );
}
