"use client";

import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import { useReducedMotion } from "framer-motion";
import { TeddyFace } from "@/components/brand/TeddyFace";
import type { Puppy } from "@/lib/types";
import { featuredImage, puppyDisplayName } from "@/lib/utils/format";

type HeroPup = Pick<Puppy, "id" | "slug" | "name" | "breed" | "puppy_images">;

/** Absolute seats: left trio + right trio, center reserved for Teddy. */
const SEATS: Array<{ x: string; w: string; peek: number; tilt: string }> = [
  { x: "9%", w: "8.6rem", peek: 0.62, tilt: "-5deg" },
  { x: "22.5%", w: "10.4rem", peek: 0.8, tilt: "3deg" },
  { x: "34.5%", w: "9.2rem", peek: 0.7, tilt: "-2deg" },
  { x: "65.5%", w: "9.2rem", peek: 0.7, tilt: "2deg" },
  { x: "77.5%", w: "10.4rem", peek: 0.8, tilt: "-3deg" },
  { x: "91%", w: "8.6rem", peek: 0.62, tilt: "5deg" },
];

export function HeroGallery({ puppies }: { puppies: HeroPup[] }) {
  const reduceMotion = useReducedMotion();
  const pups = puppies.slice(0, 6);

  return (
    <div className="tp-hero__stage" data-reduce={reduceMotion ? "true" : undefined}>
      <ul className="tp-lineup" aria-label="Some of the puppies in our showroom">
        {pups.map((pup, i) => {
          const seat = SEATS[i] ?? SEATS[SEATS.length - 1];
          return (
            <li
              key={pup.id}
              className="tp-lineup__seat"
              style={
                {
                  "--x": seat.x,
                  "--w": seat.w,
                  "--peek": seat.peek,
                  "--tilt": seat.tilt,
                  "--i": i,
                } as CSSProperties
              }
            >
              <PeekArch pup={pup} index={i} />
            </li>
          );
        })}
      </ul>

      {/* Face-only peek (same art as footer) — scroll completes the dog */}
      <div id="hero-teddy-stop" className="tp-hero__teddy" aria-hidden>
        <TeddyFace crop="head" className="tp-hero__teddy-face" />
      </div>

      <div className="tp-quilt" aria-hidden>
        <svg
          className="tp-quilt__edge"
          viewBox="0 0 1200 40"
          preserveAspectRatio="none"
          aria-hidden
        >
          <path
            d="M0 40 V22 Q20 2 40 22 Q60 2 80 22 Q100 2 120 22 Q140 2 160 22 Q180 2 200 22 Q220 2 240 22 Q260 2 280 22 Q300 2 320 22 Q340 2 360 22 Q380 2 400 22 Q420 2 440 22 Q460 2 480 22 Q500 2 520 22 Q540 2 560 22 Q580 2 600 22 Q620 2 640 22 Q660 2 680 22 Q700 2 720 22 Q740 2 760 22 Q780 2 800 22 Q820 2 840 22 Q860 2 880 22 Q900 2 920 22 Q940 2 960 22 Q980 2 1000 22 Q1020 2 1040 22 Q1060 2 1080 22 Q1100 2 1120 22 Q1140 2 1160 22 Q1180 2 1200 22 V40 Z"
            fill="#f4e6d2"
          />
          <path
            d="M8 16 H1192"
            stroke="rgba(90,58,40,0.35)"
            strokeWidth="1.2"
            strokeDasharray="4 6"
            fill="none"
          />
        </svg>
      </div>
    </div>
  );
}

function PeekArch({ pup, index }: { pup: HeroPup; index: number }) {
  const img = featuredImage(pup.puppy_images);
  const name = puppyDisplayName(pup);

  return (
    <Link
      href={`/puppies/${pup.slug}`}
      className="tp-lineup__pup"
      aria-label={`Meet ${name}, ${pup.breed}`}
    >
      {index === 1 || index === 2 ? (
        <span className="tp-lineup__name">{name}</span>
      ) : null}
      <span className="tp-lineup__photo">
        {img ? (
          <Image
            src={img.url}
            alt=""
            fill
            className="object-cover object-top"
            sizes="11rem"
            priority={index < 4}
          />
        ) : (
          <span className="flex h-full items-center justify-center bg-honey-soft text-2xl">♥</span>
        )}
      </span>
    </Link>
  );
}
