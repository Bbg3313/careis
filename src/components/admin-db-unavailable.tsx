export function AdminDbUnavailableNotice() {
  return (
    <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">
      <p className="font-medium">주문 데이터베이스에 연결할 수 없습니다.</p>
      <p className="mt-1 text-amber-900/90">
        Vercel 등 서버리스 환경에서는 로컬 SQLite 경로가 동작하지 않습니다. Postgres 등 호스팅 DB를 준비하고{" "}
        <code className="rounded bg-amber-100/90 px-1 font-mono text-xs">DATABASE_URL</code>을 설정한 뒤{" "}
        Prisma 마이그레이션을 적용해 주세요.
      </p>
    </div>
  );
}
