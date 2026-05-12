import Link from "next/link";

import { SiteLogo } from "@/components/site-logo";

const footerGoldLabel =
  "bg-[linear-gradient(92deg,#f5ead4_0%,#e8cf8f_38%,#d4af37_62%,#b8893a_100%)] bg-clip-text font-semibold text-transparent";

export function SiteFooter() {
  return (
    <footer className="bg-[#1A1A1A] px-4 py-5 text-white md:px-8 md:py-12">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-5 border-b border-white/10 pb-5 md:grid-cols-[minmax(0,1.2fr)_minmax(280px,0.8fr)] md:items-start md:gap-10 md:pb-8">
          <div className="space-y-3 md:space-y-5">
            <SiteLogo dark footer />
            <div className="max-w-md space-y-1 text-[11px] leading-snug text-white/55 [word-break:keep-all] md:space-y-1.5 md:text-[13px] md:leading-[1.75] md:text-white/60">
              <p>상호: 케어이즈 | 대표: 이명규</p>
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                <span>사업자: 215-86-78967</span>
                <a
                  href="https://teht.hometax.go.kr/websquare/websquare.wq?w2xPath=/ui/ca/a/b/UTECAABA12.xml"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex shrink-0 items-center rounded border border-white/18 px-2 py-0.5 text-[10px] font-medium text-white/75 transition hover:border-white/35 hover:text-white md:rounded-full md:px-3 md:py-1 md:text-[11px]"
                >
                  번호확인
                </a>
              </div>
              <p>통신판매업: 제2012-서울강남-01016호</p>
              <p className="md:hidden">서울 강남구 테헤란로43길 14 청수빌딩 13층</p>
              <p className="hidden md:block">소재지: 서울특별시 강남구 테헤란로43길 14, 13층(역삼동, 청수빌딩 13층)</p>
              <p>개인정보 책임자: 정재문</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-x-4 gap-y-0 sm:gap-x-6 md:grid-cols-2 md:gap-x-8 md:self-end md:justify-self-end lg:gap-x-10">
            <div className="space-y-2 text-left md:space-y-4">
              <p
                className={`text-[10px] uppercase tracking-[0.14em] md:text-[12px] md:tracking-[0.16em] ${footerGoldLabel}`}
              >
                Contact
              </p>
              <div className="space-y-1.5 text-[12px] text-white/60 md:space-y-3 md:text-[13px]">
                <a href="tel:01025563263" className="block transition hover:text-white">
                  010-2556-3263
                </a>
                <a
                  href="mailto:startupscon@gmail.com"
                  className="block break-all transition hover:text-white md:break-normal"
                >
                  startupscon@gmail.com
                </a>
                <a
                  href="https://www.instagram.com/sunlumi_labs/"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 transition hover:text-white md:gap-2"
                >
                  <InstagramIcon />
                  <span className="text-[11px] md:text-[13px]">@sunlumi_labs</span>
                </a>
              </div>
            </div>

            <div className="space-y-2 text-left md:space-y-4">
              <p
                className={`text-[10px] uppercase tracking-[0.14em] md:text-[12px] md:tracking-[0.16em] ${footerGoldLabel}`}
              >
                Support
              </p>
              <div className="space-y-1.5 text-[12px] text-white/60 md:space-y-3 md:text-[13px]">
                <Link href="/order" className="block transition hover:text-white">
                  레퍼럴 구매
                </Link>
                <Link href="/policy/terms" className="block transition hover:text-white">
                  이용약관
                </Link>
                <Link href="/policy/privacy" className="block transition hover:text-white">
                  개인정보처리방침
                </Link>
                <Link href="/policy" className="block transition hover:text-white">
                  정책안내
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2 pt-4 text-[10px] text-white/40 md:flex-row md:items-center md:justify-between md:gap-3 md:pt-6 md:text-[11px]">
          <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
            <span>© 2026 CAREIS</span>
            <span className="hidden text-white/35 md:inline" aria-hidden>
              ·
            </span>
            <span className="hidden md:inline">All rights reserved.</span>
          </div>
          <div className="hidden text-[11px] text-white/35 md:block">Day To Night Premium Dermacosmetic</div>
          <div className="flex flex-wrap gap-x-2.5 gap-y-1 md:gap-4">
            <Link href="/policy/shipping" className="transition hover:text-white">
              배송·교환
            </Link>
            <Link href="/products/sun-pack" className="transition hover:text-white">
              선팩
            </Link>
            <Link href="/products/illuminator" className="transition hover:text-white">
              일루미네이터
            </Link>
            <Link href="/admin/login" className="text-white/50 transition hover:text-white md:text-white/40">
              관리자
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function InstagramIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="md:h-[15px] md:w-[15px]">
      <rect x="3.5" y="3.5" width="17" height="17" rx="4.5" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="17.3" cy="6.7" r="1.1" fill="currentColor" />
    </svg>
  );
}
