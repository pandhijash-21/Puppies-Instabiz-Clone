"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";

/** Hero pup follows you down the homepage as you scroll. */
export function HomeScrollBuddy() {
  const reduceMotion = useReducedMotion();
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [180, 320, 1400, 1700], [0, 1, 1, 0]);
  const y = useTransform(scrollY, [180, 900], [40, 0]);

  return (
    <motion.div
      className="pointer-events-none fixed bottom-5 left-4 z-[66] md:left-6"
      style={{ opacity, y: reduceMotion ? 0 : y }}
    >
      <Link
        href="#meet-pups"
        className="pointer-events-auto block focus-ring rounded-full"
        aria-label="Come meet the pups"
      >
        <motion.div
          animate={reduceMotion ? undefined : { y: [0, -6, 0] }}
          transition={{ duration: 0.65, repeat: Infinity, ease: "easeInOut" }}
        >
          <Image
            src="/brand/walking-puppy.svg"
            alt=""
            width={108}
            height={92}
            className="drop-shadow-[0_12px_18px_rgba(42,23,14,0.25)]"
          />
        </motion.div>
      </Link>
    </motion.div>
  );
}
