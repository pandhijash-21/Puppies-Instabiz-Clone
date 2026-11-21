import { HappyFamiliesHome } from "@/components/home/HappyFamiliesHome";
import { HeroGallery } from "@/components/home/HeroGallery";
import { HomeScrollBuddy } from "@/components/home/HomeScrollBuddy";
import { MeetPupsDoors } from "@/components/home/MeetPupsDoors";
import { PassportTrust } from "@/components/home/PassportTrust";
import { PuppyJourney } from "@/components/home/PuppyJourney";
import { QuestionsNight } from "@/components/home/QuestionsNight";
import { ReadyHomeCTA } from "@/components/home/ReadyHomeCTA";
import { TwoWaysPaths } from "@/components/home/TwoWaysPaths";
import { ButtonLink } from "@/components/ui/Button";
import { getFamilies } from "@/lib/db/families";
import { getFaqs } from "@/lib/db/faqs";
import { getPuppies } from "@/lib/db/puppies";
import { getReviews } from "@/lib/db/reviews";
import { featuredImage } from "@/lib/utils/format";
import { whatsappHref } from "@/lib/whatsapp";

export default async function HomePage() {
  const [puppies, homeFaqs, reviews, families] = await Promise.all([
    getPuppies({ availability: "available", limit: 15 }),
    getFaqs({ homeOnly: true }),
    getReviews({ homeOnly: true }),
    getFamilies({ limit: 8 }),
  ]);

  const heroPups = puppies.slice(0, 6);
  const review = reviews[0] ?? null;
  const doorPup = puppies[0] ?? null;
  const doorImg = doorPup ? featuredImage(doorPup.puppy_images) : null;

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
            <ButtonLink href={whatsappHref()} variant="whatsapp" target="_blank" rel="noopener noreferrer">
              Enquire on WhatsApp
            </ButtonLink>
          </div>
        </div>

        <HeroGallery puppies={heroPups} />
      </section>

      <MeetPupsDoors puppies={puppies} />

      <TwoWaysPaths puppies={puppies} />

      <PuppyJourney puppies={puppies} />

      <PassportTrust />

      <HappyFamiliesHome review={review} families={families} />

      <QuestionsNight faqs={homeFaqs} />

      <ReadyHomeCTA
        puppySrc={doorImg?.url ?? null}
        puppyName={doorPup?.name ?? "a TeddyPups puppy"}
      />
    </>
  );
}
