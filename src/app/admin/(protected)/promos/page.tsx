import { AdminPromosPanel } from "@/components/admin-promos-panel";

export const dynamic = "force-dynamic";

export default function AdminPromosPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-stone-900">공구캠페인</h1>
        <p className="mt-2 text-sm text-stone-600">
          인플루 전용 링크는 <code className="rounded bg-stone-100 px-1">?ref=코드</code>와 동일한 문자열로 캠페인을 만듭니다.
        </p>
      </div>
      <AdminPromosPanel />
    </div>
  );
}
