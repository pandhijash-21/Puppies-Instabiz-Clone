"use client";

import Image from "next/image";
import { useEffect, useId, useRef } from "react";
import { useReducedMotion } from "framer-motion";
import type { Puppy } from "@/lib/types";
import { featuredImage } from "@/lib/utils/format";
import { ButtonLink } from "@/components/ui/Button";

type PathPup = Pick<Puppy, "id" | "slug" | "name" | "breed" | "location_type" | "puppy_images">;

const FLIGHT_PATH = "M40 250 C 170 40, 470 20, 620 168";

export function TwoWaysPaths({ puppies }: { puppies: PathPup[] }) {
  const reduceMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const planeRef = useRef<SVGGElement>(null);
  const clipId = useId().replace(/:/g, "");

  const local = puppies.find((p) => p.location_type === "dubai_showroom") ?? puppies[0];
  const imported =
    puppies.find((p) => p.location_type === "imported") ?? puppies[1] ?? puppies[0];
  const localImg = local ? featuredImage(local.puppy_images) : null;
  const importImg = imported ? featuredImage(imported.puppy_images) : null;

  useEffect(() => {
    const path = pathRef.current;
    const plane = planeRef.current;
    const flight = plane?.ownerSVGElement?.closest(".tp-flight") as HTMLElement | null;
    if (!path || !plane || !flight) return;

    let raf = 0;
    let alive = true;

    const place = () => {
      if (!alive) return;
      const rect = flight.getBoundingClientRect();
      const vh = window.innerHeight;

      // Start only once the flight is well into the viewport; finish near top
      const start = vh * 0.62;
      const end = vh * 0.04;
      let t = (start - rect.top) / Math.max(200, start - end);
      t = Math.min(1, Math.max(0, t));
      if (reduceMotion) t = 0.55;

      const len = path.getTotalLength();
      const dist = t * len;
      const pt = path.getPointAtLength(dist);
      const a = path.getPointAtLength(Math.max(0, dist - 2));
      const b = path.getPointAtLength(Math.min(len, dist + 2));
      const rot = (Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI;
      plane.setAttribute("transform", `translate(${pt.x} ${pt.y}) rotate(${rot})`);
      plane.style.opacity = t < 0.05 && !reduceMotion ? "0" : "1";

      raf = requestAnimationFrame(place);
    };

    raf = requestAnimationFrame(place);
    return () => {
      alive = false;
      cancelAnimationFrame(raf);
    };
  }, [reduceMotion]);

  return (
    <section
      ref={sectionRef}
      id="two-ways"
      data-pup-scene="true"
      data-tone="light"
      className="tp-scene tp-paths"
      style={{ ["--sky-top" as string]: "#fbe3b4", ["--sky-bottom" as string]: "#f7d18d" }}
      aria-labelledby="paths-title"
    >
      <div className="gutter mx-auto max-w-[110rem]">
        <h2 id="paths-title" className="tp-paths__title font-plush text-huge">
          Two ways to meet your puppy
        </h2>

        <div className="tp-fork">
          <div aria-hidden className="tp-fork__post" />

          <article className="tp-way tp-way--left" aria-labelledby="way-local">
            <h3 id="way-local" className="tp-sign tp-sign--left font-plush">
              Puppies in Dubai
            </h3>
            <div className="tp-way__scene" data-pup-look="true">
              <svg viewBox="0 0 300 120" className="tp-way__skyline" aria-hidden>
                <path
                  d="M4 116h292M20 116V78h16v38M44 116V60h18v56M70 116V84h12v32M150 116V36l4-6v-14l3-4 3 4v14l4 6v80M118 116V70l12-8v54M174 116V64l14 8v44M200 116V82h18v34M226 116V56h14v60M248 116V88h22v28"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <figure className="tp-window">
                <span className="tp-window__glass">
                  {localImg ? (
                    <Image
                      src={localImg.url}
                      alt="A tiny apricot teddy bear puppy held up in the TeddyPups showroom"
                      fill
                      className="object-cover"
                      style={{ objectPosition: "54.3% 48.3%" }}
                      sizes="(min-width: 1024px) 16rem, 60vw"
                    />
                  ) : null}
                </span>
                <figcaption className="font-scrawl">In our showroom</figcaption>
              </figure>
            </div>
            <p className="tp-way__text">
              See them, love them, take them home. Come meet our locally available puppies before
              you decide.
            </p>
            <ButtonLink href="/puppies?origin=local">Meet local puppies</ButtonLink>
          </article>

          <article className="tp-way tp-way--right" aria-labelledby="way-imported">
            <h3 id="way-imported" className="tp-sign tp-sign--right font-plush">
              Imported for you
            </h3>
            <div className="tp-way__scene" data-pup-look="true">
              <div className="tp-flight">
                <svg
                  viewBox="0 0 660 300"
                  role="img"
                  aria-label="A plane bringing a Korean Teacup Maltipoo puppy from Korea to Dubai"
                >
                  <defs>
                    <clipPath id={clipId}>
                      <circle r="25" />
                    </clipPath>
                  </defs>
                  <path ref={pathRef} d={FLIGHT_PATH} className="tp-flight__route" />
                  <circle cx="40" cy="250" r="7" className="tp-flight__dot" />
                  <circle cx="620" cy="168" r="7" className="tp-flight__dot" />
                  <text x="40" y="284" textAnchor="middle" className="tp-flight__label">
                    Korea
                  </text>
                  <text x="620" y="202" textAnchor="middle" className="tp-flight__label">
                    Dubai
                  </text>
                  <g
                    ref={planeRef}
                    style={{ opacity: reduceMotion ? 1 : 0 }}
                    transform={reduceMotion ? "translate(330 90) rotate(-20)" : undefined}
                  >
                    <g transform="translate(-126 -78)">
                      <path d="M28 60 L8 26 L34 26 L60 54 Z" className="tp-flight__wing" />
                      <path
                        d="M108 112 L142 156 L172 156 L158 112 Z"
                        className="tp-flight__wing tp-flight__wing--far"
                      />
                      <path
                        d="M20 80 C20 52 52 44 80 44 L168 44 C200 44 224 60 232 80 C224 100 200 112 168 112 L80 112 C52 112 20 104 20 80 Z"
                        className="tp-flight__body"
                      />
                      <path d="M104 44 L138 2 L168 2 L154 44 Z" className="tp-flight__wing" />
                      <path d="M206 64 C215 67 221 73 224 80" className="tp-flight__line" />
                    </g>
                    {importImg ? (
                      <g transform="translate(10 2)">
                        <image
                          href={importImg.url}
                          x="-25"
                          y="-25"
                          width="50"
                          height="50"
                          clipPath={`url(#${clipId})`}
                          preserveAspectRatio="xMidYMid slice"
                        />
                        <circle r="25" className="tp-flight__porthole" />
                      </g>
                    ) : null}
                  </g>
                </svg>
              </div>
            </div>
            <p className="tp-way__text">
              Exclusive Korean teacup puppies, delivered. Order from the world&apos;s most reputable
              breeders and let us handle the import.
            </p>
            <ButtonLink href="/puppies?origin=imported">See imported puppies</ButtonLink>
          </article>

          {/* Landing pad for the scroll buddy — static art hidden like live html[data-pup] */}
          <div
            id="paths-guide-stop"
            className="pup-stop tp-fork__teddy"
            data-pup-stop="true"
            data-pose="sit"
            data-facing="right"
            aria-hidden
          >
            <div className="pup-buddy" data-facing="right" data-live="">
              <Image
                src="/brand/walking-puppy.svg"
                alt=""
                width={200}
                height={160}
                className="h-auto w-full"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
