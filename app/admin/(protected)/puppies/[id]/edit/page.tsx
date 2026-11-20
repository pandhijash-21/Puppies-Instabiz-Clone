import { notFound } from "next/navigation";
import { PuppyForm } from "@/components/admin/PuppyForm";
import { getAllPuppiesAdmin } from "@/lib/db/puppies";
import { hasSupabaseEnv } from "@/lib/config";
import { createClient } from "@/lib/supabase/server";
import type { Puppy } from "@/lib/types";

async function getPuppy(id: string): Promise<Puppy | null> {
  if (!hasSupabaseEnv()) {
    const all = await getAllPuppiesAdmin();
    return all.find((p) => p.id === id) || null;
  }
  const supabase = await createClient();
  const { data } = await supabase
    .from("puppies")
    .select("*, puppy_images(*)")
    .eq("id", id)
    .maybeSingle();
  return (data as Puppy) || null;
}

export default async function EditPuppyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const puppy = await getPuppy(id);
  if (!puppy) notFound();

  return (
    <div>
      <h1 className="font-plush text-4xl font-extrabold">Edit {puppy.name}</h1>
      <div className="mt-8">
        <PuppyForm puppy={puppy} />
      </div>
    </div>
  );
}
