export function AdminDbUnavailableNotice() {
  return (
    <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">
      <p className="font-medium">주문 데이터베이스에 연결할 수 없습니다.</p>
      <p className="mt-1 text-amber-900/90">
        잠시 후 다시 시도해 주세요. 같은 안내가 계속되면 Supabase Postgres 연결(풀러·연결 수 한도) 또는{" "}
        <code className="rounded bg-amber-100/90 px-1 font-mono text-xs">DATABASE_URL</code> /{" "}
        <code className="rounded bg-amber-100/90 px-1 font-mono text-xs">DIRECT_URL</code> 설정을 확인해 주세요.
      </p>
    </div>
  );
}
