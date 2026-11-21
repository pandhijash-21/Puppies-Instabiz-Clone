import { Suspense } from "react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { FilterChips } from "@/components/puppies/FilterChips";
import { PuppyCard } from "@/components/puppies/PuppyCard";
import { getPuppies } from "@/lib/db/puppies";
import type { PuppyFilters } from "@/lib/db/puppies";

export const metadata: Metadata = {
  title: "Available puppies",
  description:
    "Every listing shows real photos of the actual puppy. Open a profile to see them all, then ask us about them on WhatsApp.",
};

function filtersFromParam(filter?: string): PuppyFilters {
  switch (filter) {
    case "imported":
      return { location: "imported" };
    case "korean":
      return { koreanTeacup: true };
    case "maltipoo":
      return { breed: "Maltipoo" };
    case "pomeranian":
      return { breed: "Pomeranian" };
    case "poodle":
      return { breed: "Poodle" };
    case "cavapoo":
      return { breed: "Cavapoo" };
    case "shih":
      return { breed: "Shih" };
    case "boys":
      return { gender: "boy" };
    case "girls":
      return { gender: "girl" };
    default:
      return {};
  }
}

export default async function PuppiesPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string }>;
}) {
  const { filter } = await searchParams;
  const extra = filtersFromParam(filter);
  const [available, gone] = await Promise.all([
    getPuppies({ availability: "available", ...extra }),
    getPuppies({ availability: "gone_home", limit: 5 }),
  ]);

  return (
    <div className="sketchbook-page">
      <section
        className="mx-auto max-w-7xl px-4 pb-6 pt-10 md:px-6 md:pt-14"
        aria-label="Available puppies"
      >
        <div className="grid items-end gap-8 lg:grid-cols-12">
          <header className="lg:col-span-8">
            <p className="font-scrawl text-lg text-toffee-ink md:text-xl">
              from Teddy&apos;s sketchbook
            </p>
            <h1 className="sketchbook-title mt-2 font-plush text-[clamp(2.6rem,6.5vw,4.6rem)] font-extrabold leading-[0.95] tracking-tight text-cocoa">
              Available puppies
            </h1>
            <p className="mt-4 max-w-2xl text-[1.05rem] leading-relaxed text-cocoa-soft">
              Every listing shows real photos of the actual puppy. Open a profile to
              see them all, then ask us about them on WhatsApp.
            </p>
          </header>

          <aside className="sketch-selfportrait lg:col-span-4 lg:justify-self-end">
            <div className="sketch-selfportrait__frame" aria-hidden>
              <Image
                src="/brand/self-portrait.svg"
                alt=""
                width={260}
                height={208}
                priority
                className="sketch-selfportrait__pup"
              />
            </div>
            <p className="sketch-selfportrait__caption font-scrawl">self-portrait</p>
          </aside>
        </div>

        <div className="mt-10">
          <Suspense fallback={<div className="h-28 rounded-[1.75rem] bg-white/50" />}>
            <FilterChips />
          </Suspense>
        </div>

        <p className="mt-8 font-scrawl text-lg text-cocoa-soft">
          {available.length} {available.length === 1 ? "puppy" : "puppies"} looking for a
          home
        </p>

        {available.length === 0 ? (
          <p className="mt-10 rounded-3xl border-2 border-cocoa/15 bg-white/80 p-8 text-center text-cocoa-soft">
            No puppies match this filter right now. Try another filter or message us on
            WhatsApp.
          </p>
        ) : (
          <ul className="sketch-grid mt-8">
            {available.map((p, i) => (
              <li key={p.id}>
                <PuppyCard puppy={p} doodleIndex={i} />
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="sketch-gone" aria-label="Already gone home">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-14 md:px-6 md:py-20 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <h2 className="font-plush text-[clamp(2.2rem,5vw,3.6rem)] font-extrabold leading-tight text-cocoa">
              Already gone home
            </h2>
            <p className="mt-3 text-cocoa-soft">
              These puppies have found their families.
            </p>
            <Link href="/gone-home" className="btn btn-primary mt-8">
              See the puppies who&apos;ve gone home
            </Link>
          </div>

          <ul className="sketch-gone__row lg:col-span-8">
            {gone.map((p, i) => (
              <li key={p.id}>
                <PuppyCard puppy={p} doodleIndex={i + 3} />
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
