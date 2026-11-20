import type { Puppy, PuppyGender, PuppyLocationType } from "@/lib/types";

export function genderLabel(gender: PuppyGender) {
  switch (gender) {
    case "boy":
      return "Boy";
    case "girl":
      return "Girl";
    case "boy_and_girl":
      return "Boy & girl";
  }
}

export function locationLabel(location: PuppyLocationType) {
  return location === "dubai_showroom" ? "In our showroom" : "Imported for you";
}

export function puppyDisplayName(puppy: Pick<Puppy, "name" | "breed">) {
  return puppy.name?.trim() || puppy.breed;
}

export function featuredImage(
  images?: Array<{ url: string; is_featured: boolean; sort_order: number; media_type: string }>,
) {
  if (!images?.length) return null;
  const imgs = images.filter((i) => i.media_type === "image");
  return (
    imgs.find((i) => i.is_featured) ||
    imgs.sort((a, b) => a.sort_order - b.sort_order)[0] ||
    null
  );
}
