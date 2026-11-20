"use client";

import { useEffect } from "react";

/** Hides the system cursor on fine pointers when the paw trail is active. */
export function PawCursorBodyClass() {
  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduce) return;
    document.body.classList.add("paw-cursor-active");
    return () => document.body.classList.remove("paw-cursor-active");
  }, []);
  return null;
}
