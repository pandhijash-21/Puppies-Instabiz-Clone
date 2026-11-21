import type { Metadata } from "next";
import type { CSSProperties } from "react";
import Image from "next/image";
import { DeliverySection } from "@/components/how-it-works/DeliverySection";
import { TwoWaysHome } from "@/components/how-it-works/TwoWaysHome";
import { ButtonLink } from "@/components/ui/Button";
import { premiumPromise, whyChooseUs } from "@/content/static";
import { whatsappHref } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "How it works",
  description:
    "Whether you choose to visit us locally or order a premium breed from overseas, TeddyPups is here to make the experience unforgettable.",
};

const pageNav = [
  { href: "#two-ways", label: "Two ways home", n: 1 },
  { href: "#promise", label: "Our premium puppy promise", n: 2 },
  { href: "#delivery", label: "Delivery & collection", n: 3 },
  { href: "#why", label: "Why choose us", n: 4 },
];

const stampMeta = [
  { cls: "tp-stamp--round", tilt: "-8deg", color: "#a24a1a", icon: "heart" },
  { cls: "tp-stamp--ticket", tilt: "4deg", color: "#1f7a4d", icon: "plane" },
  { cls: "tp-stamp--oval", tilt: "-3deg", color: "#8e3f15", icon: "chat" },
] as const;

