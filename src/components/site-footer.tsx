import Link from "next/link";

import { SiteLogo } from "@/components/site-logo";

export function SiteFooter() {
  return (
    <footer className="bg-[#1A1A1A] px-6 py-10 text-white md:px-8 md:py-12">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 border-b border-white/10 pb-8 md:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)] md:items-start md:gap-12">
          <div className="space-y-5">
            <SiteLogo dark footer />
            <div className="max-w-md space-y-1.5 text-[13px] leading-[1.75] text-white/60">
              <p>상호: 케어이즈 | 대표자: 이명규</p>
              <p>사업자번호: 215-86-78967</p>
              <p>통신판매업: 제2012-서울강남-01016호</p>
              <p>소재지: 서울특별시 강남구 테헤란로43길 14, 13층(역삼동, 청수빌딩 13층)</p>
            </div>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 md:self-end md:justify-self-end md:gap-10">
            <div className="space-y-4 text-left">
              <p className="text-[12px] uppercase tracking-[0.15em] text-white/40">Contact</p>
              <div className="space-y-3 text-[13px] text-white/60">
                <a href="tel:07046473263" className="block transition hover:text-white">
                  070-4647-3263
                </a>
                <a
                  href="mailto:startupscon@gmail.com"
                  className="block transition hover:text-white"
                >
                  startupscon@gmail.com
                </a>
                <a
                  href="https://www.instagram.com/sunlumi_labs/"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 transition hover:text-white"
                >
                  <InstagramIcon />
                  <span>@sunlumi_labs</span>
                </a>
              </div>
            </div>

            <div className="space-y-4 text-left">
              <p className="text-[12px] uppercase tracking-[0.15em] text-white/40">Support</p>
              <div className="space-y-3 text-[13px] text-white/60">
                <Link href="/order" className="block transition hover:text-white">
                  레퍼럴 구매
                </Link>
                <Link href="/policy/terms" className="block transition hover:text-white">
                  이용약관
                </Link>
                <Link href="/policy/privacy" className="block transition hover:text-white">
                  개인정보처리방침
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 pt-6 text-[11px] text-white/40 md:flex-row md:items-center md:justify-between">
          <div>© 2026 CAREIS. All rights reserved.</div>
          <div>Day To Night Premium Dermacosmetic</div>
          <div className="flex flex-wrap gap-4">
            <Link href="/policy/shipping" className="transition hover:text-white">
              배송/교환/반품
            </Link>
            <Link href="/products/sun-pack" className="transition hover:text-white">
              선팩
            </Link>
            <Link href="/products/illuminator" className="transition hover:text-white">
              일루미네이터
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function InstagramIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3.5" y="3.5" width="17" height="17" rx="4.5" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="17.3" cy="6.7" r="1.1" fill="currentColor" />
    </svg>
  );
}
