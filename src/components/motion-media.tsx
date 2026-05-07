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
            className="object-contain md:object-cover"
            sizes="100vw"
            priority={priority && index === 0}
          />
        </div>
      ))}
      <div className={overlayClassName} />
    </div>
  );
}
