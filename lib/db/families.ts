import { demoFamilies } from "@/content/demo-data";
import { hasSupabaseEnv } from "@/lib/config";
import { createClient } from "@/lib/supabase/server";
import type { Family } from "@/lib/types";

export async function getFamilies(opts?: { limit?: number }): Promise<Family[]> {
  if (!hasSupabaseEnv()) {
    const list = demoFamilies
      .filter((f) => f.is_published)
      .sort((a, b) => a.sort_order - b.sort_order);
    return opts?.limit ? list.slice(0, opts.limit) : list;
  }
  try {
    const supabase = await createClient();
    let query = supabase
      .from("families")
      .select("*, family_images(*)")
      .eq("is_published", true)
      .order("sort_order", { ascending: true });
    if (opts?.limit) query = query.limit(opts.limit);
    const { data, error } = await query;
    if (error || !data?.length) {
      const list = demoFamilies.filter((f) => f.is_published);
      return opts?.limit ? list.slice(0, opts.limit) : list;
    }
    return data as Family[];
  } catch {
    return demoFamilies.filter((f) => f.is_published);
  }
}

export async function getAllFamiliesAdmin(): Promise<Family[]> {
  if (!hasSupabaseEnv()) return demoFamilies;
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("families")
    .select("*, family_images(*)")
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return (data || []) as Family[];
}
