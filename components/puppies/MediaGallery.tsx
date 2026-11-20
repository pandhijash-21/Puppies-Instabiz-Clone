"use client";

import Image from "next/image";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { PuppyImage } from "@/lib/types";

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
      <div className="flex aspect-[4/5] items-center justify-center rounded-[2rem] bg-honey-soft/50 text-cocoa-soft">
        No media yet
      </div>
    );
  }
  const current = items[index];
  const prev = () => setIndex((i) => (i - 1 + items.length) % items.length);
  const next = () => setIndex((i) => (i + 1) % items.length);

  return (
    <div>
      <div className="relative overflow-hidden rounded-[2rem] bg-honey-soft/40 shadow-[0_20px_50px_rgba(42,23,14,0.15)]">
        <div className="relative aspect-[4/5]">
          {current.media_type === "video" ? (
            <video
              key={current.id}
              src={current.url}
              controls
              className="h-full w-full object-cover"
              aria-label={`${name}, video ${index + 1} of ${items.length}`}
            />
          ) : (
            <button
              type="button"
              className="relative h-full w-full"
              aria-label={`Open ${name}, photo ${index + 1} of ${items.length} full screen`}
              onClick={() => window.open(current.url, "_blank")}
            >
              <Image
                src={current.url}
                alt={`${name}, photo ${index + 1} of ${items.length}`}
                fill
                className="object-cover"
                sizes="(max-width:1024px) 100vw, 50vw"
                priority
              />
            </button>
          )}
        </div>
        {items.length > 1 && (
          <>
            <button
              type="button"
              onClick={prev}
              aria-label="Previous photo"
              className="absolute bottom-4 left-4 rounded-full bg-milk/90 p-2 shadow focus-ring"
            >
              <ChevronLeft />
            </button>
            <button
              type="button"
              onClick={next}
              aria-label="Next photo"
              className="absolute bottom-4 right-4 rounded-full bg-milk/90 p-2 shadow focus-ring"
            >
              <ChevronRight />
            </button>
            <span className="absolute bottom-5 left-1/2 -translate-x-1/2 rounded-full bg-cocoa/70 px-3 py-1 text-sm text-milk">
              {index + 1} / {items.length}
            </span>
          </>
        )}
      </div>
      {items.length > 1 && (
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {items.map((item, i) => (
            <button
              key={item.id}
              type="button"
              aria-current={i === index ? "true" : undefined}
              aria-label={`${name}, ${item.media_type} ${i + 1} of ${items.length}`}
              onClick={() => setIndex(i)}
              className={`relative h-20 w-16 shrink-0 overflow-hidden rounded-xl border-2 ${
                i === index ? "border-toffee-deep" : "border-transparent"
              }`}
            >
              {item.media_type === "image" ? (
                <Image src={item.url} alt="" fill className="object-cover" sizes="64px" />
              ) : (
                <span className="flex h-full items-center justify-center bg-cocoa text-milk">▶</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
