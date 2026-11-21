import Image from "next/image";
import Link from "next/link";
import type { Puppy } from "@/lib/types";
import { featuredImage, genderLabel, puppyDisplayName } from "@/lib/utils/format";
import { isAvailable, puppyHasVideo } from "@/lib/utils/puppy-media";

const DOODLES = ["paw", "spark", "dots", "heart", "lines"] as const;

export function PuppyCard({
  puppy,
  doodleIndex = 0,
}: {
  puppy: Puppy;
  doodleIndex?: number;
}) {
  const img = featuredImage(puppy.puppy_images);
  const gone = !isAvailable(puppy);
  const showVideo = !gone && puppyHasVideo(puppy);
  const accent = doodleIndex % 2 === 0 ? "peach" : "sky";
  const doodle = DOODLES[doodleIndex % DOODLES.length];

  return (
    <Link
      href={`/puppies/${puppy.slug}`}
      className={`sketch-pup sketch-pup--${accent}`}
      aria-label={`${puppyDisplayName(puppy)}, ${puppy.breed}, ${genderLabel(puppy.gender).toLowerCase()}, ${puppy.age_label}, ${gone ? "gone home" : "available"}${showVideo ? ", has video" : ""}`}
    >
      <span className={`sketch-pup__doodle sketch-pup__doodle--${doodle}`} aria-hidden />

      <span className="sketch-pup__orb">
        <span className="sketch-pup__ring" aria-hidden />
        <span className="sketch-pup__photo">
          {img ? (
            <Image
              src={img.url}
              alt=""
              fill
              className="object-cover"
              sizes="(max-width:768px) 45vw, 220px"
            />
          ) : (
            <span className="sketch-pup__empty">No photo</span>
          )}
        </span>

        {isAvailable(puppy) && (
          <span className="sketch-pup__tag sketch-pup__tag--available">Available</span>
        )}

        {showVideo && (
          <span className="sketch-pup__tag sketch-pup__tag--video">
            <span aria-hidden>▶</span> video
          </span>
        )}

        {gone && (
          <span className="sketch-pup__tag sketch-pup__tag--gone">gone home ♥</span>
        )}
      </span>

      <span className="sketch-pup__meta">
        <span className="sketch-pup__name font-plush">{puppyDisplayName(puppy)}</span>
        {!gone && (
          <span className="sketch-pup__detail">
            {genderLabel(puppy.gender).toLowerCase()} · {puppy.age_label}
          </span>
        )}
      </span>
    </Link>
  );
}
