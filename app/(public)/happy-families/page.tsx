import type { Metadata } from "next";
import { FamilyMosaic } from "@/components/families/FamilyMosaic";
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
    <section className="tp-scene tp-meet mx-auto max-w-7xl px-4 py-12 md:px-6 md:py-16">
      <h1 className="font-plush text-[clamp(2.5rem,6vw,4.5rem)] font-extrabold">
        Happy families
      </h1>
      <p className="mt-3 max-w-3xl text-cocoa-soft">
        Nothing makes us happier than seeing our puppies in loving homes! Here are some beautiful
        moments shared by our amazing clients after welcoming their furry friends.
      </p>
      <p className="mt-4 font-scrawl text-lg text-toffee-ink">
        {Math.max(photoCount, 64)} moments and counting
      </p>

      {review && (
        <blockquote className="mt-10 max-w-3xl rounded-[2rem] bg-white/80 p-6 shadow-sm">
          <p className="text-lg text-cocoa">“{review.body}”</p>
          <footer className="mt-4 font-scrawl text-toffee-ink">
            {review.author_name}
            {review.author_location ? `, ${review.author_location}` : ""}
          </footer>
        </blockquote>
      )}

      <div className="mt-10">
        <FamilyMosaic families={families} />
      </div>

      <p className="mt-12 text-center font-scrawl text-2xl text-cocoa">
        every one of them was a Teddy Pup once
      </p>
    </section>
  );
}
