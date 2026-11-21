"use client";

import Image from "next/image";
import { useId, useState } from "react";
import { howItWorksImported, howItWorksLocal } from "@/content/static";
import { cn } from "@/lib/utils/cn";

const STEP_ICONS = [
  // explore
  <svg key="s1" viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="3">
    <circle cx="28" cy="28" r="14" />
    <path d="M40 40l14 14" strokeLinecap="round" />
    <path d="M24 24c2-3 6-4 9-2" strokeLinecap="round" />
  </svg>,
  // heart
  <svg key="s2" viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="3">
    <path
      d="M32 54C16 43 8 34 8 24c0-7 5.4-12 12-12 5 0 9 3 12 7 3-4 7-7 12-7 6.6 0 12 5 12 12 0 10-8 19-24 30z"
      strokeLinejoin="round"
    />
  </svg>,
  // meet
  <svg key="s3" viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="3">
    <ellipse cx="32" cy="38" rx="16" ry="14" />
    <circle cx="22" cy="22" r="5" />
    <circle cx="32" cy="16" r="5" />
    <circle cx="42" cy="22" r="5" />
  </svg>,
  // truck
  <svg key="s4" viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="3">
    <path d="M6 40V22h28v18" strokeLinejoin="round" />
    <path d="M34 28h14l8 10v10H34V28z" strokeLinejoin="round" />
    <circle cx="18" cy="46" r="5" />
    <circle cx="46" cy="46" r="5" />
  </svg>,
];

const IMPORT_ICONS = [
  <svg key="i1" viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="3">
    <path d="M12 48h40M20 48V20l12-8 12 8v28" strokeLinejoin="round" />
  </svg>,
  <svg key="i2" viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="3">
    <circle cx="32" cy="28" r="12" />
    <path d="M16 52c4-10 12-14 16-14s12 4 16 14" strokeLinecap="round" />
  </svg>,
  <svg key="i3" viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="3">
    <path d="M8 36l20-4 10-14h8l-6 14 14 0 6-6h4l-4 12H12z" strokeLinejoin="round" />
  </svg>,
  <svg key="i4" viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="3">
    <path d="M12 40c0-12 10-20 20-20s20 8 20 20" />
    <path d="M20 40h24v8H20z" strokeLinejoin="round" />
  </svg>,
];

