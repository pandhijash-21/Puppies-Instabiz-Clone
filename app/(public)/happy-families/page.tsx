import type { Metadata } from "next";
import Image from "next/image";
import { FamilyWall } from "@/components/families/FamilyWall";
import { getFamilies } from "@/lib/db/families";
import { getReviews } from "@/lib/db/reviews";

export const metadata: Metadata = {
  title: "Happy families",
  description:
    "Nothing makes us happier than seeing our puppies in loving homes! Here are some beautiful moments shared by our amazing clients.",
};

export default async function HappyFamiliesPage() {
  const [families, reviews] = await Promise.all([
    getFamilies(),
    getReviews(),
  ]);
  const review = reviews[0];
  const photoCount = families.reduce(
    (n, f) => n + (f.family_images?.length || 0),
    0,
  );

  return (
    <div className="families-page">
      <span className="families-page__paw families-page__paw--a" aria-hidden />
      <span className="families-page__paw families-page__paw--b" aria-hidden />
      <span className="families-page__paw families-page__paw--c" aria-hidden />
      <span className="families-page__paw families-page__paw--d" aria-hidden />
      <span className="families-page__paw families-page__paw--e" aria-hidden />

      <section className="mx-auto max-w-7xl px-4 pb-6 pt-10 md:px-6 md:pt-14">
        <div className="grid items-start gap-10 lg:grid-cols-12 lg:gap-12">
          <header className="lg:col-span-6">
            <p className="font-scrawl text-xl text-toffee-ink md:text-2xl">
              our wall of happy endings
            </p>
            <h1 className="mt-2 font-plush text-[clamp(3rem,8vw,5.5rem)] font-extrabold leading-[0.92] tracking-tight text-cocoa">
              Happy
              <br />
              families{" "}
              <span className="inline-block text-toffee" aria-hidden>
                ♥
              </span>
            </h1>
            <p className="mt-5 max-w-xl text-[1.05rem] leading-relaxed text-cocoa-soft">
              Nothing makes us happier than seeing our puppies in loving homes! Here
              are some beautiful moments shared by our amazing clients after
              welcoming their furry friends.
            </p>
            <p className="mt-5 font-semibold text-cocoa">
              {Math.max(photoCount, 64)} moments and counting
            </p>
          </header>

          {review && (
            <aside className="families-note lg:col-span-5 lg:col-start-8">
              <span className="families-note__tape" aria-hidden />
              <blockquote>
                <p className="font-plush text-[1.05rem] leading-relaxed text-cocoa md:text-lg">
                  “{review.body}”
                </p>
                <footer className="mt-5 font-semibold text-cocoa-soft">
                  {review.author_name}
                  {review.author_location ? `, ${review.author_location}` : ""}
                </footer>
              </blockquote>
            </aside>
          )}
        </div>
      </section>

      <section
        className="mx-auto max-w-[92rem] px-3 pb-8 pt-4 md:px-6 md:pb-12 md:pt-8"
        aria-label="Family photo wall"
      >
        <FamilyWall families={families} />
      </section>

      <section
        className="families-closing mx-auto flex max-w-4xl flex-col items-center gap-5 px-4 pb-20 pt-6 text-center md:flex-row md:items-end md:justify-center md:gap-8 md:pb-28 md:text-left"
        aria-label="Closing note"
      >
        <div className="w-36 shrink-0 md:w-44">
          <Image
            src="/brand/walking-puppy.svg"
            alt=""
            width={176}
            height={141}
            className="mx-auto h-auto w-full drop-shadow-[0_12px_18px_rgba(42,23,14,.2)]"
          />
        </div>
        <p className="font-scrawl text-[clamp(1.6rem,4vw,2.4rem)] leading-snug text-cocoa">
          every one of them was a Teddy Pup once
        </p>
      </section>
    </div>
  );
}
