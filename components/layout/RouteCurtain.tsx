"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useLayoutEffect, useRef, type CSSProperties } from "react";
import { CurtainRunner } from "@/components/layout/CurtainRunner";

type CurtainState = "idle" | "intro" | "covering" | "covered" | "snap" | "lifting";

const PRINTS: [number, number, number][] = [
  [8, 6, -76],
  [26, -4, -84],
  [44, 7, -72],
  [62, -3, -86],
  [80, 6, -74],
];

const PAW_PATH =
  "M32 30.5c-7.6 0-15.6 8.3-15.6 15.5 0 5.4 4.2 8.3 9.2 8.3 2.6 0 4.5-1.1 6.4-1.1s3.8 1.1 6.4 1.1c5 0 9.2-2.9 9.2-8.3 0-7.2-8-15.5-15.6-15.5zM19.28 26.71C21.07 30.08 20.42 33.92 17.84 35.29C15.25 36.67 11.71 35.05 9.92 31.69C8.13 28.32 8.78 24.48 11.36 23.11C13.95 21.73 17.49 23.35 19.28 26.71ZM29.62 15.64C30.32 19.62 28.46 23.26 25.47 23.79C22.48 24.32 19.48 21.53 18.78 17.56C18.08 13.58 19.94 9.94 22.93 9.41C25.92 8.88 28.92 11.67 29.62 15.64ZM45.22 17.56C44.52 21.53 41.52 24.32 38.53 23.79C35.54 23.26 33.68 19.62 34.38 15.64C35.08 11.67 38.08 8.88 41.07 9.41C44.06 9.94 45.92 13.58 45.22 17.56ZM54.08 31.69C52.29 35.05 48.75 36.67 46.16 35.29C43.58 33.92 42.93 30.08 44.72 26.71C46.51 23.35 50.05 21.73 52.64 23.11C55.22 24.48 55.87 28.32 54.08 31.69Z";

const SKIP =
  /^\/(admin|api|media|_next)(\/|$)/;

