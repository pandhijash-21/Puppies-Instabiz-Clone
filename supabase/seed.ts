/**
 * Seed script: creates admin user + reference content in Supabase.
 * Usage: npx tsx --env-file=.env.local supabase/seed.ts
 */
import { createClient } from "@supabase/supabase-js";
import {
  demoFamilies,
  demoFaqs,
  demoPuppies,
  demoReviews,
} from "../content/demo-data";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(url, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function ensureAdmin() {
  const email = process.env.ADMIN_EMAIL || "admin@teddypups.local";
  const password = process.env.ADMIN_PASSWORD || "ChangeMe123!";
  const displayName = process.env.ADMIN_DISPLAY_NAME || "TeddyPups Admin";

  const { data: listed } = await supabase.auth.admin.listUsers({ perPage: 200 });
  let user = listed?.users.find((u) => u.email === email);

  if (!user) {
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });
    if (error) throw error;
    user = data.user;
    console.log("Created auth user", email);
  } else {
    console.log("Auth user exists", email);
  }

  const { error } = await supabase.from("admins").upsert(
    {
      auth_user_id: user!.id,
      email,
      display_name: displayName,
    },
    { onConflict: "auth_user_id" },
  );
  if (error) throw error;
  console.log("Admin row ready");
}

async function seedPuppies() {
  for (const puppy of demoPuppies) {
    const { puppy_images, ...row } = puppy;
    const { error } = await supabase.from("puppies").upsert(row, { onConflict: "id" });
    if (error) throw error;

    if (puppy_images?.length) {
      await supabase.from("puppy_images").delete().eq("puppy_id", puppy.id);
      const { error: imgErr } = await supabase.from("puppy_images").insert(
        puppy_images.map((img) => ({
          puppy_id: puppy.id,
          storage_path: img.storage_path,
          url: img.url,
          media_type: img.media_type,
          is_featured: img.is_featured,
          sort_order: img.sort_order,
        })),
      );
      if (imgErr) throw imgErr;
    }
  }
  console.log(`Seeded ${demoPuppies.length} puppies`);
}

async function seedFaqs() {
  await supabase.from("faqs").delete().neq("question", "");
  const { error } = await supabase.from("faqs").insert(
    demoFaqs.map(({ question, answer, is_published, show_on_home, sort_order }) => ({
      question,
      answer,
      is_published,
      show_on_home,
      sort_order,
    })),
  );
  if (error) throw error;
  console.log(`Seeded ${demoFaqs.length} faqs`);
}

async function seedFamilies() {
  await supabase.from("family_images").delete().neq("url", "");
  await supabase.from("families").delete().neq("title", "");

  for (const family of demoFamilies) {
    const { family_images, id: _id, created_at: _c, updated_at: _u, ...row } = family;
    const { data, error } = await supabase
      .from("families")
      .insert(row)
      .select("id")
      .single();
    if (error) throw error;
    if (family_images?.length && data?.id) {
      const { error: imgErr } = await supabase.from("family_images").insert(
        family_images.map((img) => ({
          family_id: data.id,
          storage_path: img.storage_path,
          url: img.url,
          sort_order: img.sort_order,
        })),
      );
      if (imgErr) throw imgErr;
    }
  }
  console.log(`Seeded ${demoFamilies.length} families`);
}

async function seedReviews() {
  await supabase.from("reviews").delete().neq("author_name", "");
  const { error } = await supabase.from("reviews").insert(
    demoReviews.map(
      ({ author_name, author_location, body, rating, status, show_on_home, family_id }) => ({
        author_name,
        author_location,
        body,
        rating,
        status,
        show_on_home,
        family_id,
      }),
    ),
  );
  if (error) throw error;
  console.log(`Seeded ${demoReviews.length} reviews`);
}

async function main() {
  await ensureAdmin();
  await seedPuppies();
  await seedFaqs();
  await seedFamilies();
  await seedReviews();
  console.log("Seed complete");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
