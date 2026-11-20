import Link from "next/link";
import { ButtonLink } from "@/components/ui/Button";
import { FaqAccordion } from "@/components/home/FaqAccordion";
import { FamilyMosaic } from "@/components/families/FamilyMosaic";
import { HeroGallery } from "@/components/home/HeroGallery";
import { HomeScrollBuddy } from "@/components/home/HomeScrollBuddy";
import { MeetPupsDoors } from "@/components/home/MeetPupsDoors";
import {
  breedChips,
  journeySteps,
  trustPoints,
} from "@/content/static";
import { getFamilies } from "@/lib/db/families";
import { getFaqs } from "@/lib/db/faqs";
import { getPuppies } from "@/lib/db/puppies";
import { getReviews } from "@/lib/db/reviews";
import { whatsappHref } from "@/lib/whatsapp";

export default async function HomePage() {
  const [puppies, homeFaqs, reviews, families] = await Promise.all([
    getPuppies({ availability: "available", limit: 15 }),
    getFaqs({ homeOnly: true }),
    getReviews({ homeOnly: true }),
    getFamilies({ limit: 8 }),
  ]);

  const heroPups = puppies.slice(0, 6);
  const review = reviews[0];

  return (
    <>
      <HomeScrollBuddy />
      <section className="tp-scene tp-hero overflow-x-clip" aria-label="Premium teacup puppies in Dubai">
        <div className="mx-auto max-w-5xl px-4 pb-8 pt-10 text-center md:px-6 md:pt-16">
          <p className="font-scrawl text-xl text-cocoa md:text-2xl">every puppy is family</p>
          <h1 className="mt-4 font-plush text-[clamp(2.8rem,8vw,5.5rem)] font-extrabold leading-[0.95] tracking-tight text-cocoa">
            Premium teacup puppies in Dubai
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-cocoa-soft">
            Meet your new best friend in our Dubai showroom, or order a rare miniature breed from
            trusted breeders worldwide.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <ButtonLink href="/puppies">View available puppies</ButtonLink>
            <ButtonLink href={whatsappHref()} variant="ghost" target="_blank" rel="noopener noreferrer">
              Enquire on WhatsApp
            </ButtonLink>
          </div>
        </div>

        <HeroGallery puppies={heroPups} />
      </section>

      <MeetPupsDoors puppies={puppies} />

      <section className="tp-scene tp-paths py-16 md:py-24" aria-label="Two ways to meet your puppy">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <h2 className="font-plush text-[clamp(2.2rem,5vw,4rem)] font-extrabold">
            Two ways to meet your puppy
          </h2>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            <article className="rounded-[2rem] bg-sky/40 p-8">
              <p className="font-scrawl text-sky-deep">In our showroom</p>
              <h3 className="mt-2 font-plush text-3xl font-bold">Puppies in Dubai</h3>
              <p className="mt-3 text-cocoa-soft">
                See them, love them, take them home. Come meet our locally available puppies before
                you decide.
              </p>
              <ButtonLink href="/puppies" className="mt-6" variant="ghost">
                Meet local puppies
              </ButtonLink>
            </article>
            <article className="rounded-[2rem] bg-honey-soft/70 p-8">
              <p className="font-scrawl text-toffee-ink">Exclusive Korean teacup puppies</p>
              <h3 className="mt-2 font-plush text-3xl font-bold">Imported for you</h3>
              <p className="mt-3 text-cocoa-soft">
                Exclusive Korean teacup puppies, delivered. Order from the world&apos;s most reputable
                breeders and let us handle the import.
              </p>
              <ButtonLink href="/puppies?filter=imported" className="mt-6">
                See imported puppies
              </ButtonLink>
            </article>
          </div>
        </div>
      </section>

      <section className="tp-scene tp-chat py-16 md:py-24" aria-label="Your puppy journey">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <h2 className="font-plush text-[clamp(2.2rem,5vw,4rem)] font-extrabold">
            Your puppy journey
          </h2>
          <p className="mt-3 max-w-2xl text-cocoa-soft">
            A premium, step-by-step concierge experience. We make adoption simple, secure, and
            purely joyful.
          </p>
          <ol className="mt-10 grid gap-6 md:grid-cols-3">
            {journeySteps.map((step, i) => (
              <li key={step.title} className="rounded-[1.75rem] bg-white/70 p-6 shadow-sm">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-toffee text-milk font-bold">
                  {i + 1}
                </span>
                <h3 className="mt-4 font-plush text-2xl font-bold">{step.title}</h3>
                <p className="mt-2 text-cocoa-soft">{step.body}</p>
              </li>
            ))}
          </ol>
          <div className="mt-10 flex flex-wrap gap-2">
            {breedChips.map((breed) => (
              <Link
                key={breed}
                href={`/puppies?filter=${breed.toLowerCase().replace(" ", "")}`}
                className="rounded-full border border-cocoa/20 bg-white px-4 py-2 text-sm font-semibold hover:border-toffee"
              >
                {breed}
              </Link>
            ))}
          </div>
          <div className="mt-8">
            <ButtonLink href="/how-it-works" variant="ghost">
              How it works
            </ButtonLink>
          </div>
        </div>
      </section>

      <section className="tp-scene tp-passport py-16 md:py-24" aria-label="Why families trust TeddyPups">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <h2 className="font-plush text-[clamp(2.2rem,5vw,4rem)] font-extrabold">
            Why families trust TeddyPups
          </h2>
          <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {trustPoints.map((item) => (
              <li key={item.title} className="rounded-3xl border border-cocoa/10 bg-white/80 p-6">
                <h3 className="font-plush text-xl font-bold">{item.title}</h3>
                <p className="mt-2 text-sm text-cocoa-soft">{item.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="tp-scene tp-dusk py-16 md:py-24" aria-label="Happy families & puppies">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <h2 className="font-plush text-[clamp(2.2rem,5vw,4rem)] font-extrabold text-milk">
            Happy families & puppies
          </h2>
          <p className="mt-3 max-w-3xl text-milk/80">
            We are truly honored to see our puppies become cherished members of loving families.
            These heartwarming moments have been shared by our valued clients who welcomed a Teddy
            Pup into their homes and hearts.
          </p>
          {review && (
            <blockquote className="mt-8 max-w-3xl rounded-3xl bg-white/10 p-6 text-lg text-milk/90">
              <p>“{review.body}”</p>
              <footer className="mt-4 font-scrawl text-honey">
                {review.author_name}
                {review.author_location ? `, ${review.author_location}` : ""}
              </footer>
            </blockquote>
          )}
          <div className="mt-10">
            <FamilyMosaic families={families} />
          </div>
          <div className="mt-10">
            <ButtonLink href="/happy-families" variant="ghost" className="border-milk text-milk">
              See every happy family
            </ButtonLink>
          </div>
        </div>
      </section>

      <section className="tp-scene tp-night py-16 md:py-24" aria-label="Questions, answered">
        <div className="mx-auto max-w-3xl px-4 md:px-6">
          <h2 className="font-plush text-[clamp(2.2rem,5vw,4rem)] font-extrabold text-milk">
            Questions, answered
          </h2>
          <div className="mt-8">
            <FaqAccordion faqs={homeFaqs} inverted />
          </div>
          <div className="mt-8">
            <ButtonLink href="/faq" variant="ghost" className="border-milk text-milk">
              Read all questions
            </ButtonLink>
          </div>
        </div>
      </section>

      <section className="tp-scene tp-home py-16 md:py-24" aria-label="Ready to meet your new best friend?">
        <div className="mx-auto max-w-3xl px-4 text-center md:px-6">
          <h2 className="font-plush text-[clamp(2.2rem,5vw,3.5rem)] font-extrabold">
            Ready to meet your new best friend?
          </h2>
          <p className="mt-4 text-cocoa-soft">
            Bring home a healthy, happy teacup or designer puppy with expert guidance every step of
            the way. We help you find the right match and ensure a smooth, safe delivery across the
            UAE.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <ButtonLink href={whatsappHref()} variant="whatsapp" target="_blank" rel="noopener noreferrer">
              Enquire on WhatsApp
            </ButtonLink>
            <ButtonLink href="/contact" variant="ghost">
              Visit & contact
            </ButtonLink>
          </div>
        </div>
      </section>
    </>
  );
}
