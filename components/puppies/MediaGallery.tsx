"use client";

import Image from "next/image";
import { useState } from "react";
import type { PuppyImage } from "@/lib/types";
import { cn } from "@/lib/utils/cn";

export function MediaGallery({
  media,
  name,
}: {
  media: PuppyImage[];
  name: string;
}) {
  const items = [...media].sort((a, b) => a.sort_order - b.sort_order);
  const [index, setIndex] = useState(0);
  if (!items.length) {
    return (
      <div className="tp-storypage flex aspect-[4/5] items-center justify-center text-cocoa-soft md:aspect-[5/6]">
        No media yet
      </div>
    );
  }
  const current = items[index];
  const prev = () => setIndex((i) => (i - 1 + items.length) % items.length);
  const next = () => setIndex((i) => (i + 1) % items.length);

  return (
    <div>
      <div className="tp-storypage relative aspect-[4/5] md:aspect-[5/6]">
        {current.media_type === "video" ? (
          <video
            key={current.id}
            src={current.url}
            controls
            className="absolute inset-0 size-full object-cover"
            aria-label={`${name}, video ${index + 1} of ${items.length}`}
          />
        ) : (
          <button
            type="button"
            className="absolute inset-0 block size-full"
            aria-label={`Open ${name}, photo ${index + 1} of ${items.length} full screen`}
            onClick={() => window.open(current.url, "_blank")}
          >
            <Image
              src={current.url}
              alt={`${name}, photo ${index + 1} of ${items.length}`}
              fill
              className="object-cover"
              sizes="(min-width: 1024px) 55vw, 92vw"
              priority
            />
          </button>
        )}
        {items.length > 1 && (
          <div className="absolute inset-x-4 bottom-4 flex justify-between">
            <button
              type="button"
              onClick={prev}
              aria-label="Previous photo"
              className="grid size-12 place-items-center rounded-full border-2 border-cocoa bg-milk/95 text-xl font-bold focus-ring"
            >
              ‹
            </button>
            <span className="self-center rounded-full bg-cocoa/80 px-3 py-1 text-sm font-semibold text-milk">
              {index + 1} / {items.length}
            </span>
            <button
              type="button"
              onClick={next}
              aria-label="Next photo"
              className="grid size-12 place-items-center rounded-full border-2 border-cocoa bg-milk/95 text-xl font-bold focus-ring"
            >
              ›
            </button>
          </div>
        )}
      </div>

      {items.length > 1 && (
        <ul
          className="mt-3 flex gap-3 overflow-x-auto px-1 pt-2 pb-2 [scrollbar-width:thin]"
          aria-label={`All photos of ${name}`}
        >
          {items.map((item, i) => (
            <li key={item.id} className="shrink-0">
              <button
                type="button"
                aria-current={i === index ? "true" : undefined}
                aria-label={`${name}, ${item.media_type} ${i + 1} of ${items.length}`}
                onClick={() => setIndex(i)}
                className={cn(
                  "relative block h-24 w-20 overflow-hidden rounded-[0.9rem] border-[3px] transition-transform duration-300 md:h-28 md:w-24",
                  i === index
                    ? "-translate-y-1 -rotate-3 border-toffee-deep"
                    : "border-cocoa/30 hover:-rotate-2 hover:border-cocoa",
                )}
              >
                {item.media_type === "image" ? (
                  <Image src={item.url} alt="" fill className="object-cover" sizes="96px" />
                ) : (
                  <span className="flex h-full items-center justify-center bg-cocoa text-milk">▶</span>
                )}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
