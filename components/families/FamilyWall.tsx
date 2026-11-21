"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { X } from "lucide-react";
import type { Family } from "@/lib/types";

type Photo = {
  id: string;
  url: string;
  caption: string;
  rotate: number;
  shiftY: number;
  tape: "peach" | "sky" | "clear";
  widthClass: "sm" | "md" | "lg";
};

const LAYOUT: Array<Pick<Photo, "rotate" | "shiftY" | "tape" | "widthClass">> = [
  { rotate: -2.5, shiftY: 4, tape: "peach", widthClass: "md" },
  { rotate: 2, shiftY: 12, tape: "sky", widthClass: "lg" },
  { rotate: -1.5, shiftY: 0, tape: "clear", widthClass: "md" },
  { rotate: 2.5, shiftY: 10, tape: "peach", widthClass: "sm" },
  { rotate: -2, shiftY: 6, tape: "sky", widthClass: "lg" },
  { rotate: 1.5, shiftY: 14, tape: "clear", widthClass: "md" },
  { rotate: -2.5, shiftY: 2, tape: "peach", widthClass: "sm" },
  { rotate: 2, shiftY: 8, tape: "sky", widthClass: "md" },
  { rotate: -1, shiftY: 12, tape: "clear", widthClass: "lg" },
  { rotate: 2.5, shiftY: 4, tape: "peach", widthClass: "md" },
  { rotate: -2, shiftY: 10, tape: "sky", widthClass: "sm" },
  { rotate: 1.5, shiftY: 6, tape: "clear", widthClass: "md" },
];

export function FamilyWall({ families }: { families: Family[] }) {
  const [active, setActive] = useState<number | null>(null);
  const photos: Photo[] = families.flatMap((f, fi) =>
    (f.family_images || []).map((img, ii) => {
      const layout = LAYOUT[(fi + ii) % LAYOUT.length];
      return {
        id: img.id,
        url: img.url,
        caption: f.caption || f.title,
        ...layout,
      };
    }),
  );

  return (
    <>
      <ul className="families-wall">
        {photos.map((photo, i) => (
          <li
            key={photo.id}
            className={`families-wall__item families-wall__item--${photo.widthClass}`}
            style={
              {
                "--rot": `${photo.rotate}deg`,
                "--shift-y": `${photo.shiftY}px`,
              } as CSSProperties
            }
          >
            <Polaroid
              photo={photo}
              index={i}
              onOpen={() => setActive(i)}
            />
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
            <div className="relative flex max-h-[70vh] items-center justify-center bg-honey-soft/30 p-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={photos[active].url}
                alt={photos[active].caption}
                className="max-h-[66vh] w-auto max-w-full object-contain"
              />
            </div>
            <p className="p-4 text-center font-scrawl text-lg">
              {photos[active].caption}
            </p>
          </div>
        </div>
      )}
    </>
  );
}

function Polaroid({
  photo,
  index,
  onOpen,
}: {
  photo: Photo;
  index: number;
  onOpen: () => void;
}) {
  const ref = useRef<HTMLButtonElement>(null);
  const [tapeState, setTapeState] = useState<"idle" | "paw" | "tape">("idle");
  const [ratio, setRatio] = useState(1);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setTapeState("tape");
      return;
    }

    let pawTimer: number | undefined;
    let tapeTimer: number | undefined;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        io.disconnect();
        const stagger = 90 * (index % 5);
        pawTimer = window.setTimeout(() => setTapeState("paw"), 80 + stagger);
        tapeTimer = window.setTimeout(() => setTapeState("tape"), 720 + stagger);
      },
      { threshold: 0.28, rootMargin: "0px 0px -8% 0px" },
    );

    io.observe(el);
    return () => {
      io.disconnect();
      if (pawTimer) window.clearTimeout(pawTimer);
      if (tapeTimer) window.clearTimeout(tapeTimer);
    };
  }, [index]);

  return (
    <button
      ref={ref}
      type="button"
      className="polaroid focus-ring"
      aria-label={`Open photo: ${photo.caption}`}
      onClick={onOpen}
    >
      <span className={`polaroid__pin polaroid__pin--${tapeState}`} aria-hidden>
        <span className="polaroid__paw">
          <PinPaw />
        </span>
        <span className={`polaroid__tape polaroid__tape--${photo.tape}`} />
      </span>

      <span className="polaroid__frame">
        <span
          className="polaroid__photo"
          style={{ aspectRatio: String(ratio) } as CSSProperties}
        >
          <Image
            src={photo.url}
            alt=""
            fill
            className="object-cover"
            sizes="(max-width:768px) 70vw, 280px"
            onLoadingComplete={(img) => {
              if (img.naturalWidth > 0 && img.naturalHeight > 0) {
                setRatio(img.naturalWidth / img.naturalHeight);
              }
            }}
          />
        </span>
        <span className="polaroid__caption font-scrawl">{photo.caption}</span>
        <span className="polaroid__stamp" aria-hidden>
          <PinPaw />
        </span>
      </span>
    </button>
  );
}

function PinPaw() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden>
      <ellipse cx="12" cy="15.5" rx="5.2" ry="4.4" />
      <circle cx="6.2" cy="9.2" r="2.2" />
      <circle cx="10.2" cy="6.8" r="2.35" />
      <circle cx="14.8" cy="6.8" r="2.35" />
      <circle cx="18.2" cy="9.2" r="2.2" />
    </svg>
  );
}
