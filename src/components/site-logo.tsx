import Image from "next/image";
import Link from "next/link";

type SiteLogoProps = {
  dark?: boolean;
  compact?: boolean;
  href?: string;
};

export function SiteLogo({ dark = false, compact = false, href = "/" }: SiteLogoProps) {
  return (
    <Link href={href} className="inline-flex items-center">
      <Image
        src={dark ? "/branding/sunlumi-logo-white-transparent.png" : "/branding/sunlumi-logo-transparent.png"}
        alt="SUNLUMI logo"
        width={compact ? 132 : 232}
        height={compact ? 44 : 78}
        className={compact ? "h-auto w-[108px] md:w-[132px]" : "h-auto w-[188px] md:w-[232px]"}
        priority
      />
    </Link>
  );
}
