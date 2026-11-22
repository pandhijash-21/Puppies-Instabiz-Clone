"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { WalkingPuppy } from "@/components/brand/WalkingPuppy";

type Facing = "left" | "right";

type Pose = {
  x: number;
  y: number;
  opacity: number;
  scale: number;
  faceLeft: boolean;
  phase: string;
  snap?: boolean;
  /** Faster catch-up for climb / stroll so he doesn't ghost or lag */
  quick?: boolean;
  forceGait?: "walk" | "idle" | "sit";
  /** When set, show the in-flow hero peek teddy instead of forcing it hidden */
  heroPeek?: { opacity: number; y: number };
  /** 0 = head only · 1 = full WalkingPuppy (grows out of the hero face) */
  bodyReveal?: number;
};

/**
 * Hero face → rise → full-body walk to Meet the pups → continue through
 * the rest of the page with a grounded four-leg stride.
 */
export function HomeScrollBuddy() {
  const reduceMotion = useReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);
  const faceRef = useRef<HTMLDivElement>(null);
  const pupRef = useRef<SVGSVGElement | null>(null);
  const lastY = useRef(0);
  /** Scroll down → face right (RHS); scroll up → face left (LHS) — loops forever */
  const facing = useRef<Facing>("right");
  const scrollVel = useRef(0);
  const activeRef = useRef(false);
  const smooth = useRef({ x: 0, y: 0, opacity: 0, scale: 1, ready: false });
  const gaitHold = useRef(0);
  const basketVisited = useRef(false);
  const climbOrigin = useRef<{
    faceX: number;
    buriedY: number;
    standY: number;
  } | null>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    lastY.current = window.scrollY;
    let raf = 0;
    let alive = true;
    document.documentElement.dataset.pup = "live";
    document.documentElement.dataset.pupFacing = "right";

    const setFacing = (dir: Facing) => {
      if (facing.current === dir) return;
      facing.current = dir;
      document.documentElement.dataset.pupFacing = dir;
      const faceEl = faceRef.current;
      if (faceEl) {
        faceEl.style.transform = dir === "left" ? "scaleX(-1)" : "scaleX(1)";
      }
      // Meet hallway walker flips with the same rule
      const meetFlip = document.querySelector(".tp-meet__teddy > div") as HTMLElement | null;
      if (meetFlip) {
        meetFlip.style.transform = dir === "left" ? "scaleX(-1)" : "scaleX(1)";
      }
    };

    // Wheel / trackpad: flip on the gesture itself (before Lenis finishes)
    const onWheel = (e: WheelEvent) => {
      if (e.deltaY > 1) setFacing("right");
      else if (e.deltaY < -1) setFacing("left");
    };
    let touchY = 0;
    const onTouchStart = (e: TouchEvent) => {
      touchY = e.touches[0]?.clientY ?? 0;
    };
    const onTouchMove = (e: TouchEvent) => {
      const y = e.touches[0]?.clientY ?? touchY;
      const dy = touchY - y; // finger up → page down
      if (dy > 4) setFacing("right");
      else if (dy < -4) setFacing("left");
      touchY = y;
    };
    window.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });

    const tick = () => {
      if (!alive) return;
      const root = rootRef.current;
      const face = faceRef.current;
      const hero = document.getElementById("hero-teddy-stop");
      const meet = document.getElementById("meet-pups");
      const meetTeddy = document.querySelector(".tp-meet__teddy") as HTMLElement | null;
      const paths = document.getElementById("two-ways");
      const pathsGuide =
        document.getElementById("paths-guide-stop") ||
        (document.querySelector(".tp-fork__teddy") as HTMLElement | null);
      const journey = document.getElementById("puppy-journey");
      const journeyGuide =
        document.getElementById("journey-guide-stop") ||
        (document.querySelector(".tp-chat__teddy") as HTMLElement | null);
      const passport = document.getElementById("trust-passport");
      const passportGuide =
        document.getElementById("passport-guide-stop") ||
        (document.querySelector(".tp-book__teddy") as HTMLElement | null);
      const dusk = document.getElementById("happy-families");
      const duskGuide =
        document.getElementById("dusk-guide-stop") ||
        (document.querySelector(".tp-dusk__teddy") as HTMLElement | null);
      const night = document.getElementById("questions");
      const nightGuide =
        document.getElementById("night-guide-stop") ||
        (document.querySelector(".tp-night__teddy") as HTMLElement | null);
      const homeCta = document.getElementById("ready-home");
      const homeGuide = document.getElementById("home-guide-stop");
      const footer = document.querySelector("footer.site-footer") as HTMLElement | null;
      const footerGuide =
        document.getElementById("footer-basket-stop") ||
        (document.querySelector(".tp-basket__pup") as HTMLElement | null);

      if (!root || !hero || !meet) {
        raf = requestAnimationFrame(tick);
        return;
      }

      if (!pupRef.current) {
        pupRef.current = root.querySelector(".tp-pup");
      }

      const lenis = (window as Window & { __tpLenis?: { scroll: number } }).__tpLenis;
      const y = typeof lenis?.scroll === "number" ? lenis.scroll : window.scrollY;
      const delta = y - lastY.current;
      // Smooth velocity from Lenis/scroll — catches keyboard & momentum too
      scrollVel.current = scrollVel.current * 0.72 + delta * 0.28;
      if (scrollVel.current > 0.35) setFacing("right");
      else if (scrollVel.current < -0.35) setFacing("left");
      lastY.current = y;

      // Keep flip applied every frame (loop: down=RHS, up=LHS)
      if (face) {
        face.style.transform =
          facing.current === "left" ? "scaleX(-1)" : "scaleX(1)";
      }

      const heroRect = hero.getBoundingClientRect();
      const meetRect = meet.getBoundingClientRect();
      const pathsRect = paths?.getBoundingClientRect();
      const journeyRect = journey?.getBoundingClientRect();
      const passportRect = passport?.getBoundingClientRect();
      const duskRect = dusk?.getBoundingClientRect();
      const nightRect = night?.getBoundingClientRect();
      const homeRect = homeCta?.getBoundingClientRect();
      const vh = window.innerHeight;
      const vw = window.innerWidth;
      const buddyW = root.offsetWidth || 148;
      const buddyH = root.offsetHeight || 120;

      const meetLand = meetTeddy?.getBoundingClientRect();
      const meetX = meetLand ? meetLand.left : Math.max(12, vw * 0.07);
      const meetY = meetLand ? meetLand.top : vh - Math.min(160, vh * 0.28);

      const guideRect = pathsGuide?.getBoundingClientRect();
      const guideX = guideRect
        ? guideRect.left + guideRect.width * 0.5 - buddyW * 0.5
        : vw * 0.5 - buddyW / 2;
      const guideY = guideRect
        ? guideRect.bottom - buddyH * 0.92
        : vh * 0.72;

      const chatRect = journeyGuide?.getBoundingClientRect();
      const chatX = chatRect
        ? chatRect.left + chatRect.width * 0.5 - buddyW * 0.5
        : vw * 0.42;
      const chatY = chatRect
        ? chatRect.bottom - buddyH * 0.92
        : vh * 0.72;

      const dockOf = (el: HTMLElement | null | undefined, fallbackX: number, fallbackY: number) => {
        const r = el?.getBoundingClientRect();
        if (!r) return { x: fallbackX, y: fallbackY, rect: null as DOMRect | null };
        return {
          x: r.left + r.width * 0.5 - buddyW * 0.5,
          y: r.bottom - buddyH * 0.92,
          rect: r,
        };
      };

      const book = dockOf(passportGuide, vw * 0.28, vh * 0.62);
      const duskDock = dockOf(duskGuide, vw * 0.55, vh * 0.7);
      const nightDock = dockOf(nightGuide, vw * 0.22, vh * 0.62);
      const homeDock = dockOf(homeGuide, vw * 0.5 - buddyW / 2, vh * 0.7);
      const basketDock = dockOf(footerGuide, vw * 0.18, vh * 0.72);
      const footerRect = footer?.getBoundingClientRect();

      // Ground line near the bottom of the viewport — feet stay on a “floor”
      const escortY = Math.min(vh * 0.78, vh - buddyH - 8);

      const applyPose = (pose: Pose) => {
        const paws = document.querySelector(".tp-hero__paws") as HTMLElement | null;
        if (pose.heroPeek) {
          hero.style.opacity = String(pose.heroPeek.opacity);
          hero.style.transform = pose.heroPeek.y
            ? `translate(-50%, ${pose.heroPeek.y}px)`
            : "translateX(-50%)";
          if (paws) paws.style.opacity = String(pose.heroPeek.opacity);
        } else {
          // Hide the quilt peek once the scroll buddy is on stage
          hero.style.opacity = "0";
          hero.style.transform = "translateX(-50%)";
          if (paws) paws.style.opacity = "0";
        }

        const sm = smooth.current;
        const follow =
          pose.snap || reduceMotion || !sm.ready ? 1 : pose.quick ? 0.42 : 0.22;
        if (!sm.ready || pose.snap) {
          sm.x = pose.x;
          sm.y = pose.y;
          sm.opacity = pose.opacity;
          sm.scale = pose.scale;
          sm.ready = true;
        } else {
          sm.x += (pose.x - sm.x) * follow;
          sm.y += (pose.y - sm.y) * follow;
          // Climbing out of the basket / quilt: fade in quickly so motion stays readable
          const opFollow =
            sm.opacity < 0.25 && pose.opacity > 0.35
              ? 0.65
              : Math.min(1, follow * (pose.quick ? 1.6 : 1.35));
          sm.opacity += (pose.opacity - sm.opacity) * opFollow;
          sm.scale += (pose.scale - sm.scale) * follow;
        }

        root.style.opacity = String(sm.opacity);
        root.style.pointerEvents = sm.opacity > 0.25 ? "auto" : "none";
        root.style.transformOrigin = "50% 18%";
        root.style.transform = `translate3d(${sm.x}px, ${sm.y}px, 0) scale(${sm.scale})`;
        // Grow from hero face → full dog (clip away legs/torso until reveal finishes).
        // On mobile keep head-only so the full walker never flashes while scrolling.
        const mobileFaceOnly = window.innerWidth < 768;
        const reveal = clamp(
          mobileFaceOnly ? Math.min(pose.bodyReveal ?? 1, 0.14) : (pose.bodyReveal ?? 1),
          0,
          1,
        );
        if (reveal >= 0.995) {
          root.style.clipPath = "";
        } else {
          root.style.clipPath = `inset(0 0 ${(1 - reveal) * 58}% 0)`;
        }
        document.documentElement.dataset.scrollBuddy = pose.phase;

        if (face) {
          // Always follow scroll direction (pose.faceLeft ignored)
          face.style.transform =
            facing.current === "left" ? "scaleX(-1)" : "scaleX(1)";
        }

        const drift = Math.hypot(pose.x - sm.x, pose.y - sm.y);
        const scrolling = Math.abs(delta) > 0.9;
        const relocating = drift > 0.85;
        let gait: "walk" | "idle" | "sit" =
          pose.forceGait ??
          (sm.opacity > 0.2 && (scrolling || relocating) ? "walk" : "idle");

        // Hold walk a few frames so strides don’t flicker off between scroll ticks
        if (gait === "walk") gaitHold.current = 10;
        else if (gaitHold.current > 0) {
          gaitHold.current -= 1;
          gait = "walk";
        }

        const pup = pupRef.current;
        if (pup) {
          if (pup.dataset.gait !== gait) pup.dataset.gait = gait;
          const speed = Math.min(1.6, Math.max(0.7, Math.abs(delta) * 0.08 + drift * 0.04));
          pup.style.setProperty("--pup-stride", `${(0.42 / speed).toFixed(2)}s`);
        }

        if (!activeRef.current && sm.opacity > 0.2) {
          activeRef.current = true;
          setActive(true);
        }
        if (sm.opacity < 0.08 && activeRef.current) {
          activeRef.current = false;
          setActive(false);
        }
      };

      const isMobile = vw < 768;

      const placeEscort = (opts: {
        fromX: number;
        toX: number;
        toY: number;
        dockRect: DOMRect | null;
        enter: number;
        phase: string;
        faceLeft?: boolean;
        fadeOut?: boolean;
        scale?: number;
        forceGait?: Pose["forceGait"];
        /** Prefer head-only when settled on a dock (esp. mobile) */
        faceOnlyWhenSeated?: boolean;
      }) => {
        const e = easeOut(clamp(opts.enter, 0, 1));
        const x = opts.fromX + (opts.toX - opts.fromX) * e;
        const canDock =
          !!opts.dockRect &&
          opts.dockRect.top <= escortY + buddyH * 0.35 &&
          opts.dockRect.top > vh * 0.05;
        const yPos = canDock ? opts.toY : escortY;
        const baseOpacity = Math.min(1, 0.35 + e * 0.75);
        const opacity = opts.fadeOut
          ? baseOpacity * (1 - clamp((e - 0.72) / 0.28, 0, 1))
          : baseOpacity;
        const scale = opts.scale ?? 0.96 + e * 0.06;
        const seated = canDock && e > 0.82 && Math.abs(opts.toX - x) < 22;
        applyPose({
          x,
          y: yPos,
          opacity,
          scale: isMobile ? Math.min(scale, 0.88) : scale,
          faceLeft: opts.faceLeft ?? false,
          phase: opts.phase,
          forceGait: opts.forceGait ?? (seated ? "sit" : isMobile ? "idle" : undefined),
          // Mobile stays face-only; desktop shows the full walker
          bodyReveal: isMobile ? 0.12 : 1,
          quick: isMobile && !seated,
        });
      };

      const inView = (rect: DOMRect | undefined, top = 0.9, bottom = 0.18) =>
        !!rect && rect.top < vh * top && rect.bottom > vh * bottom;

      const pickPhase = () => {
        const candidates: { id: string; rect: DOMRect; score: number }[] = [];
        const consider = (id: string, rect?: DOMRect) => {
          if (!rect || !inView(rect, 0.95, 0.12)) return;
          const score = Math.abs(rect.top - vh * 0.28);
          candidates.push({ id, rect, score });
        };
        consider("footer", footerRect);
        consider("home", homeRect);
        consider("night", nightRect);
        consider("dusk", duskRect);
        consider("passport", passportRect);
        if (!candidates.length) return null;
        candidates.sort((a, b) => a.score - b.score);
        let best = candidates[0];
        if (
          best.id === "footer" &&
          homeRect &&
          homeRect.bottom > vh * 0.42 &&
          homeRect.top < vh * 0.75
        ) {
          const homeCand = candidates.find((c) => c.id === "home");
          if (homeCand) best = homeCand;
        }
        return best;
      };

      const phase = pickPhase();

      if (phase?.id === "footer" && footerRect) {
        const enter = clamp((vh * 0.92 - footerRect.top) / Math.max(160, vh * 0.55), 0, 1);
        const leave = easeOut(clamp((enter - 0.12) / 0.88, 0, 1));
        const goingUp = delta < -0.8;
        const homePadReady =
          !!homeDock.rect &&
          homeDock.rect.top <= escortY + buddyH * 0.35 &&
          homeDock.rect.top > vh * 0.05;
        const basketPadReady =
          !!basketDock.rect &&
          basketDock.rect.top <= escortY + buddyH * 0.35 &&
          basketDock.rect.top > vh * 0.05;
        const fromX = homeDock.x;
        const fromY = homePadReady ? homeDock.y : escortY;
        const toX = basketDock.x;
        const toY = basketPadReady ? basketDock.y : escortY;
        const x = fromX + (toX - fromX) * leave;
        const yPos = fromY + (toY - fromY) * leave;
        const scale = 1 - leave * 0.22;
        // Nest into the basket on the way down; climb back out when scrolling up
        let opacity = leave < 0.72 ? 1 : 1 - clamp((leave - 0.72) / 0.28, 0, 1);
        if (leave > 0.9) basketVisited.current = true;
        if (goingUp && basketVisited.current) {
          opacity = Math.max(opacity, clamp(1 - leave * 0.9, 0.45, 1));
        }
        if (homeCta) homeCta.dataset.visited = "true";
        applyPose({
          x,
          y: yPos,
          opacity,
          scale,
          // Toward basket when going down; face the house again when backtracking
          faceLeft: !goingUp,
          phase: "footer",
          forceGait:
            opacity < 0.28 && !goingUp
              ? "sit"
              : leave > 0.06 || goingUp
                ? "walk"
                : "idle",
        });
        raf = requestAnimationFrame(tick);
        return;
      }

      // Left the footer — clear basket nest so a later visit can re-seat
      if (phase?.id !== "footer" && basketVisited.current && delta < -1) {
        basketVisited.current = false;
      }

      if (phase?.id === "home" && homeRect) {
        const enter = clamp((vh * 0.9 - homeRect.top) / Math.max(120, vh * 0.45), 0, 1);
        placeEscort({
          fromX: nightDock.x,
          toX: homeDock.x,
          toY: homeDock.y,
          dockRect: homeDock.rect,
          enter,
          phase: "home",
        });
        if (enter > 0.55 && homeCta) homeCta.dataset.visited = "true";
        raf = requestAnimationFrame(tick);
        return;
      }

      if (phase?.id === "night" && nightRect) {
        const enter = clamp((vh * 0.9 - nightRect.top) / Math.max(120, vh * 0.45), 0, 1);
        placeEscort({
          fromX: duskDock.x,
          toX: nightDock.x,
          toY: nightDock.y,
          dockRect: nightDock.rect,
          enter,
          phase: "night",
        });
        raf = requestAnimationFrame(tick);
        return;
      }

      if (phase?.id === "dusk" && duskRect) {
        const enter = clamp((vh * 0.9 - duskRect.top) / Math.max(120, vh * 0.45), 0, 1);
        placeEscort({
          fromX: book.x,
          toX: duskDock.x,
          toY: duskDock.y,
          dockRect: duskDock.rect,
          enter,
          phase: "dusk",
        });
        raf = requestAnimationFrame(tick);
        return;
      }

      if (phase?.id === "passport" && passportRect) {
        const enter = clamp((vh * 0.9 - passportRect.top) / Math.max(120, vh * 0.45), 0, 1);
        placeEscort({
          fromX: chatX,
          toX: book.x,
          toY: book.y,
          dockRect: book.rect,
          enter,
          phase: "passport",
        });
        raf = requestAnimationFrame(tick);
        return;
      }

      const journeyActive =
        !!journeyRect &&
        journeyRect.top < vh * 0.88 &&
        journeyRect.bottom > vh * 0.22;

      if (journeyActive && journeyRect) {
        const enter = clamp(
          (vh * 0.88 - journeyRect.top) / Math.max(140, vh * 0.5),
          0,
          1,
        );
        placeEscort({
          fromX: guideX,
          toX: chatX,
          toY: chatY,
          dockRect: chatRect ?? null,
          enter,
          phase: "journey",
        });
        raf = requestAnimationFrame(tick);
        return;
      }

      const pathsApproaching =
        !!pathsRect &&
        pathsRect.top < vh * 0.95 &&
        pathsRect.bottom > vh * 0.18 &&
        !(journeyRect && journeyRect.top < vh * 0.88);

      if (pathsApproaching && pathsRect) {
        const enter = clamp((vh * 0.95 - pathsRect.top) / Math.max(120, vh * 0.55), 0, 1);
        // Mobile: clear walk from meet's left corner → paths right dock (face only when seated)
        const fromX = isMobile
          ? Math.min(meetX, vw * 0.08)
          : Math.min(meetX, vw * 0.22);
        const toX = isMobile ? Math.max(guideX, vw * 0.58) : guideX;
        placeEscort({
          fromX,
          toX,
          toY: guideY,
          dockRect: guideRect ?? null,
          enter,
          phase: "paths",
          faceLeft: enter < 0.55,
          faceOnlyWhenSeated: true,
        });
        raf = requestAnimationFrame(tick);
        return;
      }

      document.documentElement.dataset.scrollBuddy = "";

      // —— Hero face peek → climb out of quilt → walk to Meet (before meetOwns) ——
      // Use layout offsetTop (stable under position:sticky) — getBoundingClientRect jumps when pinned
      let meetLayoutTop = 0;
      for (let n: HTMLElement | null = meet; n; n = n.offsetParent as HTMLElement | null) {
        meetLayoutTop += n.offsetTop;
      }
      const tSpan = Math.max(vh * 1.15, 520);
      const t = clamp((y + vh * 0.92 - meetLayoutTop) / tSpan, 0, 1);
      // Keep guiding even after the hero quilt scrolls away — origin is frozen on climb
      const heroStillInPlay =
        t < 0.98 && !(pathsRect && pathsRect.top < vh * 0.92);

      if (heroStillInPlay) {
        // Align floating buddy head with the hero face peek box
        const liveFaceX = heroRect.left + heroRect.width * 0.5 - buddyW * 0.5;
        const liveBuriedY = heroRect.top - buddyH * 0.06;
        const liveStandY = Math.max(12, liveBuriedY - Math.min(48, vh * 0.08));

        if (t < 0.08) {
          climbOrigin.current = null;
          if (document.documentElement.dataset.meetWalker === "on") {
            delete document.documentElement.dataset.meetWalker;
          }
          applyPose({
            x: liveFaceX,
            y: liveBuriedY,
            opacity: 0,
            scale: 1,
            faceLeft: false,
            phase: "",
            snap: true,
            forceGait: "idle",
            bodyReveal: 0,
            heroPeek: { opacity: 1, y: 0 },
          });
          raf = requestAnimationFrame(tick);
          return;
        }

        if (!climbOrigin.current) {
          const heroOnScreen = heroRect.bottom > 40 && heroRect.top < vh * 0.95;
          climbOrigin.current = heroOnScreen
            ? {
                faceX: liveFaceX,
                buriedY: liveBuriedY,
                standY: liveStandY,
              }
            : {
                faceX: Math.max(12, vw * 0.42 - buddyW * 0.5),
                buriedY: escortY + 20,
                standY: escortY,
              };
        }
        const origin = climbOrigin.current;

        const w = clamp((t - 0.08) / 0.9, 0, 1);
        const seedAtQuilt = smooth.current.opacity < 0.08;

        // Climb: face peeks → body grows complete → then walk to Meet
        if (w < 0.38) {
          const u = easeOut(w / 0.38);
          applyPose({
            x: origin.faceX,
            y: origin.buriedY + (origin.standY - origin.buriedY) * u,
            opacity: clamp(0.25 + u * 1.2, 0, 1),
            scale: 0.92 + u * 0.08,
            faceLeft: false,
            phase: "climb",
            snap: seedAtQuilt,
            quick: true,
            forceGait: u > 0.45 ? "walk" : "idle",
            bodyReveal: u,
            heroPeek: {
              opacity: Math.max(0, 1 - u * 1.6),
              y: -22 * u,
            },
          });
        } else {
          const u = easeOut((w - 0.38) / 0.62);
          const floorY = Math.min(meetY, escortY);
          const handoff = clamp((u - 0.8) / 0.2, 0, 1);
          if (handoff > 0.3) {
            document.documentElement.dataset.meetWalker = "on";
          }
          applyPose({
            x: origin.faceX + (meetX - origin.faceX) * u,
            y: origin.standY + (floorY - origin.standY) * u,
            opacity: 1 - handoff,
            scale: 1,
            faceLeft: meetX < origin.faceX - 8,
            phase: handoff > 0.85 ? "meet" : "to-meet",
            quick: true,
            forceGait: handoff > 0.5 ? "idle" : "walk",
            bodyReveal: 1,
            heroPeek: { opacity: 0, y: 0 },
          });
        }

        raf = requestAnimationFrame(tick);
        return;
      }

      climbOrigin.current = null;

      // Meet hallway owns the walker only after the stroll has finished (or was skipped)
      const meetOwns =
        meetRect.top < Math.min(80, vh * 0.18) &&
        meetRect.bottom > vh * 0.55 &&
        !(pathsRect && pathsRect.top < vh * 0.95) &&
        (document.documentElement.dataset.meetWalker === "on" || t >= 0.97);

      if (meetOwns) {
        document.documentElement.dataset.meetWalker = "on";
        applyPose({
          x: meetX,
          y: meetY,
          opacity: 0,
          scale: 1,
          faceLeft: false,
          phase: "meet",
          forceGait: "idle",
        });
        raf = requestAnimationFrame(tick);
        return;
      }

      if (document.documentElement.dataset.meetWalker === "on") {
        delete document.documentElement.dataset.meetWalker;
      }

      const leavingMeet =
        meetRect.bottom < vh * 0.92 &&
        meetRect.bottom > vh * 0.15 &&
        (!pathsRect || pathsRect.top >= vh * 0.95);

      if (leavingMeet) {
        const exit = clamp((vh * 0.92 - meetRect.bottom) / (vh * 0.4), 0, 1);
        const yPos =
          Math.min(meetY, vh * 0.7) + exit * (escortY - Math.min(meetY, vh * 0.7));
        applyPose({
          x: meetX,
          y: yPos,
          opacity: Math.min(1, 0.3 + exit * 0.7),
          scale: 1,
          faceLeft: false,
          phase: "",
        });
        raf = requestAnimationFrame(tick);
        return;
      }

      // Fallback: keep face peek visible at rest
      applyPose({
        x: heroRect.left,
        y: heroRect.top,
        opacity: 0,
        scale: 1,
        faceLeft: false,
        phase: "",
        snap: true,
        forceGait: "idle",
        heroPeek: { opacity: 1, y: 0 },
      });
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      delete document.documentElement.dataset.pup;
      delete document.documentElement.dataset.pupFacing;
      delete document.documentElement.dataset.scrollBuddy;
      delete document.documentElement.dataset.meetWalker;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- rAF loop owns updates
  }, [reduceMotion]);

  return (
    <div
      ref={rootRef}
      className="tp-scroll-buddy pointer-events-none fixed left-0 top-0 z-[70]"
      style={{
        width: "clamp(7.75rem, 20vw, 12.25rem)",
        opacity: 0,
        willChange: "transform, opacity",
        transformOrigin: "50% 92%",
      }}
    >
      <div ref={faceRef} style={{ transformOrigin: "50% 92%" }}>
        <Link
          href="#puppy-journey"
          className="block focus-ring"
          aria-label="Teddy will walk you through your puppy journey"
          tabIndex={active ? 0 : -1}
          style={{ borderRadius: "1rem" }}
        >
          <WalkingPuppy gait="idle" />
        </Link>
      </div>
    </div>
  );
}

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

function easeOut(t: number) {
  return 1 - (1 - t) * (1 - t);
}
