import { demoReviews } from "@/content/demo-data";
import { hasSupabaseEnv } from "@/lib/config";
import { createClient } from "@/lib/supabase/server";
import type { Review } from "@/lib/types";

export async function getReviews(opts?: { homeOnly?: boolean }): Promise<Review[]> {
  if (!hasSupabaseEnv()) {
    let list = demoReviews.filter((r) => r.status === "approved");
    if (opts?.homeOnly) list = list.filter((r) => r.show_on_home);
    return list;
  }
  try {
    const supabase = await createClient();
    let query = supabase
      .from("reviews")
      .select("*")
      .eq("status", "approved")
      .order("created_at", { ascending: false });
    if (opts?.homeOnly) query = query.eq("show_on_home", true);
    const { data, error } = await query;
    if (error || !data?.length) {
      let list = demoReviews.filter((r) => r.status === "approved");
      if (opts?.homeOnly) list = list.filter((r) => r.show_on_home);
      return list;
    }
    return data as Review[];
  } catch {
    return demoReviews.filter((r) => r.status === "approved");
  }
}

export async function getAllReviewsAdmin(): Promise<Review[]> {
  if (!hasSupabaseEnv()) return demoReviews;
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("reviews")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data || []) as Review[];
}
