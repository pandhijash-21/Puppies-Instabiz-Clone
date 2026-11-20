import { demoFamilies, demoPuppies, demoReviews } from "@/content/demo-data";
import { hasSupabaseEnv } from "@/lib/config";
import { createClient } from "@/lib/supabase/server";
import { getEnquiriesAdmin } from "@/lib/db/enquiries";

export type DashboardStats = {
  totalPuppies: number;
  availablePuppies: number;
  totalEnquiries: number;
  newEnquiries: number;
  publishedStories: number;
  approvedReviews: number;
  recentActivity: Array<{ id: string; label: string; at: string; href: string }>;
};

export async function getDashboardStats(): Promise<DashboardStats> {
  if (!hasSupabaseEnv()) {
    const enquiries = await getEnquiriesAdmin();
    return {
      totalPuppies: demoPuppies.length,
      availablePuppies: demoPuppies.filter(
        (p) => p.availability === "available" && p.status === "published",
      ).length,
      totalEnquiries: enquiries.length,
      newEnquiries: enquiries.filter((e) => e.status === "new").length,
      publishedStories: demoFamilies.filter((f) => f.is_published).length,
      approvedReviews: demoReviews.filter((r) => r.status === "approved").length,
      recentActivity: [
        ...enquiries.slice(0, 5).map((e) => ({
          id: e.id,
          label: `Enquiry from ${e.name}`,
          at: e.created_at,
          href: "/admin/enquiries",
        })),
      ],
    };
  }

  const supabase = await createClient();
  const [
    { count: totalPuppies },
    { count: availablePuppies },
    { count: totalEnquiries },
    { count: newEnquiries },
    { count: publishedStories },
    { count: approvedReviews },
    { data: recentEnquiries },
  ] = await Promise.all([
    supabase.from("puppies").select("*", { count: "exact", head: true }),
    supabase
      .from("puppies")
      .select("*", { count: "exact", head: true })
      .eq("availability", "available")
      .eq("status", "published"),
    supabase.from("enquiries").select("*", { count: "exact", head: true }),
    supabase
      .from("enquiries")
      .select("*", { count: "exact", head: true })
      .eq("status", "new"),
    supabase
      .from("families")
      .select("*", { count: "exact", head: true })
      .eq("is_published", true),
    supabase
      .from("reviews")
      .select("*", { count: "exact", head: true })
      .eq("status", "approved"),
    supabase
      .from("enquiries")
      .select("id, name, created_at")
      .order("created_at", { ascending: false })
      .limit(8),
  ]);

  return {
    totalPuppies: totalPuppies || 0,
    availablePuppies: availablePuppies || 0,
    totalEnquiries: totalEnquiries || 0,
    newEnquiries: newEnquiries || 0,
    publishedStories: publishedStories || 0,
    approvedReviews: approvedReviews || 0,
    recentActivity: (recentEnquiries || []).map((e) => ({
      id: e.id,
      label: `Enquiry from ${e.name}`,
      at: e.created_at,
      href: "/admin/enquiries",
    })),
  };
}
