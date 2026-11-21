"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { useReducedMotion } from "framer-motion";
import type { Puppy } from "@/lib/types";
import { featuredImage, genderLabel, puppyDisplayName } from "@/lib/utils/format";
import { ButtonLink } from "@/components/ui/Button";
import { WalkingPuppy } from "@/components/brand/WalkingPuppy";

const DOOR_COLORS = ["#a24a1a", "#7A3F1D", "#4E2A14", "#9A5530", "#5C331A", "#8B4A24", "#3F2110"];

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

function doorWidthCss(i: number) {
  return (
    [
      "clamp(7.25rem, min(11vw, 16vh), 11.5rem)",
      "clamp(6.5rem, min(9.5vw, 14.5vh), 10.25rem)",
      "clamp(8rem, min(12.5vw, 17.5vh), 12.5rem)",
      "clamp(6.85rem, min(10vw, 15vh), 10.75rem)",
      "clamp(7.75rem, min(11.5vw, 16.5vh), 12rem)",
      "clamp(6.25rem, min(9vw, 14vh), 9.75rem)",
      "clamp(8.15rem, min(12vw, 18vh), 12.75rem)",
      "clamp(7rem, min(10.5vw, 15.5vh), 11.25rem)",
    ][i % 8] ?? "10.5rem"
  );
}

function sameSet(a: Set<string>, b: Set<string>) {
  if (a.size !== b.size) return false;
  for (const id of a) if (!b.has(id)) return false;
  return true;
}

