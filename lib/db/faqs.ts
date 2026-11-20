import { demoFaqs } from "@/content/demo-data";
import { hasSupabaseEnv } from "@/lib/config";
import { createClient } from "@/lib/supabase/server";
import type { Faq } from "@/lib/types";

export async function getFaqs(opts?: { homeOnly?: boolean }): Promise<Faq[]> {
  if (!hasSupabaseEnv()) {
    let list = demoFaqs.filter((f) => f.is_published);
    if (opts?.homeOnly) list = list.filter((f) => f.show_on_home);
    return list.sort((a, b) => a.sort_order - b.sort_order);
  }
  try {
    const supabase = await createClient();
    let query = supabase
      .from("faqs")
      .select("*")
      .eq("is_published", true)
      .order("sort_order", { ascending: true });
    if (opts?.homeOnly) query = query.eq("show_on_home", true);
    const { data, error } = await query;
    if (error || !data?.length) {
      let list = demoFaqs.filter((f) => f.is_published);
      if (opts?.homeOnly) list = list.filter((f) => f.show_on_home);
      return list;
    }
    return data as Faq[];
  } catch {
    return demoFaqs.filter((f) => f.is_published);
  }
}

export async function getAllFaqsAdmin(): Promise<Faq[]> {
  if (!hasSupabaseEnv()) return demoFaqs;
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("faqs")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return (data || []) as Faq[];
}