function DubaiPostcard() {
  return (
    <div className="tp-postcard tp-postcard--dubai">
      <p className="absolute left-4 top-3 z-10 font-scrawl text-lg text-toffee-ink">
        Downtown Dubai
      </p>
      <span
        aria-hidden
        className="pointer-events-none absolute right-[12%] top-[10%] size-14 rounded-full"
        style={{
          background:
            "radial-gradient(circle, #f7c66b 0 55%, rgba(247,198,107,0.35) 56%, transparent 72%)",
        }}
      />
      <svg viewBox="0 0 320 180" className="absolute inset-x-0 bottom-0 w-full text-toffee/70" aria-hidden>
        <path
          d="M8 170h304M24 170V120h18v50M52 170V98h22v72M84 170V130h14v40M180 170V48l5-8V18l4-6 4 6v22l5 8v130M140 170V110l16-10v70M210 170V100l18 10v60M240 170V128h22v42M270 170V90h18v80M296 170V140h16v30"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

function ImportPostcard() {
  return (
    <div className="tp-postcard tp-postcard--flight">
      <svg viewBox="0 0 360 200" className="h-full w-full" aria-hidden>
        <path
          d="M40 150 C 110 40, 250 30, 320 110"
          fill="none"
          stroke="var(--color-toffee-deep)"
          strokeWidth="3"
          strokeDasharray="3 10"
          strokeLinecap="round"
        />
        <circle cx="40" cy="150" r="5" fill="var(--color-toffee-deep)" />
        <circle cx="320" cy="110" r="5" fill="var(--color-toffee-deep)" />
        <g transform="translate(175 55) rotate(-28)">
          <path
            d="M-18 0h36l8 6h-10l4 10h-8l-4-10h-18z"
            fill="var(--color-milk)"
            stroke="var(--color-cocoa)"
            strokeWidth="2.5"
          />
          <path d="M-6 -2l8-14h8l-4 14" fill="var(--color-toffee)" stroke="var(--color-cocoa)" strokeWidth="2.5" />
        </g>
        <text x="40" y="180" textAnchor="middle" className="tp-flight__label">
          Europe · Korea
        </text>
        <text x="320" y="140" textAnchor="middle" className="tp-flight__label">
          Dubai
        </text>
      </svg>
    </div>
  );
}

export function TwoWaysHome() {
  const [mode, setMode] = useState<"local" | "imported">("local");
  const uid = useId();
  const localId = `${uid}-local`;
  const importId = `${uid}-imported`;
  const active = mode === "local" ? howItWorksLocal : howItWorksImported;
  const icons = mode === "local" ? STEP_ICONS : IMPORT_ICONS;
  const steps = active.steps;

  return (
    <section
      id="two-ways"
      className="tp-journeys mt-[clamp(3.5rem,8vw,6rem)]"
      aria-labelledby="two-ways-title"
    >
      <div className="grid gap-8 lg:grid-cols-12 lg:items-start">
        <div className="lg:col-span-5">
          <p className="font-scrawl text-lg text-toffee-ink">choose your way</p>
          <h2 id="two-ways-title" className="tp-huge mt-1 text-cocoa">
            Two ways home
          </h2>
        </div>

        <div className="flex flex-wrap items-end gap-4 lg:col-span-7 lg:justify-end">
          <div
            role="tablist"
            aria-label="Ways to bring your puppy home"
            className="tp-switch"
            style={{ ["--at" as string]: mode === "local" ? 0 : 1, ["--n" as string]: 2 }}
          >
            <span aria-hidden className="tp-switch__thumb" />
            <button
              type="button"
              role="tab"
              id={localId}
              aria-selected={mode === "local"}
              aria-controls="panel-local"
              className="tp-switch__tab"
              onClick={() => setMode("local")}
            >
              <span className="font-plush tp-switch__label">In Dubai</span>
              <span className="tp-switch__hint">meet in person</span>
            </button>
            <button
              type="button"
              role="tab"
              id={importId}
              aria-selected={mode === "imported"}
              aria-controls="panel-imported"
              className="tp-switch__tab"
              onClick={() => setMode("imported")}
            >
              <span className="font-plush tp-switch__label">Imported</span>
              <span className="tp-switch__hint">order upon request</span>
            </button>
          </div>
          <div className="hidden w-28 shrink-0 sm:block md:w-32">
            <Image
              src="/brand/walking-puppy.svg"
              alt=""
              width={128}
              height={102}
              className="h-auto w-full drop-shadow-[0_8px_14px_rgba(42,23,14,.2)]"
            />
          </div>
        </div>
      </div>

      <div className="mt-10 grid gap-10 lg:grid-cols-12 lg:items-start">
        <div
          id={mode === "local" ? "panel-local" : "panel-imported"}
          role="tabpanel"
          aria-labelledby={mode === "local" ? localId : importId}
          className="lg:col-span-6"
        >
          <h3 className="font-plush text-[clamp(1.6rem,3vw,2.2rem)] font-bold leading-tight text-cocoa">
            {active.title}
          </h3>
          <p className="mt-4 text-cocoa-soft">{active.body}</p>
          {mode === "imported" ? (
            <p className="mt-3 text-toffee-ink">{howItWorksImported.extra}</p>
          ) : null}
        </div>
        <div className="lg:col-span-6">
          {mode === "local" ? <DubaiPostcard /> : <ImportPostcard />}
        </div>
      </div>

      <ol className="tp-steps">
        {steps.map((step, i) => (
          <li
            key={step.title}
            className={cn("tp-step")}
            style={{ ["--i" as string]: i, ["--tint" as string]: i % 2 ? "#fbe3b4" : "#f9cdbf" }}
          >
            <div className="tp-step__icon">{icons[i]}</div>
            <p className="tp-step__num font-scrawl">Step {i + 1}</p>
            <h4 className="tp-step__title font-plush text-cocoa">{step.title}</h4>
            <p className="tp-step__text">{step.body}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
