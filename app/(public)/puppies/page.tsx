import { Suspense } from "react";
import type { Metadata } from "next";
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
    <div className="tp-scene tp-meet">
      <section className="mx-auto max-w-7xl px-4 py-12 md:px-6 md:py-16" aria-label="Available puppies">
        <p className="font-scrawl text-lg text-toffee-ink">from Teddy&apos;s sketchbook</p>
        <h1 className="mt-2 font-plush text-[clamp(2.5rem,6vw,4.5rem)] font-extrabold">
          Available puppies
        </h1>
        <p className="mt-3 max-w-2xl text-cocoa-soft">
          Every listing shows real photos of the actual puppy. Open a profile to see them all, then
          ask us about them on WhatsApp.
        </p>

        <div className="mt-8">
          <Suspense fallback={<div className="h-10" />}>
            <FilterChips />
          </Suspense>
        </div>

        <p className="mt-6 font-scrawl text-cocoa-soft">
          {available.length} {available.length === 1 ? "puppy" : "puppies"} looking for a home
        </p>

        {available.length === 0 ? (
          <p className="mt-10 rounded-3xl bg-white/70 p-8 text-center text-cocoa-soft">
            No puppies match this filter right now. Try another filter or message us on WhatsApp.
          </p>
        ) : (
          <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {available.map((p) => (
              <PuppyCard key={p.id} puppy={p} />
            ))}
          </div>
        )}
      </section>

      <section className="border-t border-cocoa/10 bg-honey-soft/30 py-16" aria-label="Already gone home">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <h2 className="font-plush text-4xl font-extrabold">Already gone home</h2>
          <p className="mt-2 text-cocoa-soft">These puppies have found their families.</p>
          <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-5">
            {gone.map((p) => (
              <PuppyCard key={p.id} puppy={p} />
            ))}
          </div>
          <Link
            href="/gone-home"
            className="mt-8 inline-block font-semibold text-toffee-deep underline underline-offset-4"
          >
            See the puppies who&apos;ve gone home
          </Link>
        </div>
      </section>
    </div>
  );
}