function prefersReducedMotion() {
  return typeof window !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function restAnimationTime() {
  const anim = document
    .querySelector(".tp-curtain")
    ?.getAnimations()
    .find((a) => "animationName" in a && a.animationName === "tp-curtain-rest");
  if (anim && anim.playState !== "finished" && typeof anim.currentTime === "number") {
    return anim.currentTime;
  }
  return Number.POSITIVE_INFINITY;
}

function ScallopEdge({ side }: { side: "top" | "bottom" }) {
  return (
    <svg
      className={`tp-curtain__edge tp-curtain__edge--${side}`}
      width="100%"
      height="40"
      preserveAspectRatio="none"
      aria-hidden
    >
      {side === "top" ? (
        <defs>
          <pattern
            id="tp-curtain-scallop"
            width="76"
            height="40"
            patternUnits="userSpaceOnUse"
          >
            <path d="M0 40V27A38 25 0 0 1 76 27V40Z" fill="#fbe3b4" />
            <path
              d="M0 27A38 25 0 0 1 76 27"
              fill="none"
              stroke="#2a170e"
              strokeWidth="3"
            />
            <path
              d="M11 33A27 19 0 0 1 65 33"
              fill="none"
              stroke="#2a170e"
              strokeWidth="1.6"
              strokeDasharray="3.5 5.5"
              strokeLinecap="round"
              opacity="0.42"
            />
          </pattern>
        </defs>
      ) : null}
      <rect width="100%" height="40" fill="url(#tp-curtain-scallop)" />
    </svg>
  );
}

export function RouteCurtain() {
  const router = useRouter();
  const pathname = usePathname();
  const rootRef = useRef<HTMLDivElement>(null);
  const pendingHref = useRef<string | null>(null);
  const coveredAt = useRef(0);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const pathRef = useRef(pathname);
  const focusMain = useRef(false);
  const liftRef = useRef(() => {});

  useLayoutEffect(() => {
    if (prefersReducedMotion()) return;
    if (SKIP.test(pathname)) return;
    const root = rootRef.current;
    if (root?.dataset.state === "intro") {
      document.documentElement.dataset.curtain = "intro";
    }
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const html = document.documentElement;

    const clearTimers = () => {
      timers.current.forEach(clearTimeout);
      timers.current = [];
    };
    const later = (fn: () => void, ms: number) => {
      timers.current.push(setTimeout(fn, ms));
    };
    const setState = (state: CurtainState) => {
      root.dataset.state = state;
      if (state === "idle") delete html.dataset.curtain;
      else html.dataset.curtain = state;
    };

    const lift = () => {
      if (root.dataset.state === "idle" || root.dataset.state === "lifting") return;
      clearTimers();
      pendingHref.current = null;
      setState("lifting");
      dispatchEvent(new Event("tp:arrived"));
      if (focusMain.current) {
        focusMain.current = false;
        document.getElementById("main")?.focus({ preventScroll: true });
      }
      later(() => setState("idle"), 460);
    };
    liftRef.current = lift;

    const navigateTo = (href: string) => {
      const url = new URL(href, location.href);
      if (url.pathname === location.pathname && url.search === location.search) {
        pendingHref.current = null;
        scrollTo({ top: 0, behavior: "instant" });
        later(lift, 120);
        return;
      }
      router.push(url.pathname + url.search + url.hash);
      later(lift, 6000); // safety timeout if route stalls
    };

    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      if (prefersReducedMotion()) return;

      const anchor = (event.target as Element | null)?.closest?.("a[href]");
      if (!anchor || !(anchor instanceof HTMLAnchorElement)) return;
      if (anchor.target && anchor.target !== "_self") return;
      if (anchor.hasAttribute("download") || anchor.dataset.noCurtain !== undefined) return;

      const url = new URL(anchor.href, location.href);
      if (url.origin !== location.origin) return;
      if (SKIP.test(url.pathname)) return;
      if (url.pathname === location.pathname && (url.hash || url.search !== location.search)) {
        // same-path hash/search — let browser handle without curtain
        if (url.hash) return;
      }
      if (url.pathname === location.pathname && !url.hash && url.search === location.search) return;

      event.preventDefault();
      event.stopPropagation();
      focusMain.current = event.detail === 0;
      router.prefetch(url.pathname + url.search);
      dispatchEvent(new Event("tp:navigate"));

      pendingHref.current = url.href;
      const state = root.dataset.state as CurtainState;
      if (state === "covered" || state === "snap") {
        navigateTo(url.href);
        return;
      }
      if (state === "covering") return;

      clearTimers();
      if (state === "intro" && restAnimationTime() < 1080) {
        setState("covered");
        coveredAt.current = performance.now();
        navigateTo(url.href);
        return;
      }
      setState("covering");
      later(() => {
        setState("covered");
        coveredAt.current = performance.now();
        if (pendingHref.current) navigateTo(pendingHref.current);
      }, 300);
    };

    const onPopState = () => {
      if (prefersReducedMotion()) return;
      if (location.pathname === pathRef.current) return;
      clearTimers();
      setState("snap");
      coveredAt.current = performance.now();
      later(lift, 1400);
    };

    const onPageShow = (event: PageTransitionEvent) => {
      if (event.persisted) {
        clearTimers();
        setState("idle");
      }
    };

    if (root.dataset.state === "intro") {
      if (prefersReducedMotion()) {
        setState("idle");
      } else {
        const elapsed = restAnimationTime();
        later(() => dispatchEvent(new Event("tp:arrived")), Math.max(0, 560 - elapsed));
        later(() => {
          if (root.dataset.state === "intro") setState("idle");
        }, Math.max(0, 1080 - elapsed));
      }
    }

    addEventListener("click", onClick, true);
    addEventListener("popstate", onPopState);
    addEventListener("pageshow", onPageShow);

    return () => {
      clearTimers();
      delete html.dataset.curtain;
      removeEventListener("click", onClick, true);
      removeEventListener("popstate", onPopState);
      removeEventListener("pageshow", onPageShow);
    };
  }, [router]);

  useEffect(() => {
    if (pathname === pathRef.current) return;
    pathRef.current = pathname;
    const state = rootRef.current?.dataset.state as CurtainState | undefined;
    if (state !== "covered" && state !== "snap" && state !== "covering") return;
    const wait =
      state === "covering"
        ? 340
        : Math.max(0, 140 - (performance.now() - coveredAt.current));
    const id = setTimeout(() => requestAnimationFrame(() => liftRef.current()), wait);
    return () => clearTimeout(id);
  }, [pathname]);

  // Skip curtain entirely on admin
  if (SKIP.test(pathname)) return null;

  return (
    <div ref={rootRef} className="tp-curtain" data-state="intro" aria-hidden>
      <div className="tp-curtain__blanket">
        <ScallopEdge side="top" />
        <div className="tp-curtain__stage">
          <div className="tp-curtain__prints">
            {PRINTS.map(([left, top, rot], i) => (
              <svg
                key={i}
                viewBox="0 0 64 64"
                className="tp-curtain__print"
                style={
                  {
                    left: `${left}%`,
                    top: `${top}px`,
                    rotate: `${rot + 90}deg`,
                    animationDelay: `${0.16 + 0.12 * i}s`,
                  } as CSSProperties
                }
              >
                <path d={PAW_PATH} />
              </svg>
            ))}
          </div>
          <CurtainRunner />
          <p className="tp-curtain__note font-scrawl">every puppy is family</p>
        </div>
        <ScallopEdge side="bottom" />
      </div>
    </div>
  );
}
