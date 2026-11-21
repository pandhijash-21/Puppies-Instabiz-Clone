"use client";

import { useEffect, useRef, useState } from "react";

type Paw = {
  id: number;
  x: number;
  y: number;
  size: number;
};

const FADE_MS = 1000;
const SPAWN_GAP_PX = 48;
/** Slight lean to the left — stays fixed, does not follow movement. */
const PAW_TILT = -14;

const FILL = "#d4a04a";
const OUTLINE = "#2a170e";

function isClickable(el: Element | null) {
  if (!el || !(el instanceof Element)) return false;
  return Boolean(
    el.closest(
      'a, button, input, textarea, select, summary, label, [role="button"], [role="link"], [role="menuitem"], [tabindex]:not([tabindex="-1"])',
    ),
  );
}

export function PawCursor() {
  const [paws, setPaws] = useState<Paw[]>([]);
  const [cursor, setCursor] = useState<{ x: number; y: number } | null>(null);
  const [onClickable, setOnClickable] = useState(false);
  const [enabled, setEnabled] = useState(false);
  const lastPos = useRef<{ x: number; y: number } | null>(null);
  const idRef = useRef(0);
  const carry = useRef(0);

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
      setCursor({ x, y });

      const under = document.elementFromPoint(x, y);
      setOnClickable(isClickable(under));

      const prev = lastPos.current;
      if (!prev) {
        lastPos.current = { x, y };
        return;
      }

      const dist = Math.hypot(x - prev.x, y - prev.y);
      carry.current += dist;
      lastPos.current = { x, y };

      while (carry.current >= SPAWN_GAP_PX) {
        carry.current -= SPAWN_GAP_PX;
        const id = ++idRef.current;
        const paw: Paw = {
          id,
          x,
          y,
          size: 15 + (id % 2),
        };

        setPaws((list) => [...list.slice(-16), paw]);
        window.setTimeout(() => {
          setPaws((list) => list.filter((p) => p.id !== id));
        }, FADE_MS);
      }
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [enabled]);

  if (!enabled) return null;

  const fill = onClickable ? OUTLINE : FILL;
  const stroke = onClickable ? FILL : OUTLINE;

  return (
    <div className="pointer-events-none fixed inset-0 z-[90]" aria-hidden>
      {paws.map((paw) => (
        <span
          key={paw.id}
          className="paw-print"
          style={{
            left: paw.x,
            top: paw.y,
            transform: `translate(-50%, -50%) rotate(${PAW_TILT}deg)`,
            animationDuration: `${FADE_MS}ms`,
          }}
        >
          <PawSvg size={paw.size} fill={FILL} stroke={OUTLINE} />
        </span>
      ))}

      {cursor && (
        <span
          className={`paw-cursor-main${onClickable ? " is-hot" : ""}`}
          style={{
            left: cursor.x,
            top: cursor.y,
            transform: `translate(-35%, -35%) rotate(${PAW_TILT}deg)`,
            color: fill,
          }}
        >
          <PawSvg size={40} fill={fill} stroke={stroke} />
        </span>
      )}
    </div>
  );
}

function PawSvg({
  size = 22,
  fill = FILL,
  stroke = OUTLINE,
}: {
  size?: number;
  fill?: string;
  stroke?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={fill}
      stroke={stroke}
      strokeWidth="1.45"
      strokeLinejoin="round"
    >
      <ellipse cx="12" cy="15.5" rx="5.2" ry="4.4" />
      <circle cx="6.2" cy="9.2" r="2.2" />
      <circle cx="10.2" cy="6.8" r="2.35" />
      <circle cx="14.8" cy="6.8" r="2.35" />
      <circle cx="18.2" cy="9.2" r="2.2" />
    </svg>
  );
}
