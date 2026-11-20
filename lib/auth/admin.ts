import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { hasSupabaseEnv } from "@/lib/config";
import type { Admin } from "@/lib/types";

export async function requireAdmin(): Promise<Admin | null> {
  if (!hasSupabaseEnv()) {
    // Demo mode: admin pages render with local demo data; mutations that need Supabase will show errors.
    return {
      id: "demo-admin",
      auth_user_id: "demo",
      email: "admin@teddypups.local",
      display_name: "Demo Admin",
    };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const { data: admin } = await supabase
    .from("admins")
    .select("*")
    .eq("auth_user_id", user.id)
    .maybeSingle();

  if (!admin) redirect("/admin/login?error=unauthorized");
  return admin as Admin;
}
