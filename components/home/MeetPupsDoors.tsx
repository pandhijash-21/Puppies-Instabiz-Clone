"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { Puppy } from "@/lib/types";
import { featuredImage, genderLabel, puppyDisplayName } from "@/lib/utils/format";
import { ButtonLink } from "@/components/ui/Button";

const DOOR_COLORS = ["#7A3F1D", "#4E2A14", "#9A5530", "#5C331A", "#8B4A24", "#3F2110"];

type DoorPup = Pick<
  Puppy,
  | "id"
  | "slug"
  | "name"
  | "breed"
  | "gender"
  | "age_label"
  | "has_video"
  | "puppy_images"
>;

function doorWidth(i: number) {
  return [210, 186, 236, 198, 220, 178, 228, 200][i % 8];
}

export function MeetPupsDoors({ puppies }: { puppies: DoorPup[] }) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const [openIds, setOpenIds] = useState<Set<string>>(new Set());
  const doorRefs = useRef<Map<string, HTMLElement>>(new Map());
  const items = useMemo(() => puppies.slice(0, 10), [puppies]);

  const syncOpenDoors = useCallback(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    // Puppy stands near left of the visible corridor
    const walkerX =
      scroller.getBoundingClientRect().left + Math.min(140, scroller.clientWidth * 0.18);

    const next = new Set<string>();
    doorRefs.current.forEach((el, id) => {
      const rect = el.getBoundingClientRect();
      const center = rect.left + rect.width / 2;
      // Open when walker reaches / passes near the door
      if (center - walkerX < 90 && center - walkerX > -40) {
        next.add(id);
      }
      // Keep recently passed doors open a bit (like the reference showing multiple open)
      if (center < walkerX + 40 && center > walkerX - 280) {
        next.add(id);
      }
    });
    setOpenIds(next);
  }, []);

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    syncOpenDoors();
    scroller.addEventListener("scroll", syncOpenDoors, { passive: true });
    window.addEventListener("resize", syncOpenDoors);
    return () => {
      scroller.removeEventListener("scroll", syncOpenDoors);
      window.removeEventListener("resize", syncOpenDoors);
    };
  }, [syncOpenDoors, items.length]);

  useEffect(() => {
    if (reduceMotion) return;
    const scroller = scrollerRef.current;
    if (!scroller) return;
    let raf = 0;
    let paused = false;
    let resumeId = 0;

    const tick = () => {
      if (!paused) {
        const max = scroller.scrollWidth - scroller.clientWidth;
        if (max > 8) {
          scroller.scrollLeft += 0.65;
          if (scroller.scrollLeft >= max - 2) scroller.scrollLeft = 0;
        }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const pause = () => {
      paused = true;
      window.clearTimeout(resumeId);
    };
    const softResume = () => {
      window.clearTimeout(resumeId);
      resumeId = window.setTimeout(() => {
        paused = false;
      }, 1800);
    };

    scroller.addEventListener("pointerdown", pause);
    scroller.addEventListener("wheel", pause, { passive: true });
    scroller.addEventListener("touchstart", pause, { passive: true });
    scroller.addEventListener("pointerup", softResume);
    scroller.addEventListener("mouseleave", softResume);

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(resumeId);
      scroller.removeEventListener("pointerdown", pause);
      scroller.removeEventListener("wheel", pause);
      scroller.removeEventListener("touchstart", pause);
      scroller.removeEventListener("pointerup", softResume);
      scroller.removeEventListener("mouseleave", softResume);
    };
  }, [reduceMotion]);

  return (
    <section
      id="meet-pups"
      className="tp-scene tp-meet relative overflow-hidden pb-0"
      aria-label="Meet the pups"
    >
      <div className="mx-auto flex max-w-7xl flex-wrap items-end justify-between gap-4 px-4 pt-14 md:px-6 md:pt-20">
        <div className="max-w-xl">
          <h2 className="font-plush text-[clamp(2.2rem,5vw,4rem)] font-extrabold">
            Meet the pups
          </h2>
          <p className="mt-2 text-cocoa-soft">
            Real puppies, real photos, looking for their families right now.
          </p>
        </div>
        <ButtonLink href="/puppies" className="shrink-0">
          See all available puppies
        </ButtonLink>
      </div>

      <div className="relative mt-10 w-full">
        {/* Walking guide — stays in the left of the viewport */}
        <div className="pointer-events-none absolute bottom-[3.4rem] left-[clamp(0.5rem,4vw,2.5rem)] z-40 md:bottom-[3.8rem]">
          <motion.div
            animate={reduceMotion ? undefined : { y: [0, -5, 0], x: [0, 3, 0] }}
            transition={{ duration: 0.55, repeat: Infinity, ease: "easeInOut" }}
          >
            <Image
              src="/brand/walking-puppy.svg"
              alt=""
              width={120}
              height={100}
              className="drop-shadow-[0_10px_16px_rgba(42,23,14,0.28)]"
            />
          </motion.div>
        </div>

        <div
          ref={scrollerRef}
          className="meet-doors-scroll w-full overflow-x-auto pb-1 pt-4"
          tabIndex={0}
          aria-label="Scroll through puppy doors"
        >
          <div className="meet-doors-track flex w-max items-end gap-8 px-[clamp(5rem,18vw,14rem)] md:gap-12">
            {items.map((pup, i) => {
              const width = doorWidth(i);
              const height = Math.round(width * 1.22);
              const open = openIds.has(pup.id);
              const img = featuredImage(pup.puppy_images);
              const name = puppyDisplayName(pup);
              const color = DOOR_COLORS[i % DOOR_COLORS.length];

              return (
                <div
                  key={pup.id}
                  className="relative shrink-0"
                  style={{ width }}
                  ref={(el) => {
                    if (el) doorRefs.current.set(pup.id, el);
                    else doorRefs.current.delete(pup.id);
                  }}
                >
                  <div className="mb-3 min-h-[3.75rem] text-center">
                    <p className="font-plush text-xl font-bold leading-tight text-cocoa md:text-2xl">
                      {name}
                    </p>
                    <p className="mt-1 text-xs text-cocoa-soft md:text-sm">
                      {pup.breed}, {genderLabel(pup.gender).toLowerCase()}, {pup.age_label}
                      {pup.has_video ? ", with video" : ""}
                    </p>
                  </div>

                  <Link
                    href={`/puppies/${pup.slug}`}
                    className="relative block focus-ring"
                    style={{ height, perspective: 1000 }}
                    aria-label={`${name}, ${open ? "door open" : "closed door"}`}
                  >
                    <span className="absolute -right-1 top-3 z-30 rounded-full bg-milk px-3 py-1 text-[11px] font-semibold text-cocoa shadow">
                      Available
                    </span>

                    <span
                      className="absolute inset-0 overflow-hidden bg-[#f0d7b8]"
                      style={{ borderRadius: "999px 999px 22px 22px" }}
                    >
                      {img && (
                        <Image
                          src={img.url}
                          alt=""
                          fill
                          className="object-cover"
                          sizes="240px"
                        />
                      )}
                    </span>

                    <motion.span
                      className="meet-door-panel absolute inset-0 origin-left"
                      style={{
                        background: color,
                        borderRadius: "999px 999px 22px 22px",
                        transformStyle: "preserve-3d",
                      }}
                      animate={{ rotateY: open ? -82 : 0 }}
                      transition={{ type: "spring", stiffness: 180, damping: 20 }}
                    >
                      <span className="absolute left-1/2 top-[20%] flex h-11 w-11 -translate-x-1/2 items-center justify-center rounded-full bg-[#fff8ef] text-cocoa shadow-inner">
                        <PawMini />
                      </span>
                      <span className="absolute right-[16%] top-[48%] h-3.5 w-3.5 rounded-full bg-[#E8C36A] shadow-[inset_0_0_0_2px_rgba(0,0,0,.12)]" />
                    </motion.span>
                  </Link>
                </div>
              );
            })}

            <div className="flex h-56 w-44 shrink-0 items-center justify-center pb-8">
              <ButtonLink href="/puppies" variant="ghost">
                Meet them all
              </ButtonLink>
            </div>
          </div>
        </div>

        <div className="meet-floor relative z-20">
          <div className="meet-floor__line" />
          <div className="meet-floor__planks" />
        </div>
      </div>
    </section>
  );
}

function PawMini() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <ellipse cx="12" cy="15.5" rx="5" ry="4.2" />
      <circle cx="6.5" cy="9.5" r="2" />
      <circle cx="10.5" cy="7.2" r="2.1" />
      <circle cx="14.5" cy="7.2" r="2.1" />
      <circle cx="18" cy="9.5" r="2" />
    </svg>
  );
}
