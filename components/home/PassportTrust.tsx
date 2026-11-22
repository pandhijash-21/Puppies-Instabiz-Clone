"use client";

import Image from "next/image";
import { useEffect, useRef, type CSSProperties } from "react";
import { trustPoints } from "@/content/static";

const STAMPS = [
  {
    cls: "tp-stamp--round",
    tilt: "-8deg",
    color: "#a24a1a",
    icon: (
      <svg viewBox="0 0 64 64" className="tp-stamp__icon" aria-hidden>
        <path
          d="M32 54C16 43 8 34 8 24c0-7 5.4-12 12-12 5 0 9 3 12 7 3-4 7-7 12-7 6.6 0 12 5 12 12 0 10-8 19-24 30z"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M22 30h7l3-7 4 13 3-6h7"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    cls: "tp-stamp--ticket",
    tilt: "5deg",
    color: "#1f6b45",
    icon: (
      <svg viewBox="0 0 64 64" className="tp-stamp__icon" aria-hidden>
        <path
          d="M6 36l22-3 12-17h6l-6 17 12-1 6-7h3l-2 10 2 10h-3l-6-7-12-1 6 17h-6L28 37 6 36z"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M8 50c10 4 20 4 30 0"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="2 7"
        />
      </svg>
    ),
  },
  {
    cls: "tp-stamp--oval",
    tilt: "-4deg",
    color: "#5a3a28",
    icon: (
      <svg viewBox="0 0 64 64" className="tp-stamp__icon" aria-hidden>
        <path
          d="M10 14h44v28H30l-12 10v-10h-8z"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M22 28h0M32 28h0M42 28h0"
          fill="none"
          stroke="currentColor"
          strokeWidth="5"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    cls: "tp-stamp--scallop",
    tilt: "7deg",
    color: "#c2622b",
    icon: (
      <svg viewBox="0 0 64 64" className="tp-stamp__icon" aria-hidden>
        <circle
          cx="32"
          cy="32"
          r="22"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
        />
        <path
          d="M10 32h44M32 10c-8 8-8 36 0 44M32 10c8 8 8 36 0 44"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
] as const;

export function PassportTrust() {
  const entryRefs = useRef<(HTMLLIElement | null)[]>([]);

  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const entries = entryRefs.current.filter(Boolean) as HTMLLIElement[];
    if (!section || !entries.length) return;

    let raf = 0;
    let alive = true;
    let maxShown = -1;

    const thresholds = [0.08, 0.3, 0.52, 0.74];

    const tick = () => {
      if (!alive) return;
      const vh = window.innerHeight;
      const rect = section.getBoundingClientRect();
      // Map stamp reveals across the full passport travel (enter → nearly leave)
      const start = vh * 0.88;
      const end = vh * 0.08;
      const span = Math.max(vh * 1.15, start - end + rect.height * 0.35);
      const p = Math.min(1, Math.max(0, (start - rect.top) / span));
      let next = -1;
      for (let i = 0; i < thresholds.length; i++) {
        if (p >= thresholds[i]) next = i;
      }
      if (next > maxShown) {
        for (let i = maxShown + 1; i <= next; i++) {
          entries[i].dataset.show = "true";
        }
        maxShown = next;
      }
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => {
      alive = false;
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="trust-passport"
      data-pup-scene="true"
      data-tone="light"
      className="tp-scene tp-passport"
      style={{ ["--sky-top" as string]: "#f0b866", ["--sky-bottom" as string]: "#a65a30" }}
      aria-labelledby="trust-title"
    >
      <div className="gutter mx-auto max-w-[96rem]">
        <div className="tp-book">
          <div className="tp-book__page tp-book__page--left">
            <p aria-hidden className="tp-book__kicker font-scrawl">
              puppy passport
            </p>
            <h2 id="trust-title" className="font-plush tp-book__title">
              Why families trust TeddyPups
            </h2>

            <div
              id="passport-guide-stop"
              className="pup-stop tp-book__teddy"
              data-pup-stop="true"
              data-pose="sit"
              data-facing="right"
              aria-hidden
            >
              <div className="pup-buddy" data-facing="right" data-live="">
                <Image
                  src="/brand/walking-puppy.svg"
                  alt=""
                  width={176}
                  height={140}
                  className="h-auto w-full"
                />
              </div>
            </div>
          </div>

          <ul className="tp-book__page tp-book__page--right">
            {trustPoints.map((item, i) => {
              const stamp = STAMPS[i] ?? STAMPS[0];
              return (
                <li
                  key={item.title}
                  ref={(el) => {
                    entryRefs.current[i] = el;
                  }}
                  className="tp-entry"
                  style={
                    {
                      ["--ink-stamp"]: stamp.color,
                      ["--tilt"]: stamp.tilt,
                      ["--i"]: i,
                    } as CSSProperties
                  }
                >
                  <span className={`tp-stamp ${stamp.cls}`}>
                    {stamp.icon}
                    <span className="tp-stamp__title font-plush">{item.title}</span>
                  </span>
                  <p className="tp-entry__text">{item.body}</p>
                </li>
              );
            })}
          </ul>
        </div>

        <div aria-hidden className="tp-horizon">
          <span className="tp-horizon__sun" />
          <svg
            viewBox="0 0 1440 160"
            preserveAspectRatio="none"
            className="tp-horizon__city"
          >
            <path d="M0 160V118h34v-14h22v-22h30v34h18V96h26v30h22v-18h16v-30h34v40h20V70h28v56h24V98h18v-26h30v54h20v-38h26v-40l14-6 14 6v40h22v46h18V84h26v-30h22v50h24V76h36v50h20V96h18v-58h30v44h14V96h22v-30h16v22h26v-52l6-8v-24l4-6v-30l3-18 3 18v30l4 6v24l6 8v52h26v30h22V82h30v-20h24v48h20V90h28v-36h26v56h18V74h30v36h22V94h26v-24h30v62h20V102h26v20h34v38z" />
          </svg>
        </div>
      </div>
    </section>
  );
}
