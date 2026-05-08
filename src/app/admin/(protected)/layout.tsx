import { redirect } from "next/navigation";

import { AdminChrome } from "@/components/admin-chrome";
import { assertAllowedAdminEmail, getAdminSessionUser } from "@/lib/admin-auth";
import { getPublicSupabaseEnv, hasPublicSupabaseEnv } from "@/lib/supabase/env-public";

export default async function AdminProtectedLayout({ children }: { children: React.ReactNode }) {
  const hasSupabase = hasPublicSupabaseEnv();

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

  const { url: supabaseUrl, anon: supabaseAnonKey } = getPublicSupabaseEnv();

  return (
    <div className="mx-auto max-w-6xl pb-20">
      <AdminChrome
        email={user?.email ?? null}
        supabaseUrl={supabaseUrl}
        supabaseAnonKey={supabaseAnonKey}
      />
      {children}
    </div>
  );
}
