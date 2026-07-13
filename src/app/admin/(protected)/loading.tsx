export default function AdminProtectedLoading() {
  return (
    <div className="space-y-6 animate-pulse" aria-busy="true" aria-label="불러오는 중">
      <div className="space-y-2">
        <div className="h-8 w-40 rounded-md bg-stone-200" />
        <div className="h-4 w-56 rounded bg-stone-100" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-24 rounded-2xl border border-stone-100 bg-stone-50" />
        ))}
      </div>
      <div className="h-48 rounded-2xl border border-stone-100 bg-white" />
      <div className="overflow-hidden rounded-2xl border border-stone-100 bg-white">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex gap-4 border-t border-stone-50 px-4 py-3">
            <div className="h-4 w-28 rounded bg-stone-100" />
            <div className="h-4 flex-1 rounded bg-stone-100" />
            <div className="h-4 w-20 rounded bg-stone-100" />
          </div>
        ))}
      </div>
    </div>
  );
}
