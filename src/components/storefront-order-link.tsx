"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMemo, type ComponentProps } from "react";

import { appendPromoRefToHref } from "@/lib/referral-code";
import { resolveStorefrontReferralCode } from "@/lib/referral-browser";

type Props = Omit<ComponentProps<typeof Link>, "href"> & {
  href: string;
};

/**
 * 공구 `?ref=` / 저장된 레퍼럴을 내부 링크에 유지한다.
 * (홈 → 구매/상세처럼 URL에서 ref가 빠져도 할인 세션이 이어지도록)
 */
export function StorefrontOrderLink({ href, children, ...rest }: Props) {
  const searchParams = useSearchParams();
  const nextHref = useMemo(() => {
    const code = resolveStorefrontReferralCode(searchParams);
    return appendPromoRefToHref(href, code);
  }, [href, searchParams]);

  return (
    <Link href={nextHref} {...rest}>
      {children}
    </Link>
  );
}
