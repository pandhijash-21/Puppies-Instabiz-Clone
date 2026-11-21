import { createClient } from "@supabase/supabase-js";
import { getSupabaseSecretKey, getSupabaseUrl } from "@/lib/supabase/env";

/** Secret-key client for seed scripts and privileged server-only ops. Never import in client components. */
export function createServiceClient() {
  const url = getSupabaseUrl();
  const key = getSupabaseSecretKey();
  if (!url || !key) {
    throw new Error("Missing SUPABASE_URL / NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SECRET_KEY");
  }
  return createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
