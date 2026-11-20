"use client";

import Image from "next/image";
import { useState } from "react";
import { X } from "lucide-react";
import type { Family } from "@/lib/types";

export function FamilyMosaic({ families }: { families: Family[] }) {
  const [active, setActive] = useState<number | null>(null);
  const photos = families.flatMap((f) =>
    (f.family_images || []).map((img) => ({
      ...img,
      caption: f.caption || f.title,
    })),
  );

  return (
    <>
      <ul className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
        {photos.map((photo, i) => (
          <li key={photo.id}>
            <button
              type="button"
              className="group relative aspect-square w-full overflow-hidden rounded-2xl focus-ring"
              aria-label={`Open photo ${i + 1} of ${photos.length}: ${photo.caption}`}
              onClick={() => setActive(i)}
            >
              <Image
                src={photo.url}
                alt={photo.caption}
                fill
                className="object-cover transition duration-500 group-hover:scale-105"
                sizes="(max-width:768px) 50vw, 25vw"
              />
            </button>
          </li>
        ))}
      </ul>

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
            <p className="p-4 text-center font-scrawl text-lg">{photos[active].caption}</p>
          </div>
        </div>
      )}
    </>
  );
}
