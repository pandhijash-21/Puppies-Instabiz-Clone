import type { Puppy } from "@/lib/types";

/** True when the listing is flagged for video or has a video media asset. */
export function puppyHasVideo(puppy: Pick<Puppy, "has_video" | "puppy_images">) {
  if (puppy.has_video) return true;
  return Boolean(puppy.puppy_images?.some((img) => img.media_type === "video"));
}

export function isAvailable(puppy: Pick<Puppy, "availability">) {
  return puppy.availability === "available";
}
