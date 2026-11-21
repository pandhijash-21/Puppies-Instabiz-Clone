import type { Metadata } from "next";
import { ButtonLink } from "@/components/ui/Button";
import { PuppyCard } from "@/components/puppies/PuppyCard";
import { getPuppies } from "@/lib/db/puppies";
import { whatsappHref } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Gone home",
  description:
    "Every puppy here has already joined a loving family. Looking for one just like them? Tell us — we'll help you find your match.",
};

export default async function GoneHomePage() {
  const puppies = await getPuppies({ availability: "gone_home" });

  return (
    <section className="sketchbook-page mx-auto max-w-7xl px-4 py-12 md:px-6 md:py-16">
      <h1 className="font-plush text-[clamp(2.5rem,6vw,4.5rem)] font-extrabold text-cocoa">
        Gone home
      </h1>
      <p className="mt-3 max-w-2xl text-cocoa-soft">
        Every puppy here has already joined a loving family. Looking for one just like
        them? Tell us — we&apos;ll help you find your match.
      </p>

      {puppies.length === 0 ? (
        <p className="mt-10 text-cocoa-soft">No archive listings yet.</p>
      ) : (
        <ul className="sketch-grid mt-10">
          {puppies.map((p, i) => (
            <li key={p.id}>
              <PuppyCard puppy={p} doodleIndex={i} />
            </li>
          ))}
        </ul>
      )}

      <div className="mt-12 flex flex-wrap gap-3">
        <ButtonLink href={whatsappHref()} variant="whatsapp" target="_blank" rel="noopener noreferrer">
          WhatsApp us
        </ButtonLink>
        <ButtonLink href="/puppies" variant="ghost">
          See available puppies
        </ButtonLink>
      </div>
    </section>
  );
}
