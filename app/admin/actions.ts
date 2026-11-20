"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth/admin";
import { hasSupabaseEnv } from "@/lib/config";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/admin";
import { faqSchema } from "@/lib/validations/faq";
import { puppySchema } from "@/lib/validations/puppy";
import { updateEnquiryAdmin } from "@/lib/db/enquiries";
import type { EnquiryStatus, ReviewStatus } from "@/lib/types";

async function adminClient() {
  await requireAdmin();
  if (!hasSupabaseEnv()) {
    throw new Error("Supabase is not configured. Set env vars to enable writes.");
  }
  return createClient();
}

export async function upsertPuppyAction(formData: FormData) {
  const supabase = await adminClient();
  const id = String(formData.get("id") || "");
  const parsed = puppySchema.safeParse({
    name: formData.get("name"),
    slug: formData.get("slug"),
    breed: formData.get("breed"),
    gender: formData.get("gender"),
    age_label: formData.get("age_label"),
    description: formData.get("description") || "",
    location_type: formData.get("location_type"),
    availability: formData.get("availability"),
    status: formData.get("status"),
    has_video: formData.get("has_video") === "on",
    is_korean_teacup: formData.get("is_korean_teacup") === "on",
    sort_order: formData.get("sort_order") || 0,
  });
  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message || "Invalid puppy");
  }

  const payload = {
    ...parsed.data,
    published_at:
      parsed.data.status === "published" ? new Date().toISOString() : null,
  };

  if (id) {
    const { error } = await supabase.from("puppies").update(payload).eq("id", id);
    if (error) throw new Error(error.message);
  } else {
    const { data, error } = await supabase
      .from("puppies")
      .insert(payload)
      .select("id")
      .single();
    if (error) throw new Error(error.message);
    revalidatePath("/admin/puppies");
    revalidatePath("/puppies");
    redirect(`/admin/puppies/${data.id}/edit`);
  }

  revalidatePath("/admin/puppies");
  revalidatePath("/puppies");
  revalidatePath(`/puppies/${parsed.data.slug}`);
  redirect("/admin/puppies");
}

export async function deletePuppyAction(formData: FormData) {
  const supabase = await adminClient();
  const id = String(formData.get("id"));
  const { error } = await supabase.from("puppies").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/puppies");
  revalidatePath("/puppies");
}

export async function uploadPuppyImageAction(formData: FormData) {
  await requireAdmin();
  if (!hasSupabaseEnv()) throw new Error("Supabase is not configured");

  const puppyId = String(formData.get("puppy_id"));
  const file = formData.get("file");
  const mediaType = String(formData.get("media_type") || "image");
  const isFeatured = formData.get("is_featured") === "on";
  if (!(file instanceof File) || !file.size) throw new Error("File required");

  const allowedImage = ["image/jpeg", "image/png", "image/webp", "image/avif"];
  const allowedVideo = ["video/mp4", "video/webm"];
  const allowed = mediaType === "video" ? allowedVideo : allowedImage;
  if (!allowed.includes(file.type)) throw new Error("Unsupported file type");
  const max = mediaType === "video" ? 50 * 1024 * 1024 : 10 * 1024 * 1024;
  if (file.size > max) throw new Error("File too large");

  const ext = file.name.split(".").pop() || "bin";
  const path = `${puppyId}/${Date.now()}.${ext}`;
  const service = createServiceClient();
  const buffer = Buffer.from(await file.arrayBuffer());
  const { error: upErr } = await service.storage
    .from("puppies")
    .upload(path, buffer, { contentType: file.type, upsert: false });
  if (upErr) throw new Error(upErr.message);

  const { data: pub } = service.storage.from("puppies").getPublicUrl(path);
  const supabase = await createClient();

  if (isFeatured) {
    await supabase
      .from("puppy_images")
      .update({ is_featured: false })
      .eq("puppy_id", puppyId);
  }

  const { error } = await supabase.from("puppy_images").insert({
    puppy_id: puppyId,
    storage_path: path,
    url: pub.publicUrl,
    media_type: mediaType,
    is_featured: isFeatured,
    sort_order: Number(formData.get("sort_order") || 0),
  });
  if (error) throw new Error(error.message);

  revalidatePath(`/admin/puppies/${puppyId}/edit`);
  revalidatePath("/puppies");
}

export async function deletePuppyImageAction(formData: FormData) {
  const supabase = await adminClient();
  const id = String(formData.get("id"));
  const puppyId = String(formData.get("puppy_id"));
  const { error } = await supabase.from("puppy_images").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath(`/admin/puppies/${puppyId}/edit`);
}

export async function upsertFaqAction(formData: FormData) {
  const supabase = await adminClient();
  const id = String(formData.get("id") || "");
  const parsed = faqSchema.safeParse({
    question: formData.get("question"),
    answer: formData.get("answer"),
    is_published: formData.get("is_published") === "on",
    show_on_home: formData.get("show_on_home") === "on",
    sort_order: formData.get("sort_order") || 0,
  });
  if (!parsed.success) throw new Error(parsed.error.issues[0]?.message || "Invalid FAQ");

  if (id) {
    const { error } = await supabase.from("faqs").update(parsed.data).eq("id", id);
    if (error) throw new Error(error.message);
  } else {
    const { error } = await supabase.from("faqs").insert(parsed.data);
    if (error) throw new Error(error.message);
  }
  revalidatePath("/admin/faqs");
  revalidatePath("/faq");
  revalidatePath("/");
}

