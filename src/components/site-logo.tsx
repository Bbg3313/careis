import Image from "next/image";
import Link from "next/link";

type SiteLogoProps = {
  dark?: boolean;
  compact?: boolean;
  footer?: boolean;
  href?: string;
};

export function SiteLogo({ dark = false, compact = false, footer = false, href = "/" }: SiteLogoProps) {
  const width = compact ? 132 : footer ? 152 : 232;
  const height = compact ? 44 : footer ? 52 : 78;
  const sizeClass = compact
    ? "h-auto w-[108px] md:w-[132px]"
    : footer
      ? "h-auto w-[124px] md:w-[152px]"
      : "h-auto w-[188px] md:w-[232px]";

  return (
    <Link href={href} className="inline-flex items-center">
      <Image
        src={dark ? "/branding/sunlumi-logo-white-transparent.png" : "/branding/sunlumi-logo-transparent.png"}
        alt="SUNLUMI logo"
        width={width}
        height={height}
        className={sizeClass}
        priority
      />
    </Link>
  );
}
