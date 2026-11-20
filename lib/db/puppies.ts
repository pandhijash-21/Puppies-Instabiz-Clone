import { demoPuppies } from "@/content/demo-data";
import { hasSupabaseEnv } from "@/lib/config";
import { createClient } from "@/lib/supabase/server";
import type { Puppy, PuppyAvailability } from "@/lib/types";

export type PuppyFilters = {
  availability?: PuppyAvailability;
  location?: "imported" | "dubai_showroom" | "everywhere";
  breed?: string;
  gender?: "boy" | "girl";
  koreanTeacup?: boolean;
  limit?: number;
};

function filterDemo(filters: PuppyFilters = {}): Puppy[] {
  let list = demoPuppies.filter((p) => p.status === "published");
  if (filters.availability) {
    list = list.filter((p) => p.availability === filters.availability);
  }
  if (filters.location && filters.location !== "everywhere") {
    list = list.filter((p) => p.location_type === filters.location);
  }
  if (filters.breed) {
    const b = filters.breed.toLowerCase();
    list = list.filter((p) => p.breed.toLowerCase().includes(b));
  }
  if (filters.gender === "boy") {
    list = list.filter((p) => p.gender === "boy" || p.gender === "boy_and_girl");
  }
  if (filters.gender === "girl") {
    list = list.filter((p) => p.gender === "girl" || p.gender === "boy_and_girl");
  }
  if (filters.koreanTeacup) {
    list = list.filter((p) => p.is_korean_teacup);
  }
  list = [...list].sort((a, b) => a.sort_order - b.sort_order);
  if (filters.limit) list = list.slice(0, filters.limit);
  return list;
}

export async function getPuppies(filters: PuppyFilters = {}): Promise<Puppy[]> {
  if (!hasSupabaseEnv()) return filterDemo(filters);

  try {
    const supabase = await createClient();
    let query = supabase
      .from("puppies")
      .select("*, puppy_images(*)")
      .eq("status", "published")
      .order("sort_order", { ascending: true });

    if (filters.availability) query = query.eq("availability", filters.availability);
    if (filters.location && filters.location !== "everywhere") {
      query = query.eq("location_type", filters.location);
    }
    if (filters.breed) query = query.ilike("breed", `%${filters.breed}%`);
    if (filters.gender === "boy") query = query.in("gender", ["boy", "boy_and_girl"]);
    if (filters.gender === "girl") query = query.in("gender", ["girl", "boy_and_girl"]);
    if (filters.koreanTeacup) query = query.eq("is_korean_teacup", true);
    if (filters.limit) query = query.limit(filters.limit);

    const { data, error } = await query;
    if (error || !data?.length) return filterDemo(filters);
    return data as Puppy[];
  } catch {
    return filterDemo(filters);
  }
}

export async function getPuppyBySlug(slug: string): Promise<Puppy | null> {
  if (!hasSupabaseEnv()) {
    return demoPuppies.find((p) => p.slug === slug && p.status === "published") || null;
  }
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("puppies")
      .select("*, puppy_images(*)")
      .eq("slug", slug)
      .eq("status", "published")
      .maybeSingle();
    if (error || !data) {
      return demoPuppies.find((p) => p.slug === slug) || null;
    }
    return data as Puppy;
  } catch {
    return demoPuppies.find((p) => p.slug === slug) || null;
  }
}

export async function getAdjacentPuppies(slug: string) {
  const available = await getPuppies({ availability: "available" });
  const idx = available.findIndex((p) => p.slug === slug);
  if (idx < 0) return { prev: null, next: null };
  return {
    prev: available[idx - 1] || available[available.length - 1] || null,
    next: available[idx + 1] || available[0] || null,
  };
}

export async function getAllPuppiesAdmin(): Promise<Puppy[]> {
  if (!hasSupabaseEnv()) return demoPuppies;
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("puppies")
    .select("*, puppy_images(*)")
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return (data || []) as Puppy[];
}
