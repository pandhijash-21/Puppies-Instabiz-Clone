"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";

/**
 * Cute walking pup stays with you as you scroll (fixed to the viewport).
 */
export function SiteMascot() {
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();

  if (pathname.startsWith("/admin") || pathname === "/") {
    // Home has its own hero + corridor walkers; avoid stacking three dogs
    return null;
  }

  return (
    <motion.div
      className="fixed bottom-4 left-4 z-[65] hidden md:block"
      initial={reduceMotion ? false : { y: 40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
    >
      <Link
        href="/puppies"
        className="block focus-ring rounded-full"
        aria-label="Teddy is with you — see available puppies"
      >
        <motion.div
          animate={reduceMotion ? undefined : { y: [0, -6, 0] }}
          transition={{ duration: 0.7, repeat: Infinity, ease: "easeInOut" }}
        >
          <Image
            src="/brand/walking-puppy.svg"
            alt=""
            width={96}
            height={82}
            className="drop-shadow-[0_10px_16px_rgba(42,23,14,0.22)]"
          />
        </motion.div>
      </Link>
    </motion.div>
  );
}
