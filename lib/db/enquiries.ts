import { hasSupabaseEnv } from "@/lib/config";
import { createClient } from "@/lib/supabase/server";
import type { Enquiry, EnquiryStatus } from "@/lib/types";
import type { EnquiryInput } from "@/lib/validations/enquiry";

const memoryEnquiries: Enquiry[] = [];

export async function createEnquiry(input: EnquiryInput): Promise<{ ok: true } | { ok: false; error: string }> {
  if (input.website) {
    // Honeypot tripped — pretend success
    return { ok: true };
  }

  const row = {
    name: input.name,
    phone: input.phone,
    email: input.email || null,
    area: input.area || null,
    message: input.message || null,
    puppy_id: input.puppy_id || null,
    source: input.source,
    status: "new" as const,
  };

  if (!hasSupabaseEnv()) {
    memoryEnquiries.unshift({
      id: crypto.randomUUID(),
      ...row,
      internal_notes: "",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });
    return { ok: true };
  }

  try {
    const supabase = await createClient();
    const { error } = await supabase.from("enquiries").insert(row);
    if (error) return { ok: false, error: error.message };
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Failed to save enquiry" };
  }
}

export async function getEnquiriesAdmin(): Promise<Enquiry[]> {
  if (!hasSupabaseEnv()) return memoryEnquiries;
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("enquiries")
    .select("*, puppies(id, name, breed, slug)")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data || []) as Enquiry[];
}

export async function updateEnquiryAdmin(
  id: string,
  patch: { status?: EnquiryStatus; internal_notes?: string },
) {
  if (!hasSupabaseEnv()) {
    const idx = memoryEnquiries.findIndex((e) => e.id === id);
    if (idx >= 0) memoryEnquiries[idx] = { ...memoryEnquiries[idx], ...patch };
    return;
  }
  const supabase = await createClient();
  const { error } = await supabase.from("enquiries").update(patch).eq("id", id);
  if (error) throw error;
}
