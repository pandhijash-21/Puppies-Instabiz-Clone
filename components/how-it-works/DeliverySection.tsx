"use client";

import { useEffect, useRef } from "react";
import { useScroll, useMotionValueEvent } from "framer-motion";
import { deliveryOptions } from "@/content/static";

const PATH = "M40 250 C 170 40, 470 20, 620 168";

function angleAt(path: SVGPathElement, t: number) {
  const len = path.getTotalLength();
  const a = path.getPointAtLength(Math.max(0, t * len - 1));
  const b = path.getPointAtLength(Math.min(len, t * len + 1));
  return (Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI;
}

export function DeliverySection() {
  const sectionRef = useRef<HTMLElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const planeRef = useRef<SVGGElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    // Leaves Korea as the section enters view; lands in Dubai as you finish the section.
    offset: ["start 0.8", "end 0.75"],
  });

  function place(t: number) {
    const path = pathRef.current;
    const plane = planeRef.current;
    if (!path || !plane) return;
    const clamped = Math.min(1, Math.max(0, t));
    const len = path.getTotalLength();
    const pt = path.getPointAtLength(clamped * len);
    const rot = angleAt(path, clamped);
    plane.setAttribute("transform", `translate(${pt.x} ${pt.y}) rotate(${rot})`);
    plane.style.opacity = clamped <= 0.01 ? "0" : "1";
  }

  useMotionValueEvent(scrollYProgress, "change", place);
  useEffect(() => {
    place(scrollYProgress.get());
  }, [scrollYProgress]);

  return (
    <section
      ref={sectionRef}
      id="delivery"
      aria-labelledby="delivery-title"
      className="mt-24 grid items-center gap-10 lg:grid-cols-12"
    >
      <div className="lg:col-span-6">
        <h2 id="delivery-title" className="tp-huge text-cocoa">
          Delivery &amp; collection
        </h2>
        <p className="mt-5 max-w-xl text-base leading-relaxed text-cocoa-soft md:text-lg">
          From a same-day visit in Downtown Dubai to a flight from Korea, every puppy travels
          comfortably and arrives safely.
        </p>
        <ul className="mt-10 grid gap-x-8 gap-y-7 sm:grid-cols-2">
          {deliveryOptions.map((item) => (
            <li key={item.title}>
              <h3 className="font-plush text-[1.3rem] font-bold leading-snug text-cocoa">
                {item.title}
              </h3>
              <p className="mt-1.5 text-cocoa-soft">{item.body}</p>
            </li>
          ))}
        </ul>
      </div>

      <div className="relative h-[clamp(14rem,30vw,22rem)] lg:col-span-6">
        <div className="pointer-events-none absolute inset-x-0 bottom-0 text-toffee/35">
          <svg viewBox="0 0 320 90" className="w-full" aria-hidden>
            <path
              d="M0 90h320M10 90V60h14v30M30 90V48h16v42M54 90V66h10v24M150 90V18l4-6V2l3-3 3 3v10l4 6v68M118 90V52l12-8v46M174 90V44l14 8v38M204 90V62h16v28M228 90V36h12v54M248 90V58h18v32"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <div className="tp-flight">
          <svg
            viewBox="0 0 660 300"
            role="img"
            aria-label="A plane flying puppies from Korea to Dubai"
          >
            <path ref={pathRef} d={PATH} className="tp-flight__route" />
            <circle cx="40" cy="250" r="7" className="tp-flight__dot" />
            <circle cx="620" cy="168" r="7" className="tp-flight__dot" />
            <text x="40" y="284" textAnchor="middle" className="tp-flight__label">
              Korea
            </text>
            <text x="620" y="202" textAnchor="middle" className="tp-flight__label">
              Dubai
            </text>
            <g ref={planeRef} style={{ opacity: 0 }}>
              <g transform="translate(-126 -78)">
                <path d="M28 60 L8 26 L34 26 L60 54 Z" className="tp-flight__wing" />
                <path
                  d="M108 112 L142 156 L172 156 L158 112 Z"
                  className="tp-flight__wing tp-flight__wing--far"
                />
                <path
                  d="M20 80 C20 52 52 44 80 44 L168 44 C200 44 224 60 232 80 C224 100 200 112 168 112 L80 112 C52 112 20 104 20 80 Z"
                  className="tp-flight__body"
                />
                <path d="M104 44 L138 2 L168 2 L154 44 Z" className="tp-flight__wing" />
                <path d="M206 64 C215 67 221 73 224 80" className="tp-flight__line" />
              </g>
            </g>
          </svg>
        </div>
      </div>
    </section>
  );
}
