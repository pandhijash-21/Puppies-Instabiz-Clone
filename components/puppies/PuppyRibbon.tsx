"use client";

import { useEffect, useRef } from "react";

/** Left bookmark ribbon — grows downward as the puppy storybook is scrolled. */
export function PuppyRibbon() {
  const bandRef = useRef<HTMLSpanElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const band = bandRef.current;
    const root = rootRef.current;
    if (!band || !root) return;

    const story = root.closest(".tp-storybook") as HTMLElement | null;
    if (!story) return;

    let raf = 0;

    const update = () => {
      raf = 0;
      const rect = story.getBoundingClientRect();
      const total = Math.max(1, story.offsetHeight - window.innerHeight);
      const scrolled = Math.min(total, Math.max(0, -rect.top));
      const p = scrolled / total;
      band.style.transform = `scaleY(${Math.max(0.045, Math.min(1, p))})`;
    };

    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    const lenis = (window as Window & { __tpLenis?: { on: (e: string, cb: () => void) => void; off: (e: string, cb: () => void) => void } }).__tpLenis;
    lenis?.on?.("scroll", onScroll);

    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      lenis?.off?.("scroll", onScroll);
    };
  }, []);

  return (
    <div ref={rootRef} aria-hidden className="tp-ribbon">
      <div className="tp-ribbon__track">
        <span ref={bandRef} className="tp-ribbon__band" />
      </div>
    </div>
  );
}