export function MeetPupsDoors({ puppies }: { puppies: DoorPup[] }) {
  const reduceMotion = useReducedMotion();
  const pinRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const teddyRef = useRef<HTMLDivElement>(null);
  const faceRef = useRef<HTMLDivElement>(null);
  const doorRefs = useRef<Map<string, HTMLElement>>(new Map());
  const openRef = useRef<Set<string>>(new Set());
  const lastProgress = useRef(0);
  const [progress, setProgress] = useState(0);
  const [openIds, setOpenIds] = useState<Set<string>>(new Set());
  const [hoverId, setHoverId] = useState<string | null>(null);
  const items = useMemo(() => puppies.slice(0, 12), [puppies]);

  useEffect(() => {
    const pin = pinRef.current;
    const track = trackRef.current;
    const teddy = teddyRef.current;
    const face = faceRef.current;
    if (!pin || !track || !teddy) return;

    const update = () => {
      const rect = pin.getBoundingClientRect();
      const total = Math.max(1, pin.offsetHeight - window.innerHeight);
      const scrolled = Math.min(total, Math.max(0, -rect.top));
      const p = scrolled / total;

      const dp = p - lastProgress.current;
      // Face follows page scroll direction (down=RHS, up=LHS) — same loop as HomeScrollBuddy
      if (face) {
        const dir = document.documentElement.dataset.pupFacing;
        if (dir === "left" || dir === "right") {
          face.style.transform = dir === "left" ? "scaleX(-1)" : "scaleX(1)";
        } else if (dp > 0.001) {
          face.style.transform = "scaleX(1)";
        } else if (dp < -0.001) {
          face.style.transform = "scaleX(-1)";
        }
      }
      if (Math.abs(dp) > 0.002) setProgress(p);
      lastProgress.current = p;

      // Sync opens to the puppy's real X (he stands before door 1)
      const teddyBox = teddy.getBoundingClientRect();
      const walkerX = teddyBox.left + teddyBox.width * 0.55;
      const next = new Set<string>();
      doorRefs.current.forEach((el, id) => {
        const r = el.getBoundingClientRect();
        const center = r.left + r.width / 2;
        const dist = center - walkerX;
        if (dist > -70 && dist < 105) next.add(id);
      });
      if (!sameSet(next, openRef.current)) {
        openRef.current = next;
        setOpenIds(next);
      }

      const maxShift = Math.max(0, track.scrollWidth - window.innerWidth * 0.55);
      track.style.transform = `translate3d(${-p * maxShift}px, 0, 0)`;
      pin.style.setProperty("--floor-x", `${-p * maxShift * 0.35}px`);

      // Keep feet on the floor — only a tiny lean; legs animate via WalkingPuppy
      if (!reduceMotion) {
        const phase = p * Math.PI * 20;
        const lean = Math.sin(phase) * 2;
        teddy.style.transform = `translate3d(${lean}px, 0, 0)`;
      } else {
        teddy.style.transform = "none";
      }

      const pup = teddy.querySelector(".tp-pup") as SVGSVGElement | null;
      if (pup) {
        if (Math.abs(dp) > 0.0006) {
          pup.dataset.gait = "walk";
          const speed = Math.min(1.8, Math.max(0.75, Math.abs(dp) * 140));
          pup.style.setProperty("--pup-stride", `${(0.4 / speed).toFixed(2)}s`);
        } else {
          pup.dataset.gait = "idle";
        }
      }
    };

    let raf = 0;
    let alive = true;
    const tick = () => {
      if (!alive) return;
      update();
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    window.addEventListener("resize", update);
    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", update);
    };
  }, [items.length, reduceMotion]);

  const pinHeight = reduceMotion ? "auto" : `${Math.max(220, 100 + items.length * 55)}vh`;

  return (
    <section
      id="meet-pups"
      ref={pinRef}
      className="tp-scene tp-meet tp-meet--pinned"
      style={{ height: pinHeight }}
      aria-label="Meet the pups"
      data-progress={progress.toFixed(3)}
    >
      <div className="tp-meet__stage">
        <div className="tp-meet__head">
          <div className="tp-meet__copy">
            <h2 className="font-plush tp-meet__title">Meet the pups</h2>
            <p className="tp-meet__sub">
              Real puppies, real photos, looking for their families right now.
            </p>
          </div>
          <ButtonLink href="/puppies" className="tp-meet__cta shrink-0">
            See all available puppies
          </ButtonLink>
        </div>

        <div className="tp-meet__hall">
          <div ref={trackRef} className="tp-meet__track" aria-label="Puppies looking for a family">
            {items.map((pup, i) => {
              const open = openIds.has(pup.id) || hoverId === pup.id;
              const img = featuredImage(pup.puppy_images);
              const name = puppyDisplayName(pup);
              const color = DOOR_COLORS[i % DOOR_COLORS.length];

              return (
                <div
                  key={pup.id}
                  className="tp-door"
                  data-open={open ? "true" : "false"}
                  style={{ "--door-w": doorWidthCss(i), "--door": color } as CSSProperties}
                  ref={(el) => {
                    if (el) doorRefs.current.set(pup.id, el);
                    else doorRefs.current.delete(pup.id);
                  }}
                >
                  <Link
                    href={`/puppies/${pup.slug}`}
                    className="tp-door__link focus-ring"
                    aria-label={`${name}, ${open ? "door open" : "closed door"}`}
                    onMouseEnter={() => setHoverId(pup.id)}
                    onMouseLeave={() => setHoverId((id) => (id === pup.id ? null : id))}
                    onFocus={() => setHoverId(pup.id)}
                    onBlur={() => setHoverId((id) => (id === pup.id ? null : id))}
                  >
                    <span className="tp-door__plate">
                      <span className="font-plush tp-door__name">{name}</span>
                      <span className="tp-door__meta">
                        {pup.breed}, {genderLabel(pup.gender).toLowerCase()}, {pup.age_label}
                        {pup.has_video ? ", with video" : ""}
                      </span>
                    </span>

                    <span className="tp-door__frame">
                      <span className="tp-door__room">
                        {img && (
                          <Image
                            src={img.url}
                            alt=""
                            fill
                            className="object-cover"
                            sizes="(min-width: 1024px) 15rem, 44vw"
                          />
                        )}
                      </span>
                      <span className="tp-door__way" aria-hidden>
                        <span className="tp-door__leaf">
                          <PawPeephole />
                          <span className="tp-door__knob" />
                        </span>
                      </span>
                      <span className="tp-door__tag">Available</span>
                    </span>
                  </Link>
                </div>
              );
            })}

            <div className="tp-door tp-door--all" style={{ "--door-w": "11rem" } as CSSProperties}>
              <Link href="/puppies" className="tp-door__link tp-door__frame--all focus-ring">
                <span className="font-plush tp-door__all">Meet them all</span>
              </Link>
            </div>
          </div>

          {/* Lands before the first door; doors open when they reach him */}
          <div ref={teddyRef} className="tp-meet__teddy" aria-hidden>
            <div ref={faceRef} style={{ transformOrigin: "50% 92%" }}>
              <WalkingPuppy gait="idle" />
            </div>
          </div>

          <div className="tp-meet__floor" aria-hidden />
        </div>
      </div>
    </section>
  );
}

function PawPeephole() {
  return (
    <svg viewBox="0 0 64 64" className="tp-door__peephole" aria-hidden fill="currentColor">
      <ellipse cx="32" cy="42" rx="12" ry="10" />
      <circle cx="18" cy="26" r="5" />
      <circle cx="28" cy="20" r="5.5" />
      <circle cx="40" cy="20" r="5.5" />
      <circle cx="48" cy="26" r="5" />
    </svg>
  );
}
