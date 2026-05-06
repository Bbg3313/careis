import Link from "next/link";

const policies = [
  { href: "/policy/terms", title: "이용약관", description: "서비스 이용에 대한 기본 약관" },
  { href: "/policy/privacy", title: "개인정보처리방침", description: "주문 및 배송 정보 처리 기준" },
  { href: "/policy/shipping", title: "배송/교환/반품", description: "배송비, 교환, 반품 안내" },
];

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