export async function deleteFaqAction(formData: FormData) {
  const supabase = await adminClient();
  const id = String(formData.get("id"));
  const { error } = await supabase.from("faqs").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/faqs");
  revalidatePath("/faq");
}

export async function updateEnquiryAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id"));
  const status = String(formData.get("status")) as EnquiryStatus;
  const internal_notes = String(formData.get("internal_notes") || "");
  await updateEnquiryAdmin(id, { status, internal_notes });
  revalidatePath("/admin/enquiries");
  revalidatePath("/admin/dashboard");
}

export async function upsertFamilyAction(formData: FormData) {
  const supabase = await adminClient();
  const id = String(formData.get("id") || "");
  const payload = {
    title: String(formData.get("title") || ""),
    caption: String(formData.get("caption") || ""),
    adoption_date: String(formData.get("adoption_date") || "") || null,
    is_published: formData.get("is_published") === "on",
    sort_order: Number(formData.get("sort_order") || 0),
  };
  if (!payload.title) throw new Error("Title required");

  if (id) {
    const { error } = await supabase.from("families").update(payload).eq("id", id);
    if (error) throw new Error(error.message);
  } else {
    const { error } = await supabase.from("families").insert(payload);
    if (error) throw new Error(error.message);
  }
  revalidatePath("/admin/families");
  revalidatePath("/happy-families");
  revalidatePath("/");
}

export async function deleteFamilyAction(formData: FormData) {
  const supabase = await adminClient();
  const id = String(formData.get("id"));
  const { error } = await supabase.from("families").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/families");
  revalidatePath("/happy-families");
}

export async function uploadFamilyImageAction(formData: FormData) {
  await requireAdmin();
  if (!hasSupabaseEnv()) throw new Error("Supabase is not configured");
  const familyId = String(formData.get("family_id"));
  const file = formData.get("file");
  if (!(file instanceof File) || !file.size) throw new Error("File required");
  const allowed = ["image/jpeg", "image/png", "image/webp", "image/avif"];
  if (!allowed.includes(file.type)) throw new Error("Unsupported file type");
  if (file.size > 10 * 1024 * 1024) throw new Error("File too large");

  const ext = file.name.split(".").pop() || "jpg";
  const path = `${familyId}/${Date.now()}.${ext}`;
  const service = createServiceClient();
  const buffer = Buffer.from(await file.arrayBuffer());
  const { error: upErr } = await service.storage
    .from("families")
    .upload(path, buffer, { contentType: file.type });
  if (upErr) throw new Error(upErr.message);
  const { data: pub } = service.storage.from("families").getPublicUrl(path);
  const supabase = await createClient();
  const { error } = await supabase.from("family_images").insert({
    family_id: familyId,
    storage_path: path,
    url: pub.publicUrl,
    sort_order: Number(formData.get("sort_order") || 0),
  });
  if (error) throw new Error(error.message);
  revalidatePath("/admin/families");
  revalidatePath("/happy-families");
}

export async function upsertReviewAction(formData: FormData) {
  const supabase = await adminClient();
  const id = String(formData.get("id") || "");
  const payload = {
    author_name: String(formData.get("author_name") || ""),
    author_location: String(formData.get("author_location") || ""),
    body: String(formData.get("body") || ""),
    rating: Number(formData.get("rating") || 5),
    status: String(formData.get("status") || "pending") as ReviewStatus,
    show_on_home: formData.get("show_on_home") === "on",
  };
  if (!payload.author_name || !payload.body) throw new Error("Name and body required");

  if (id) {
    const { error } = await supabase.from("reviews").update(payload).eq("id", id);
    if (error) throw new Error(error.message);
  } else {
    const { error } = await supabase.from("reviews").insert(payload);
    if (error) throw new Error(error.message);
  }
  revalidatePath("/admin/reviews");
  revalidatePath("/");
  revalidatePath("/happy-families");
}

export async function deleteReviewAction(formData: FormData) {
  const supabase = await adminClient();
  const id = String(formData.get("id"));
  const { error } = await supabase.from("reviews").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/reviews");
}

export async function uploadMediaAction(formData: FormData) {
  await requireAdmin();
  if (!hasSupabaseEnv()) throw new Error("Supabase is not configured");
  const file = formData.get("file");
  if (!(file instanceof File) || !file.size) throw new Error("File required");
  const allowed = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/avif",
    "video/mp4",
    "video/webm",
  ];
  if (!allowed.includes(file.type)) throw new Error("Unsupported file type");
  const max = file.type.startsWith("video/") ? 50 * 1024 * 1024 : 10 * 1024 * 1024;
  if (file.size > max) throw new Error("File too large");

  const ext = file.name.split(".").pop() || "bin";
  const path = `uploads/${Date.now()}.${ext}`;
  const service = createServiceClient();
  const buffer = Buffer.from(await file.arrayBuffer());
  const { error } = await service.storage
    .from("media")
    .upload(path, buffer, { contentType: file.type });
  if (error) throw new Error(error.message);
  revalidatePath("/admin/media");
}
