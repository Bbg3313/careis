import type { Metadata } from "next";
import Link from "next/link";

import { SITE_NAME } from "@/lib/site-seo";

const policies = [
  { href: "/policy/terms", title: "이용약관", description: "비회원 구매 및 서비스 이용 기본 약관" },
  { href: "/policy/privacy", title: "개인정보처리방침", description: "주문·결제·배송 관련 개인정보 처리 기준" },
  { href: "/policy/shipping", title: "배송/교환/반품", description: "배송, 교환, 반품, 환불 안내" },
];

export const metadata: Metadata = {
  title: "정책 안내",
  description: "이용약관, 개인정보처리방침, 배송·교환·반품 안내를 한곳에서 확인하세요.",
  alternates: { canonical: "/policy" },
  openGraph: {
    url: "/policy",
    title: `정책 안내 · ${SITE_NAME}`,
    description: "서비스 이용 및 주문·배송 관련 정책입니다.",
  },
};

export default function PolicyPage() {
  return (
    <div className="space-y-10 pb-20">
      <section className="space-y-3">
        <p className="text-xs uppercase tracking-[0.3em] text-stone-500">Policy</p>
        <h1 className="headline-balance text-4xl font-semibold text-stone-900">정책 안내</h1>
      </section>

      <div className="grid gap-5 md:grid-cols-3">
        {policies.map((policy) => (
          <Link
            key={policy.href}
            href={policy.href}
            className="rounded-[28px] border border-[rgba(116,88,59,0.12)] bg-white p-7"
          >
            <h2 className="headline-balance text-xl font-semibold text-stone-900">{policy.title}</h2>
            <p className="copy-pretty mt-3 text-sm leading-7 text-stone-600">{policy.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
