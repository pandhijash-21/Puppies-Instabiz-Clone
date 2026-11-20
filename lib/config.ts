export const siteConfig = {
  name: "TeddyPups U.A.E.",
  tagline: "every puppy is family",
  description:
    "Teddy bear and teacup puppies in Dubai. Meet local puppies in our Downtown Dubai showroom or bring home a rare breed imported from trusted breeders.",
  phoneDisplay:
    process.env.NEXT_PUBLIC_PHONE_DISPLAY || "+971 50 000 0000",
  email: process.env.NEXT_PUBLIC_EMAIL || "info@instabizweb.com",
  address:
    process.env.NEXT_PUBLIC_ADDRESS || "Downtown Dubai, United Arab Emirates",
  mapsUrl:
    process.env.NEXT_PUBLIC_MAPS_URL ||
    "https://maps.google.com/?q=Downtown+Dubai",
  instagram: process.env.NEXT_PUBLIC_INSTAGRAM_URL || "https://instagram.com/",
  tiktok: process.env.NEXT_PUBLIC_TIKTOK_URL || "https://tiktok.com/",
  facebook: process.env.NEXT_PUBLIC_FACEBOOK_URL || "https://facebook.com/",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
};

export function hasSupabaseEnv() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}
