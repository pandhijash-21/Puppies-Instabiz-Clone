"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { X } from "lucide-react";
import type { Family, Review } from "@/lib/types";
import { ButtonLink } from "@/components/ui/Button";

const TILTS = ["-2.2deg", "1.6deg", "-0.9deg", "2.4deg", "-1.5deg", "1.1deg", "-2deg", "1.8deg"];
const TAPES = ["#f6d79a", "#f9cdbf", "#cfe5f6", "#f6d79a", "#e9dcc4", "#f9cdbf", "#cfe5f6", "#e9dcc4"];
const DELAYS = [330, 0, 550, 110, 660, 220, 440, 80];

type Photo = {
  id: string;
  url: string;
  caption: string;
};

export function HappyFamiliesHome({
  review,
  families,
}: {
  review?: Review | null;
  families: Family[];
}) {
  const [active, setActive] = useState<number | null>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const photos: Photo[] = families
    .flatMap((f) =>
      (f.family_images || []).map((img) => ({
        id: img.id,
        url: img.url,
        caption: f.caption || f.title,
      })),
    )
    .slice(0, 8);

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const items = [...list.querySelectorAll<HTMLLIElement>("li[data-reveal]")];
    items.forEach((el) => {
      el.dataset.armed = "true";
    });

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).dataset.revealed = "true";
          }
        });
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.15 },
    );
    items.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [photos.length]);

  return (
    <section
      id="happy-families"
      data-pup-scene="true"
      data-tone="dark"
      className="tp-scene tp-dusk"
      style={{ ["--sky-top" as string]: "#a65a30", ["--sky-bottom" as string]: "#4d2b19" }}
      aria-labelledby="dusk-title"
    >
      <div className="tp-dusk__sky gutter">
        <div className="tp-dusk__head">
          <h2 id="dusk-title" className="font-plush text-huge">
            Happy families &amp; puppies
          </h2>
          <p className="text-lede mt-5 max-w-[50ch]" style={{ color: "var(--ink-soft, rgba(255,253,248,0.82))" }}>
            We are truly honored to see our puppies become cherished members of loving families.
            These heartwarming moments have been shared by our valued clients who welcomed a Teddy
            Pup into their homes and hearts.
          </p>
        </div>

        {review && (
          <figure className="tp-dusk__note">
            <blockquote className="font-plush">“{review.body}”</blockquote>
            <figcaption className="font-scrawl">
              {review.author_name}
              {review.author_location ? `, ${review.author_location}` : ""}
            </figcaption>
          </figure>
        )}

        <div
          id="dusk-guide-stop"
          className="pup-stop tp-dusk__teddy"
          data-pup-stop="true"
          data-pose="sit"
          data-facing="right"
          aria-hidden
        >
          <div className="pup-buddy" data-facing="right" data-live="">
            <Image
              src="/brand/walking-puppy.svg"
              alt=""
              width={160}
              height={128}
              className="h-auto w-full"
            />
          </div>
        </div>
      </div>

      {photos.length > 0 && (
        <div className="tp-photowall">
          <div className="tp-photowall__wall">
            <ul
              ref={listRef}
              className="tp-photowall__prints"
              aria-label="Photos from TeddyPups families"
            >
              {photos.map((photo, i) => (
                <li
                  key={photo.id + i}
                  data-reveal="true"
                  style={{ ["--d" as string]: `${DELAYS[i % DELAYS.length]}ms` }}
                >
                  <button
                    type="button"
                    className="tp-photowall__print"
                    aria-label={`Open photo ${i + 1} of ${photos.length}: ${photo.caption}`}
                    onClick={() => setActive(i)}
                  >
                    <span
                      className="tp-polaroid"
                      style={
                        {
                          ["--tilt"]: TILTS[i % TILTS.length],
                          ["--tape"]: TAPES[i % TAPES.length],
                          ["--i"]: i,
                        } as CSSProperties
                      }
                    >
                      <span aria-hidden className="tp-tape tp-tape--center" />
                      <span className="tp-polaroid__photo">
                        <Image
                          src={photo.url}
                          alt={photo.caption}
                          width={433}
                          height={433}
                          className="h-auto w-full object-cover"
                          sizes="(min-width: 1024px) 18vw, (min-width: 640px) 28vw, 42vw"
                        />
                      </span>
                      <span className="tp-polaroid__caption font-scrawl">{photo.caption}</span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>

            <div className="tp-facade__ground">
              <span aria-hidden className="tp-lamp" />
              <span aria-hidden className="tp-facade__door" />
              <ButtonLink href="/happy-families" className="tp-facade__cta">
                See every happy family
              </ButtonLink>
            </div>
          </div>
        </div>
      )}

      {active !== null && photos[active] && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[80] flex items-center justify-center bg-cocoa/80 p-4"
          onClick={() => setActive(null)}
        >
          <button
            type="button"
            className="absolute right-4 top-4 rounded-full bg-milk p-2 focus-ring"
            aria-label="Close"
            onClick={() => setActive(null)}
          >
            <X />
          </button>
          <div
            className="relative max-h-[85vh] w-full max-w-3xl overflow-hidden rounded-3xl bg-milk"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative aspect-[4/3]">
              <Image
                src={photos[active].url}
                alt={photos[active].caption}
                fill
                className="object-contain"
                sizes="100vw"
              />
            </div>
            <p className="p-4 text-center font-scrawl text-lg text-cocoa">
              {photos[active].caption}
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
