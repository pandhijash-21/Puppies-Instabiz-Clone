"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import type { Puppy } from "@/lib/types";
import { featuredImage } from "@/lib/utils/format";
import { breedChips, journeySteps } from "@/content/static";
import { ButtonLink } from "@/components/ui/Button";
import { whatsappHref, generalWhatsAppMessage } from "@/lib/whatsapp";

type JourneyPup = Pick<Puppy, "id" | "slug" | "name" | "breed" | "puppy_images">;

const BREED_HREFS: Record<string, string> = {
  Maltipoo: "/puppies?breed=maltipoo",
  Pomeranian: "/puppies?breed=pomeranian",
  Poodle: "/puppies?breed=poodle",
  Cavapoo: "/puppies?breed=cavapoo",
  "Shih Tzu": "/puppies?breed=shih-tzu",
};

export function PuppyJourney({ puppies }: { puppies: JourneyPup[] }) {
  const reduceMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const stepRefs = useRef<(HTMLLIElement | null)[]>([]);
  const screenRef = useRef<HTMLDivElement>(null);
  const [activeStep, setActiveStep] = useState(0);
  const [revealed, setRevealed] = useState<number[]>(reduceMotion ? [0, 1, 2] : []);
  const [typing, setTyping] = useState(!reduceMotion);
  const [playing, setPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const snaps = puppies
    .map((p) => featuredImage(p.puppy_images))
    .filter(Boolean)
    .slice(0, 4);
  const poster = snaps[0]?.url ?? null;
  const videoSrc =
    puppies
      .flatMap((p) => p.puppy_images ?? [])
      .find((m) => m.media_type === "video")?.url ?? null;

  useEffect(() => {
    const section = sectionRef.current;
    const steps = stepRefs.current.filter(Boolean) as HTMLLIElement[];
    if (!section || !steps.length) return;

    let raf = 0;
    let alive = true;
    let lastActive = -1;

    const isMobileLayout = () => window.matchMedia("(max-width: 1023px)").matches;

    const tick = () => {
      if (!alive) return;
      const vh = window.innerHeight;
      const sectionRect = section.getBoundingClientRect();

      // Mobile: journey steps first, then phone — always show the full final chat
      if (isMobileLayout()) {
        if (lastActive !== steps.length - 1) {
          lastActive = steps.length - 1;
          setActiveStep(steps.length - 1);
        }
        raf = requestAnimationFrame(tick);
        return;
      }

      const phone = section.querySelector(".tp-phone") as HTMLElement | null;
      const phoneRect = phone?.getBoundingClientRect();
      const phoneStuck =
        !!phoneRect && phoneRect.top < vh * 0.35 && phoneRect.bottom > vh * 0.2;
      const focus = phoneStuck
        ? Math.min(vh * 0.78, Math.max(vh * 0.42, phoneRect!.bottom + 20))
        : vh * 0.42;

      // Desktop scroll-spy: last step whose top has crossed the focus line
      let best = 0;
      steps.forEach((el, i) => {
        const r = el.getBoundingClientRect();
        if (r.top < focus) best = i;
      });

      if (sectionRect.bottom < vh * 1.05) best = steps.length - 1;

      if (best !== lastActive) {
        lastActive = best;
        setActiveStep(best);
      }
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => {
      alive = false;
      cancelAnimationFrame(raf);
    };
  }, []);

  const revealedRef = useRef(revealed);
  revealedRef.current = revealed;

  // Reveal phone bubbles as soon as each step is highlighted; typing is cosmetic only.
  useEffect(() => {
    if (reduceMotion) {
      setRevealed([0, 1, 2]);
      setTyping(false);
      return;
    }

    const already = revealedRef.current.includes(activeStep);
    setRevealed((prev) => {
      const next = new Set(prev);
      for (let i = 0; i <= activeStep; i++) next.add(i);
      const arr = [...next].sort();
      return arr.length === prev.length ? prev : arr;
    });

    if (already) {
      setTyping(false);
      return;
    }

    setTyping(true);
    const id = window.setTimeout(() => setTyping(false), 320);
    return () => window.clearTimeout(id);
  }, [activeStep, reduceMotion]);

  // Keep the latest chat bubble in view inside the phone
  useEffect(() => {
    const screen = screenRef.current;
    if (!screen) return;
    const ids = [90, 420].map((ms) =>
      window.setTimeout(() => {
        screen.scrollTo({ top: screen.scrollHeight, behavior: "smooth" });
      }, ms),
    );
    return () => ids.forEach((id) => window.clearTimeout(id));
  }, [revealed, typing, activeStep]);

  const toggleVideo = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      void v.play();
      setPlaying(true);
    } else {
      v.pause();
      setPlaying(false);
    }
  };

  return (
    <section
      ref={sectionRef}
      id="puppy-journey"
      data-pup-scene="true"
      data-tone="light"
      className="tp-scene tp-chat"
      style={{ ["--sky-top" as string]: "#f7d18d", ["--sky-bottom" as string]: "#f0b866" }}
      aria-labelledby="journey-title"
    >
      <div className="tp-chat__grid gutter">
        <header className="tp-chat__intro">
          <h2 id="journey-title" className="font-plush text-huge">
            Your puppy journey
          </h2>
          <p className="text-lede mt-5 max-w-[42ch]">
            A premium, step-by-step concierge experience. We make adoption simple, secure, and
            purely joyful.
          </p>
        </header>

        <div className="tp-chat__story">
          <ol className="tp-chat__steps">
            {journeySteps.map((step, i) => (
              <li
                key={step.title}
                ref={(el) => {
                  stepRefs.current[i] = el;
                }}
                className="tp-chat__step"
                data-filled={i <= activeStep ? "true" : undefined}
                data-active={activeStep === i ? "true" : undefined}
                data-done={i < activeStep ? "true" : undefined}
              >
                <span className="tp-chat__num font-plush" aria-hidden>
                  {i + 1}
                </span>
                <h3 className="font-plush tp-chat__title">{step.title}</h3>
                <p className="tp-chat__text">{step.body}</p>
              </li>
            ))}
          </ol>

          <ButtonLink href="/how-it-works" variant="ghost" className="tp-chat__cta">
            How it works
          </ButtonLink>
        </div>

        <div className="tp-chat__side">
          <div className="tp-phone" aria-label="A WhatsApp conversation with TeddyPups U.A.E." role="group">
            <div className="tp-phone__bar">
              <Image
                src="/brand/logo.png"
                alt=""
                width={40}
                height={40}
                className="tp-phone__avatar rounded-full object-cover"
              />
              <span>
                <span className="tp-phone__name">TeddyPups U.A.E.</span>
                <span className="tp-phone__status">online</span>
              </span>
            </div>

            <div className="tp-phone__screen" ref={screenRef}>
              <p className="tp-msg tp-msg--me">{generalWhatsAppMessage()}</p>

              <div
                className="tp-msg-group"
                data-step="0"
                data-show={revealed.includes(0) ? "true" : "false"}
              >
                <div className="tp-msg tp-msg--them">
                  <p>{journeySteps[0].body}</p>
                  <ul className="tp-chips" aria-label="Breeds we have now">
                    {breedChips.map((breed) => (
                      <li key={breed}>
                        <Link href={BREED_HREFS[breed] ?? `/puppies?filter=${breed.toLowerCase()}`}>
                          {breed}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div
                className="tp-msg-group"
                data-step="1"
                data-show={revealed.includes(1) ? "true" : "false"}
              >
                {snaps.length > 0 ? (
                  <div className="tp-msg tp-msg--them tp-msg--media">
                    <div className="tp-snaps">
                      {snaps.map((img, i) => (
                        <span key={img!.url + i} className="tp-snaps__one">
                          <Image
                            src={img!.url}
                            alt="A TeddyPups puppy"
                            fill
                            className="object-cover"
                            sizes="9rem"
                          />
                        </span>
                      ))}
                    </div>
                  </div>
                ) : null}

                {(videoSrc || poster) && (
                  <div className="tp-msg tp-msg--them tp-msg--media">
                    <div className="tp-clip">
                      {videoSrc ? (
                        <video
                          ref={videoRef}
                          src={videoSrc}
                          poster={poster ?? undefined}
                          muted
                          loop
                          playsInline
                          preload="none"
                          aria-label="Video of a TeddyPups puppy"
                        />
                      ) : poster ? (
                        <Image src={poster} alt="" fill className="object-cover" sizes="9rem" />
                      ) : null}
                      <button
                        type="button"
                        className="tp-clip__play"
                        aria-pressed={playing}
                        aria-label={playing ? "Pause video" : "Play video"}
                        onClick={toggleVideo}
                        disabled={!videoSrc}
                      >
                        <svg viewBox="0 0 24 24" aria-hidden>
                          {playing ? (
                            <path d="M6 5h4v14H6zm8 0h4v14h-4z" />
                          ) : (
                            <path d="M8 5v14l11-7z" />
                          )}
                        </svg>
                      </button>
                    </div>
                  </div>
                )}

                <p className="tp-msg tp-msg--them">{journeySteps[1].body}</p>
              </div>

              <div
                className="tp-msg-group"
                data-step="2"
                data-show={revealed.includes(2) ? "true" : "false"}
              >
                <div className="tp-msg tp-msg--them">
                  <p>{journeySteps[2].body}</p>
                  <svg viewBox="0 0 220 70" className="tp-route" aria-hidden>
                    <path d="M14 52 C 60 6, 120 70, 170 28" className="tp-route__line" />
                    <circle cx="14" cy="52" r="5" className="tp-route__dot" />
                    <path d="M164 32 l12 -12 l12 12 v14 h-24 z" className="tp-route__home" />
                    <path
                      d="M176 42 c-2-3-7-2-6 2c1 3 6 5 6 5s5-2 6-5c1-4-4-5-6-2z"
                      className="tp-route__heart"
                    />
                    <g className="tp-route__paw" transform="translate(78 28) rotate(-28) scale(0.92)">
                      <ellipse cx="0" cy="5" rx="5.2" ry="4.4" />
                      <ellipse cx="-6.2" cy="-2.2" rx="2.1" ry="2.6" transform="rotate(-20 -6.2 -2.2)" />
                      <ellipse cx="-2.1" cy="-4.6" rx="2.2" ry="2.7" transform="rotate(-6 -2.1 -4.6)" />
                      <ellipse cx="2.4" cy="-4.6" rx="2.2" ry="2.7" transform="rotate(6 2.4 -4.6)" />
                      <ellipse cx="6.4" cy="-2.2" rx="2.1" ry="2.6" transform="rotate(20 6.4 -2.2)" />
                    </g>
                    <g className="tp-route__paw" transform="translate(118 40) rotate(12) scale(0.92)">
                      <ellipse cx="0" cy="5" rx="5.2" ry="4.4" />
                      <ellipse cx="-6.2" cy="-2.2" rx="2.1" ry="2.6" transform="rotate(-20 -6.2 -2.2)" />
                      <ellipse cx="-2.1" cy="-4.6" rx="2.2" ry="2.7" transform="rotate(-6 -2.1 -4.6)" />
                      <ellipse cx="2.4" cy="-4.6" rx="2.2" ry="2.7" transform="rotate(6 2.4 -4.6)" />
                      <ellipse cx="6.4" cy="-2.2" rx="2.1" ry="2.6" transform="rotate(20 6.4 -2.2)" />
                    </g>
                  </svg>
                </div>
              </div>

              <p className="tp-typing" data-show={typing ? "true" : "false"} aria-hidden>
                <span />
                <span />
                <span />
              </p>
            </div>

            <a
              href={whatsappHref()}
              target="_blank"
              rel="noopener noreferrer"
              className="tp-phone__compose"
            >
              <span>Say hello on WhatsApp</span>
              <svg viewBox="0 0 24 24" aria-hidden>
                <path d="M3 20l18-8L3 4v6l12 2-12 2z" />
              </svg>
            </a>
          </div>

          <div
            id="journey-guide-stop"
            className="pup-stop tp-chat__teddy"
            data-pup-stop="true"
            data-pose="sit"
            data-facing="right"
            aria-hidden
          >
            <div className="pup-buddy" data-facing="right" data-live="">
              <Image
                src="/brand/walking-puppy.svg"
                alt=""
                width={176}
                height={140}
                className="h-auto w-full"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
