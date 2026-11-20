import Image from "next/image";
import Link from "next/link";
import type { Puppy } from "@/lib/types";
import { featuredImage, genderLabel, puppyDisplayName } from "@/lib/utils/format";

export function PuppyCard({ puppy }: { puppy: Puppy }) {
  const img = featuredImage(puppy.puppy_images);
  const gone = puppy.availability === "gone_home";

  return (
    <Link
      href={`/puppies/${puppy.slug}`}
      className="group block overflow-hidden rounded-[1.5rem] bg-white shadow-[0_12px_30px_rgba(42,23,14,0.08)] transition hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(42,23,14,0.14)]"
      aria-label={`${puppyDisplayName(puppy)}, ${puppy.breed}, ${genderLabel(puppy.gender).toLowerCase()}, ${puppy.age_label}, ${gone ? "gone home" : "available"}`}
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-honey-soft/40">
        {img ? (
          <Image
            src={img.url}
            alt={`${puppyDisplayName(puppy)}, ${puppy.gender === "girl" ? "female" : "male"} ${puppy.breed} puppy`}
            fill
            className="object-cover transition duration-500 group-hover:scale-105"
            sizes="(max-width:768px) 50vw, 25vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-cocoa-soft">No photo</div>
        )}
        <div className="absolute left-3 top-3 flex gap-2">
          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${
              gone ? "bg-cocoa text-milk" : "bg-milk text-cocoa"
            }`}
          >
            {gone ? "gone home ♥" : "Available"}
          </span>
          {puppy.has_video && !gone && (
            <span className="rounded-full bg-cocoa/80 px-3 py-1 text-xs font-semibold text-milk">
              ▶ video
            </span>
          )}
        </div>
      </div>
      <div className="space-y-1 p-4">
        <h3 className="font-plush text-xl font-bold text-cocoa">
          {puppyDisplayName(puppy)}
        </h3>
        <p className="text-sm text-cocoa-soft">
          {puppy.breed} · {genderLabel(puppy.gender).toLowerCase()} · {puppy.age_label}
        </p>
      </div>
    </Link>
  );
}
