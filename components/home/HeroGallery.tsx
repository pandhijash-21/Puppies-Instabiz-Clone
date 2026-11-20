"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import type { Puppy } from "@/lib/types";
import { featuredImage, puppyDisplayName } from "@/lib/utils/format";

type HeroPup = Pick<Puppy, "id" | "slug" | "name" | "breed" | "puppy_images">;

/** How far each circle sits into the fence (px). Lower = more peek-a-boo. */
const PEEK_OFFSETS = [78, 36, 52, 28, 60, 34, 70, 42];

export function HeroGallery({ puppies }: { puppies: HeroPup[] }) {
  const reduceMotion = useReducedMotion();
  const pups = puppies.slice(0, 8);
  const mid = Math.ceil(pups.length / 2);
  const left = pups.slice(0, mid);
  const right = pups.slice(mid);

  return (
    <div className="hero-gallery relative w-screen left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] mt-6 md:mt-10">
      <div className="relative z-10 mx-auto flex max-w-[1400px] items-end justify-between gap-1 px-3 sm:gap-2 md:px-8 lg:gap-3">
        <div className="flex flex-1 items-end justify-end gap-2 md:gap-3 lg:gap-4">
          {left.map((pup, i) => (
            <PeekCircle
              key={pup.id}
              pup={pup}
              index={i}
              offset={PEEK_OFFSETS[i % PEEK_OFFSETS.length]}
              showLabel={i === Math.max(0, left.length - 1)}
            />
          ))}
        </div>

        <motion.div
          className="relative z-30 mb-2 w-[7rem] shrink-0 sm:w-36 md:mb-3 md:w-44 lg:w-52"
          aria-hidden
          animate={reduceMotion ? undefined : { y: [0, -10, 0] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        >
          <Image
            src="/brand/walking-puppy.svg"
            alt=""
            width={240}
            height={200}
            className="h-auto w-full drop-shadow-[0_18px_28px_rgba(42,23,14,0.2)]"
            priority
          />
        </motion.div>

        <div className="flex flex-1 items-end justify-start gap-2 md:gap-3 lg:gap-4">
          {right.map((pup, i) => (
            <PeekCircle
              key={pup.id}
              pup={pup}
              index={i + mid}
              offset={PEEK_OFFSETS[(i + mid) % PEEK_OFFSETS.length]}
              showLabel={false}
            />
          ))}
        </div>
      </div>

      <div className="hero-fence pointer-events-none relative z-20 -mt-[2.75rem] h-[5.25rem] md:-mt-14 md:h-[6.25rem]">
        <div className="hero-fence__scallop" />
        <div className="hero-fence__body" />
      </div>
    </div>
  );
}

function PeekCircle({
  pup,
  index,
  offset,
  showLabel,
}: {
  pup: HeroPup;
  index: number;
  offset: number;
  showLabel: boolean;
}) {
  const img = featuredImage(pup.puppy_images);
  const name = puppyDisplayName(pup);
  const size = index % 3 === 0 ? 92 : index % 2 === 0 ? 108 : 100;

  return (
    <Link
      href={`/puppies/${pup.slug}`}
      className="hero-peek relative shrink-0"
      style={{
        width: size,
        height: size,
        marginBottom: -offset,
        zIndex: 12,
      }}
      aria-label={`Meet ${name}, ${pup.breed}`}
    >
      {showLabel && (
        <span className="absolute -top-3 left-1/2 z-10 -translate-x-1/2 rounded-full bg-milk px-2 py-0.5 text-[10px] font-semibold text-cocoa shadow md:text-xs">
          {name}
        </span>
      )}
      <span className="hero-peek__frame absolute inset-0 overflow-hidden">
        {img ? (
          <Image
            src={img.url}
            alt=""
            fill
            className="object-cover object-top"
            sizes="120px"
            priority={index < 4}
          />
        ) : (
          <span className="flex h-full items-center justify-center bg-honey-soft">♥</span>
        )}
      </span>
    </Link>
  );
}
