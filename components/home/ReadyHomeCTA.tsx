"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { ButtonLink } from "@/components/ui/Button";
import { whatsappHref } from "@/lib/whatsapp";

export function ReadyHomeCTA({
  puppySrc,
  puppyName = "a TeddyPups puppy",
}: {
  puppySrc: string | null;
  puppyName?: string;
}) {
  const sectionRef = useRef<HTMLElement>(null);

  // Door opens + photo pops when Teddy reaches the house (buddy), or when the
  // doorway is parked in the lower-middle of the viewport (reduced-motion / skip).
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    let raf = 0;
    let alive = true;

    const tick = () => {
      if (!alive) return;
      if (section.dataset.visited === "true") {
        raf = requestAnimationFrame(tick);
        return;
      }
      const buddyPhase = document.documentElement.dataset.scrollBuddy;
      if (buddyPhase === "home" || buddyPhase === "footer") {
        section.dataset.visited = "true";
      } else {
        const house = section.querySelector(".tp-house") as HTMLElement | null;
        const r = house?.getBoundingClientRect();
        const vh = window.innerHeight;
        if (r && r.top < vh * 0.55 && r.bottom > vh * 0.35) {
          section.dataset.visited = "true";
        }
      }
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => {
      alive = false;
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="ready-home"
      data-pup-scene="true"
      data-tone="dark"
      className="tp-scene tp-home"
      style={{ ["--sky-top" as string]: "#2f1a10", ["--sky-bottom" as string]: "#24130b" }}
      aria-labelledby="cta-title"
    >
      <div className="tp-home__copy gutter">
        <h2 id="cta-title" className="font-plush text-huge">
          Ready to meet your new best friend?
        </h2>
        <p className="tp-home__lede">
          Bring home a healthy, happy teacup or designer puppy with expert guidance every step of
          the way. We help you find the right match and ensure a smooth, safe delivery across the
          UAE.
        </p>
      </div>

      <div className="tp-house">
        <span aria-hidden className="tp-house__plant tp-house__plant--left" />
        <span aria-hidden className="tp-house__lamp" />

        <div className="tp-house__doorway">
          <span className="tp-house__inside">
            {puppySrc ? (
              <Image
                src={puppySrc}
                alt={`${puppyName}, waiting inside`}
                fill
                className="object-cover"
                sizes="16rem"
                style={{ objectPosition: "54% 44%" }}
              />
            ) : (
              <span className="tp-house__inside-fallback" aria-hidden />
            )}
          </span>
          <span aria-hidden className="tp-house__door">
            <span className="tp-house__peep" />
            <span className="tp-house__knob" />
          </span>
        </div>

        <span aria-hidden className="tp-house__plant tp-house__plant--right" />
        <span aria-hidden className="tp-house__mat font-scrawl">
          welcome home
        </span>

        <div
          id="home-guide-stop"
          className="pup-stop tp-house__teddy"
          data-pup-stop="true"
          data-pose="bow"
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

      <div className="tp-home__actions gutter">
        <ButtonLink href={whatsappHref()} variant="whatsapp" target="_blank" rel="noopener noreferrer">
          Enquire on WhatsApp
        </ButtonLink>
        <ButtonLink href="/contact" variant="ghost" className="tp-home__ghost">
          Visit & contact
        </ButtonLink>
      </div>
    </section>
  );
}