function StampIcon({ kind }: { kind: (typeof stampMeta)[number]["icon"] }) {
  if (kind === "heart") {
    return (
      <svg viewBox="0 0 64 64" className="tp-stamp__icon" aria-hidden>
        <path
          d="M32 54C16 43 8 34 8 24c0-7 5.4-12 12-12 5 0 9 3 12 7 3-4 7-7 12-7 6.6 0 12 5 12 12 0 10-8 19-24 30z"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
  if (kind === "plane") {
    return (
      <svg viewBox="0 0 64 64" className="tp-stamp__icon" aria-hidden>
        <path
          d="M6 36l22-3 12-17h6l-6 17 12-1 6-7h3l-4 12H12z"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 64 64" className="tp-stamp__icon" aria-hidden>
      <path
        d="M12 20c0-6 8-10 20-10s20 4 20 10v8c0 10-8 18-20 22-12-4-20-12-20-22v-8z"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
      />
      <circle cx="24" cy="28" r="2.5" fill="currentColor" />
      <circle cx="32" cy="28" r="2.5" fill="currentColor" />
      <circle cx="40" cy="28" r="2.5" fill="currentColor" />
    </svg>
  );
}

function WhyIcon({ i }: { i: number }) {
  if (i === 0) {
    return (
      <svg viewBox="0 0 64 64" className="size-14 shrink-0 text-toffee-deep" aria-hidden>
        <path
          d="M6 36l22-3 12-17h6l-6 17 12-1 6-7h3l-4 12H12z"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
  if (i === 1) {
    return (
      <svg viewBox="0 0 64 64" className="size-14 shrink-0 text-toffee-deep" aria-hidden>
        <path
          d="M12 20c0-6 8-10 20-10s20 4 20 10v8c0 10-8 18-20 22-12-4-20-12-20-22v-8z"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
        />
        <circle cx="24" cy="28" r="2.5" fill="currentColor" />
        <circle cx="32" cy="28" r="2.5" fill="currentColor" />
        <circle cx="40" cy="28" r="2.5" fill="currentColor" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 64 64" className="size-14 shrink-0 text-toffee-deep" aria-hidden>
      <circle cx="32" cy="32" r="18" fill="none" stroke="currentColor" strokeWidth="3" />
      <path
        d="M22 34l6 6 14-14"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function HowItWorksPage() {
  return (
    <section
      data-pup-scene
      data-tone="light"
      className="tp-scene tp-how"
      style={{ ["--sky-top" as string]: "#fffbf3", ["--sky-bottom" as string]: "#f6cc85" }}
      aria-labelledby="how-title"
    >
      <div className="mx-auto max-w-[110rem] px-4 pb-24 pt-10 md:px-8 md:pt-16 lg:px-12">
        <header className="grid gap-8 md:grid-cols-12 md:items-end">
          <h1 id="how-title" className="tp-giant text-cocoa md:col-span-7">
            How it works
          </h1>
          <p className="text-[var(--ink-soft)] md:col-span-5 md:pb-4 md:text-lg">
            Whether you choose to visit us locally or order a premium breed from overseas, TeddyPups
            is here to make the experience unforgettable.
          </p>
        </header>

        <nav aria-label="On this page" className="mt-10 flex flex-wrap gap-2.5">
          {pageNav.map((item) => (
            <a key={item.href} href={item.href} className="tp-toc-pill">
              <span className="font-plush text-toffee">{item.n}</span> {item.label}
            </a>
          ))}
        </nav>

        <TwoWaysHome />

        <section
          id="promise"
          aria-labelledby="promise-title"
          className="tp-paper mt-24 -rotate-[0.6deg]"
        >
          <p aria-hidden className="font-scrawl text-lg text-toffee-ink">
            puppy passport
          </p>
          <h2 id="promise-title" className="tp-huge mt-1 max-w-[16ch] text-cocoa">
            Our premium puppy promise
          </h2>
          <ul className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
            {premiumPromise.map((item, i) => {
              const meta = stampMeta[i] ?? stampMeta[0];
              return (
                <li
                  key={item.title}
                  className="tp-entry"
                  style={
                    {
                      "--ink-stamp": meta.color,
                      "--tilt": meta.tilt,
                      "--i": i,
                    } as CSSProperties
                  }
                >
                  <span className={`tp-stamp ${meta.cls}`}>
                    <StampIcon kind={meta.icon} />
                    <span className="tp-stamp__title font-plush">{item.title}</span>
                  </span>
                  <p className="mt-5 max-w-[28ch] text-cocoa-soft">{item.body}</p>
                </li>
              );
            })}
          </ul>
        </section>

        <DeliverySection />

        <section id="why" aria-labelledby="why-title" className="tp-why mt-24 grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <h2 id="why-title" className="tp-huge text-cocoa">
              Why choose us
            </h2>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-cocoa-soft md:text-lg">
              We&apos;re here to help you find a new family member. From the moment you visit our
              site to the joyful day your puppy arrives at your door, we&apos;re with you every step
              of the way. Our mission is to make the entire adoption process smooth, transparent,
              and full of love.
            </p>
          </div>
          <ul className="space-y-8 lg:col-span-6 lg:col-start-7">
            {whyChooseUs.map((item, i) => (
              <li key={item.title} className="flex gap-5">
                <WhyIcon i={i} />
                <div>
                  <h3 className="font-plush text-[1.35rem] font-bold text-cocoa">{item.title}</h3>
                  <p className="mt-1.5 text-cocoa-soft">{item.body}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section
          aria-labelledby="care-title"
          className="tp-board mt-24 grid items-center gap-8 md:grid-cols-[1fr_auto] md:!p-12"
        >
          <div>
            <h2 id="care-title" className="tp-huge max-w-[14ch] text-cocoa">
              Unique and high quality puppies
            </h2>
            <p className="mt-5 max-w-2xl text-cocoa-soft">
              When you choose TeddyPups, you can trust that you&apos;re getting a puppy of the
              highest quality. We also provide guidance and support to new pet owners, offering
              advice on training, nutrition, and general care to ensure a smooth transition for you
              and your new furry friend.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink
                href={whatsappHref()}
                variant="whatsapp"
                target="_blank"
                rel="noopener noreferrer"
              >
                Ask us on WhatsApp
              </ButtonLink>
              <ButtonLink href="/puppies" variant="ghost">
                See available puppies
              </ButtonLink>
            </div>
          </div>
          <div className="mx-auto w-36 md:mx-0 md:w-44">
            <Image
              src="/brand/walking-puppy.svg"
              alt=""
              width={176}
              height={141}
              className="h-auto w-full drop-shadow-[0_12px_18px_rgba(42,23,14,.22)]"
            />
          </div>
        </section>
      </div>
    </section>
  );
}
