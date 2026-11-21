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

    const sync = () => {
      const lenis = lenisRef.current?.lenis;
      if (lenis) {
        (window as Window & { __tpLenis?: typeof lenis }).__tpLenis = lenis;
      }
    };
    sync();
    const id = window.setInterval(sync, 500);

    return () => {
      cancelFrame(update);
      window.clearInterval(id);
      delete (window as Window & { __tpLenis?: unknown }).__tpLenis;
    };
  }, []);

  return (
    <ReactLenis root options={{ autoRaf: false }} ref={lenisRef}>
      {children}
    </ReactLenis>
  );
}
