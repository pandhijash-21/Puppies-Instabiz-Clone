"use client";

import { ReactLenis, type LenisRef } from "lenis/react";
import { cancelFrame, frame } from "framer-motion";
import { useEffect, useRef } from "react";

export function LenisProvider({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<LenisRef>(null);

  useEffect(() => {
    function update({ timestamp }: { timestamp: number }) {
      lenisRef.current?.lenis?.raf(timestamp);
    }
    frame.update(update, true);
    return () => cancelFrame(update);
  }, []);

  return (
    <ReactLenis root options={{ autoRaf: false }} ref={lenisRef}>
      {children}
    </ReactLenis>
  );
}
