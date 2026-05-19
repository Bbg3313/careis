export default function AdminOrdersLoading() {
  return (
    <div className="space-y-8 animate-pulse" aria-busy="true" aria-label="주문 목록 불러오는 중">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-2">
          <div className="h-8 w-32 rounded-md bg-stone-200" />
          <div className="h-4 w-64 rounded bg-stone-100" />
        </div>
        <div className="h-10 w-40 rounded-full bg-stone-100" />
      </div>

      <div className="h-24 rounded-2xl border border-stone-100 bg-stone-50" />

      <div className="flex flex-wrap gap-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-9 w-20 rounded-full bg-stone-100" />
        ))}
      </div>

      <div className="space-y-2">
        <div className="h-3 w-full max-w-md rounded bg-stone-100" />
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-8 w-24 rounded-full bg-stone-100" />
          ))}
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-stone-100 bg-white">
        <div className="h-10 bg-stone-50" />
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="flex gap-4 border-t border-stone-50 px-4 py-3">
            <div className="h-4 w-28 rounded bg-stone-100" />
            <div className="h-4 w-24 rounded bg-stone-100" />
            <div className="h-4 flex-1 rounded bg-stone-100" />
            <div className="h-4 w-20 rounded bg-stone-100" />
            <div className="h-4 w-24 rounded bg-stone-100" />
          </div>
        ))}
      </div>

      <div className="h-24 rounded-2xl border border-stone-100 bg-stone-50" />
    </div>
  );
}
