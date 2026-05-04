import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-[rgba(116,88,59,0.08)] bg-[linear-gradient(180deg,#f7f1ea_0%,#efe7de_100%)]">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 md:grid-cols-[1.3fr_0.7fr]">
        <div className="space-y-4">
          <div>
            <p className="display-font text-3xl font-semibold tracking-[0.08em] text-stone-900">CAREIS</p>
            <p className="mt-1 text-[10px] uppercase tracking-[0.34em] text-stone-500">
              Hospital Distributed Dermacosmetic
            </p>
          </div>
          <p className="max-w-xl text-sm leading-8 text-stone-600">
            병원 유통 기반 더마 코스메틱 브랜드. 데일리 보호를 위한 선팩과 야간 집중
            케어를 위한 일루미네이터를 중심으로 간결한 루틴을 제안합니다.
          </p>
        </div>

        <div className="grid gap-8 text-sm text-stone-600 sm:grid-cols-2 md:grid-cols-1">
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
              <Link href="/products/sun-pack">선팩 상세</Link>
              <Link href="/products/illuminator">일루미네이터 상세</Link>
              <Link href="/admin/orders">관리자 주문</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
