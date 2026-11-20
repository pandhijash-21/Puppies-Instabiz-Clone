"use client";

import { useEffect, useRef, useState } from "react";

type Paw = {
  id: number;
  x: number;
  y: number;
  rotate: number;
  flip: boolean;
};

const FADE_MS = 900;
const SPAWN_GAP_PX = 32;

export function PawCursor() {
  const [paws, setPaws] = useState<Paw[]>([]);
  const [cursor, setCursor] = useState<{ x: number; y: number; rotate: number } | null>(null);
  const [enabled, setEnabled] = useState(false);
  const lastPos = useRef<{ x: number; y: number } | null>(null);
  const idRef = useRef(0);
  const leftNext = useRef(true);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setEnabled(fine && !reduce);
  }, []);

  useEffect(() => {
    if (!enabled) return;

    const onMove = (e: PointerEvent) => {
      const x = e.clientX;
      const y = e.clientY;
      const prev = lastPos.current;
      const angle =
        prev != null
          ? (Math.atan2(y - prev.y, x - prev.x) * 180) / Math.PI
          : 0;

      setCursor({ x, y, rotate: angle + 20 });

      if (prev) {
        const dist = Math.hypot(x - prev.x, y - prev.y);
        if (dist < SPAWN_GAP_PX) return;
      }
      lastPos.current = { x, y };

      const id = ++idRef.current;
      const paw: Paw = {
        id,
        x,
        y,
        rotate: angle + (leftNext.current ? -16 : 16),
        flip: leftNext.current,
      };
      leftNext.current = !leftNext.current;

      setPaws((list) => [...list.slice(-28), paw]);
      window.setTimeout(() => {
        setPaws((list) => list.filter((p) => p.id !== id));
      }, FADE_MS);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[90]" aria-hidden>
      {paws.map((paw) => (
        <span
          key={paw.id}
          className="paw-print"
          style={{
            left: paw.x,
            top: paw.y,
            transform: `translate(-50%, -50%) rotate(${paw.rotate}deg) scaleX(${paw.flip ? -1 : 1})`,
            animationDuration: `${FADE_MS}ms`,
          }}
        >
          <PawSvg size={18} />
        </span>
      ))}

      {cursor && (
        <span
          className="paw-cursor-main"
          style={{
            left: cursor.x,
            top: cursor.y,
            transform: `translate(-35%, -35%) rotate(${cursor.rotate}deg)`,
          }}
        >
          <PawSvg size={28} />
        </span>
      )}
    </div>
  );
}

function PawSvg({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <ellipse cx="12" cy="15.5" rx="5.2" ry="4.4" />
      <circle cx="6.2" cy="9.2" r="2.2" />
      <circle cx="10.2" cy="6.8" r="2.35" />
      <circle cx="14.8" cy="6.8" r="2.35" />
      <circle cx="18.2" cy="9.2" r="2.2" />
    </svg>
  );
}
