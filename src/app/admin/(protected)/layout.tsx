import { redirect } from "next/navigation";

import { AdminChrome } from "@/components/admin-chrome";
import { assertAllowedAdminEmail, getAdminSessionUser } from "@/lib/admin-auth";

export default async function AdminProtectedLayout({ children }: { children: React.ReactNode }) {
  const hasSupabase = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );

  const user = await getAdminSessionUser();

  if (hasSupabase && !user) {
    redirect("/admin/login?next=/admin");
  }

  if (user && process.env.ADMIN_ALLOWED_EMAILS?.trim()) {
    try {
      assertAllowedAdminEmail(user);
    } catch {
      redirect("/admin/login?error=forbidden");
    }
  }

  return (
    <div className="mx-auto max-w-6xl pb-20">
      <AdminChrome email={user?.email ?? null} />
      {children}
    </div>
  );
}
