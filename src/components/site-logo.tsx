import Link from "next/link";

type SiteLogoProps = {
  dark?: boolean;
  compact?: boolean;
  href?: string;
};

export function SiteLogo({ dark = false, compact = false, href = "/" }: SiteLogoProps) {
  const textColor = dark ? "text-white" : "text-stone-900";
  const subColor = dark ? "text-white/56" : "text-stone-500";
  const stroke = dark ? "#f8f5ef" : "#1f1d1a";
  const accent = dark ? "#d9c0a0" : "#8d6a46";

  return (
    <Link href={href} className="inline-flex items-center gap-3">
      <svg width="42" height="42" viewBox="0 0 42 42" fill="none" aria-hidden="true">
        <rect x="1.25" y="1.25" width="39.5" height="39.5" rx="14" stroke={stroke} strokeOpacity="0.16" />
        <path
          d="M13 24.8C13 18.36 17.96 13.4 24.4 13.4H28.2"
          stroke={stroke}
          strokeWidth="2.2"
          strokeLinecap="round"
        />
        <path
          d="M29.1 13.4C24.13 13.4 20.1 17.43 20.1 22.4C20.1 27.37 24.13 31.4 29.1 31.4"
          stroke={accent}
          strokeWidth="2.4"
          strokeLinecap="round"
        />
        <circle cx="29.1" cy="13.4" r="2.1" fill={accent} />
      </svg>

      <span className={compact ? "hidden sm:flex sm:flex-col" : "flex flex-col"}>
        <span className={`display-font text-3xl font-semibold tracking-[0.08em] ${textColor}`}>
          CAREIS
        </span>
        <span className={`text-[10px] uppercase tracking-[0.34em] ${subColor}`}>
          Clinical Dermacosmetic
        </span>
      </span>
    </Link>
  );
}
