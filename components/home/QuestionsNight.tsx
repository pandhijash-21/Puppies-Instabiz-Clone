"use client";

import Image from "next/image";
import type { Faq } from "@/lib/types";
import { ButtonLink } from "@/components/ui/Button";

const STARS = [
  { left: "8%", top: "12%", w: 16.2, delay: "0s" },
  { left: "22%", top: "30%", w: 9, delay: "0.4s" },
  { left: "41%", top: "8%", w: 12.6, delay: "0.8s" },
  { left: "57%", top: "22%", w: 8.1, delay: "1.2s" },
  { left: "72%", top: "6%", w: 14.4, delay: "1.6s" },
  { left: "88%", top: "18%", w: 10.8, delay: "2s" },
  { left: "95%", top: "42%", w: 9, delay: "2.4s" },
  { left: "4%", top: "58%", w: 10.8, delay: "2.8s" },
  { left: "34%", top: "70%", w: 7.2, delay: "3.2s" },
  { left: "63%", top: "84%", w: 9.9, delay: "3.6s" },
  { left: "83%", top: "66%", w: 12.6, delay: "4s" },
];

function Twinkle() {
  return (
    <svg viewBox="0 0 40 40" className="tp-twinkle absolute text-honey" aria-hidden>
      <path
        d="M20 3c1.6 9.4 7.6 15.4 17 17-9.4 1.6-15.4 7.6-17 17-1.6-9.4-7.6-15.4-17-17 9.4-1.6 15.4-7.6 17-17z"
        fill="currentColor"
      />
    </svg>
  );
}

export function QuestionsNight({ faqs }: { faqs: Faq[] }) {
  return (
    <section
      id="questions"
      data-pup-scene="true"
      data-tone="dark"
      className="tp-scene tp-night"
      style={{ ["--sky-top" as string]: "#4d2b19", ["--sky-bottom" as string]: "#2f1a10" }}
      aria-labelledby="questions-title"
    >
      <div aria-hidden className="pointer-events-none tp-night__stars">
        {STARS.map((s, i) => (
          <span
            key={i}
            className="absolute"
            style={{
              left: s.left,
              top: s.top,
              width: s.w,
              animationDelay: s.delay,
            }}
          >
            <Twinkle />
          </span>
        ))}
      </div>

      <div className="tp-night__grid gutter">
        <div className="tp-night__intro">
          <h2 id="questions-title" className="font-plush text-huge">
            Questions, answered
          </h2>
          <ButtonLink href="/faq" variant="ghost" className="tp-night__cta">
            Read all questions
          </ButtonLink>

          <div className="tp-night__pup">
            <span aria-hidden className="tp-night__wonder font-plush">
              ?
            </span>
            <div
              id="night-guide-stop"
              className="pup-stop tp-night__teddy"
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

        <dl className="tp-night__list">
          {faqs.slice(0, 3).map((faq) => (
            <div key={faq.id} className="tp-qa">
              <dt className="font-plush tp-qa__q">
                <svg viewBox="0 0 40 40" className="tp-qa__star" aria-hidden>
                  <path
                    d="M20 3c1.6 9.4 7.6 15.4 17 17-9.4 1.6-15.4 7.6-17 17-1.6-9.4-7.6-15.4-17-17 9.4-1.6 15.4-7.6 17-17z"
                    fill="currentColor"
                  />
                </svg>
                {faq.question}
              </dt>
              <dd className="tp-qa__a">{faq.answer}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
