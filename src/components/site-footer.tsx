import Link from "next/link";

import { SiteLogo } from "@/components/site-logo";

export function SiteFooter() {
  return (
    <footer className="border-t border-[rgba(116,88,59,0.08)] bg-[linear-gradient(180deg,#f7f1ea_0%,#efe7de_100%)]">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 lg:grid-cols-2">
        <div className="space-y-4">
          <div>
            <SiteLogo />
          </div>
          <p className="max-w-xl text-sm leading-8 text-stone-600">
            CAREIS는 병원과 클리닉에서 먼저 설명 가능한 더마코스메틱 브랜드를 지향합니다.
            일상 보호와 집중 케어를 위한 두 개의 핵심 제품을 중심으로, 도입 문의와 오픈
            레퍼럴 구매를 함께 운영할 수 있는 구조를 제안합니다.
          </p>
        </div>

        <div className="grid gap-8 text-sm text-stone-600 sm:grid-cols-2">
          <div className="space-y-3">
            <p className="font-medium text-stone-800">Policy</p>
            <div className="flex flex-col gap-2">
              <Link href="/policy/terms">이용약관</Link>
              <Link href="/policy/privacy">개인정보처리방침</Link>
              <Link href="/policy/shipping">배송/교환/반품</Link>
            </div>
          </div>
          <div className="space-y-3">
            <p className="font-medium text-stone-800">Shortcut</p>
            <div className="flex flex-col gap-2">
              <Link href="/contact">도입 문의</Link>
              <Link href="/products/sun-pack">선팩 상세</Link>
              <Link href="/products/illuminator">일루미네이터 상세</Link>
              <Link href="/order?product=sun-pack">레퍼럴 구매</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
