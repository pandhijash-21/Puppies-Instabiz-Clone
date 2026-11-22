"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import { WalkingPuppy } from "@/components/brand/WalkingPuppy";

/**
 * Cute walking pup stays with you as you scroll (fixed to the viewport).
 */
export function SiteMascot() {
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();

  if (
    pathname.startsWith("/admin") ||
    pathname === "/" ||
    pathname.startsWith("/happy-families") ||
    pathname.startsWith("/puppies/")
  ) {
    // Home / families / puppy storybook already have dedicated art in-flow
    return null;
  }

  return (
    <motion.div
      className="fixed bottom-4 left-4 z-[65] hidden w-[6.25rem] md:block"
      initial={reduceMotion ? false : { y: 40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
    >
      <Link
        href="/puppies"
        className="block focus-ring"
        aria-label="Teddy is with you — see available puppies"
        style={{ borderRadius: "1rem" }}
      >
        <WalkingPuppy gait={reduceMotion ? "idle" : "walk"} />
      </Link>
    </motion.div>
  );
}
