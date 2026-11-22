"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, type CSSProperties } from "react";
import { useReducedMotion } from "framer-motion";
import { TeddyFace } from "@/components/brand/TeddyFace";
import type { Puppy } from "@/lib/types";
import { featuredImage, puppyDisplayName } from "@/lib/utils/format";

type HeroPup = Pick<Puppy, "id" | "slug" | "name" | "breed" | "puppy_images">;
type PupState = "idle" | "duck" | "pop";

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
  const [states, setStates] = useState<PupState[]>(() => pups.map(() => "idle"));
  const [showTag, setShowTag] = useState<boolean[]>(() => pups.map(() => false));

  useEffect(() => {
    if (reduceMotion || pups.length === 0) return;

    const timers: number[] = [];
    let alive = true;

    const schedule = (index: number, delay: number) => {
      const id = window.setTimeout(() => {
        if (!alive) return;
        setStates((prev) => {
          const next = [...prev];
          next[index] = "duck";
          return next;
        });
        setShowTag((prev) => {
          const next = [...prev];
          next[index] = false;
          return next;
        });

        const upId = window.setTimeout(() => {
          if (!alive) return;
          setStates((prev) => {
            const next = [...prev];
            next[index] = "pop";
            return next;
          });
          setShowTag((prev) => {
            const next = [...prev];
            next[index] = true;
            return next;
          });

          const clearTag = window.setTimeout(() => {
            if (!alive) return;
            setShowTag((prev) => {
              const next = [...prev];
              next[index] = false;
              return next;
            });
            setStates((prev) => {
              const next = [...prev];
              next[index] = "idle";
              return next;
            });
            schedule(index, 2200 + Math.random() * 4200);
          }, 1600 + Math.random() * 900);
          timers.push(clearTag);
        }, 420 + Math.random() * 280);
        timers.push(upId);
      }, delay);
      timers.push(id);
    };

    pups.forEach((_, i) => {
      schedule(i, 900 + i * 380 + Math.random() * 1600);
    });

    return () => {
      alive = false;
      timers.forEach((t) => window.clearTimeout(t));
    };
  }, [pups.length, reduceMotion]);

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
              <PeekArch
                pup={pup}
                index={i}
                state={states[i] ?? "idle"}
                showBreed={Boolean(showTag[i])}
              />
            </li>
          );
        })}
      </ul>

      {/* Face-only peek (same art as footer) — scroll completes the dog */}
      <div id="hero-teddy-stop" className="tp-hero__teddy" aria-hidden>
        <TeddyFace crop="head" className="tp-hero__teddy-face" />
      </div>

      {/* Paws on the quilt rim — same grip as the footer basket */}
      <svg
        className="tp-hero__paws"
        viewBox="0 0 120 40"
        aria-hidden
        focusable="false"
      >
        <path
          d="M18 28 C18 14 26 6 38 6 C50 6 58 14 58 28 Z M62 28 C62 14 70 6 82 6 C94 6 102 14 102 28 Z"
          fill="#f2be6b"
          stroke="#2a170e"
          strokeWidth="3.2"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        <path
          d="M32 20 v-5 M44 20 v-5 M76 20 v-5 M88 20 v-5"
          stroke="#2a170e"
          strokeWidth="2.3"
          strokeLinejoin="round"
          strokeLinecap="round"
          fill="none"
        />
      </svg>

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

function PeekArch({
  pup,
  index,
  state,
  showBreed,
}: {
  pup: HeroPup;
  index: number;
  state: PupState;
  showBreed: boolean;
}) {
  const img = featuredImage(pup.puppy_images);
  const name = puppyDisplayName(pup);
  const breed = pup.breed || name;

  return (
    <Link
      href={`/puppies/${pup.slug}`}
      className="tp-lineup__pup"
      data-pup-friend="true"
      data-state={state === "idle" ? undefined : state}
      aria-label={`Meet ${name}, ${breed}`}
    >
      <span
        className="tp-lineup__name font-scrawl"
        data-show={showBreed ? "true" : undefined}
      >
        {breed}
      </span>
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
