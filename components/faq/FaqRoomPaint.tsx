"use client";

import { useEffect } from "react";

/** Paints the document brown so milk never peeks beside the FAQ / under the footer hill. */
export function FaqRoomPaint() {
  useEffect(() => {
    const root = document.documentElement;
    root.classList.add("faq-room");
    return () => root.classList.remove("faq-room");
  }, []);

  return null;
}
