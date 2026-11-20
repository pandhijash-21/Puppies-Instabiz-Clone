import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ButtonLink } from "@/components/ui/Button";
import { EnquiryForm } from "@/components/forms/EnquiryForm";
import { MediaGallery } from "@/components/puppies/MediaGallery";
import { importedHomeSteps, localHomeSteps, puppyComesWith } from "@/content/static";
import { getAdjacentPuppies, getPuppyBySlug } from "@/lib/db/puppies";
import {
  genderLabel,
  locationLabel,
  puppyDisplayName,
} from "@/lib/utils/format";
import { puppyWhatsAppMessage, whatsappHref } from "@/lib/whatsapp";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const puppy = await getPuppyBySlug(slug);
  if (!puppy) return { title: "Puppy not found" };
  const name = puppyDisplayName(puppy);
  return {
    title: `${name}, ${puppy.breed} puppy`,
    description: `Meet ${name}, a ${puppy.age_label} ${puppy.breed}. Enquire on WhatsApp with TeddyPups U.A.E.`,
  };
}

export default async function PuppyDetailPage({ params }: Props) {
  const { slug } = await params;
  const puppy = await getPuppyBySlug(slug);
  if (!puppy) notFound();

  const { prev, next } = await getAdjacentPuppies(slug);
  const name = puppyDisplayName(puppy);
  const steps =
    puppy.location_type === "dubai_showroom" ? localHomeSteps : importedHomeSteps;
  const media = [...(puppy.puppy_images || [])].sort((a, b) => a.sort_order - b.sort_order);

  return (
    <div className="tp-scene tp-meet">
      <div className="mx-auto max-w-7xl px-4 py-10 md:px-6 md:py-14">
        <nav aria-label="Breadcrumb" className="text-sm text-cocoa-soft">
          <Link href="/puppies" className="underline underline-offset-2">
            Available puppies
          </Link>
          <span aria-hidden> / </span>
          <span>{name}</span>
        </nav>

        <p className="mt-8 font-scrawl text-lg text-toffee-ink">
          <span className="mr-2 inline-flex h-8 w-8 items-center justify-center rounded-full border-2 border-toffee font-plush text-sm font-bold text-toffee">
            1
          </span>
          hello, it&apos;s me
        </p>

        <div className="mt-6 grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <MediaGallery media={media} name={name} />

          <div>
            <div className="dotted-card relative p-6 md:p-8">
              <span className="inline-flex items-center gap-1 rounded-full bg-honey-soft px-3 py-1 text-xs font-semibold text-cocoa">
                {puppy.availability === "available" ? "Available" : "Gone home"}
              </span>
              <h1 className="mt-4 font-plush text-5xl font-extrabold">{name}</h1>
              <p className="mt-1 text-xl text-cocoa-soft">{puppy.breed}</p>

              <dl className="mt-6 grid grid-cols-2 gap-4">
                {[
                  ["Breed", puppy.breed],
                  ["Boy or girl", genderLabel(puppy.gender)],
                  ["Age", puppy.age_label],
                  ["Where", locationLabel(puppy.location_type)],
                ].map(([label, value]) => (
                  <div key={label}>
                    <dt className="font-scrawl text-sm text-cocoa-soft">{label}</dt>
                    <dd className="font-semibold">{value}</dd>
                  </div>
                ))}
              </dl>

              <div className="mt-8 flex flex-col gap-3">
                <ButtonLink
                  href={whatsappHref(puppyWhatsAppMessage(puppy))}
                  variant="whatsapp"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Ask about {name} on WhatsApp
                </ButtonLink>
                <ButtonLink href="#enquiry" variant="ghost">
                  Send an enquiry
                </ButtonLink>
              </div>
            </div>

            <div className="mt-10">
              <p className="font-scrawl text-lg text-toffee-ink">
                <span className="mr-2 inline-flex h-8 w-8 items-center justify-center rounded-full border-2 border-toffee font-plush text-sm font-bold text-toffee">
                  2
                </span>
                what comes with {name}
              </p>
              <h2 className="mt-3 font-plush text-3xl font-extrabold">Every Teddy Pup comes</h2>
              <ul className="mt-4 space-y-2">
                {puppyComesWith.map((item) => (
                  <li key={item} className="flex gap-2">
                    <span className="text-toffee" aria-hidden>
                      ✓
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <section className="mt-16" aria-label={puppy.location_type === "imported" ? "Coming home from abroad" : "Coming home"}>
          <p className="font-scrawl text-lg text-toffee-ink">
            <span className="mr-2 inline-flex h-8 w-8 items-center justify-center rounded-full border-2 border-toffee font-plush text-sm font-bold text-toffee">
              3
            </span>
            the way home
          </p>
          <h2 className="mt-3 font-plush text-4xl font-extrabold">
            {puppy.location_type === "imported"
              ? "Coming home from abroad"
              : "Coming home from our showroom"}
          </h2>
          <ol className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, i) => (
              <li key={step.title} className="rounded-3xl bg-white/80 p-5 shadow-sm">
                <span className="font-plush text-2xl font-bold text-toffee">{i + 1}</span>
                <h3 className="mt-2 font-plush text-xl font-bold">{step.title}</h3>
                <p className="mt-2 text-sm text-cocoa-soft">{step.body}</p>
              </li>
            ))}
          </ol>
        </section>

        <section id="enquiry" className="mt-16 max-w-2xl" aria-label={`Ask about ${name}`}>
          <p className="font-scrawl text-lg text-toffee-ink">
            <span className="mr-2 inline-flex h-8 w-8 items-center justify-center rounded-full border-2 border-toffee font-plush text-sm font-bold text-toffee">
              4
            </span>
            dear TeddyPups…
          </p>
          <h2 className="mt-3 font-plush text-4xl font-extrabold">Ask about {name}</h2>
          <p className="mt-2 text-cocoa-soft">
            Leave your details and our team will get back to you promptly — or message us on
            WhatsApp for the quickest reply.
          </p>
          <div className="mt-6">
            <EnquiryForm mode="puppy" puppy={puppy} />
          </div>
        </section>

        <nav aria-label="More puppies" className="mt-16 flex flex-wrap items-center justify-between gap-4 border-t border-cocoa/10 pt-8">
          {prev && (
            <Link href={`/puppies/${prev.slug}`} className="font-semibold text-toffee-deep">
              ← Previous pup {puppyDisplayName(prev)}
            </Link>
          )}
          {next && (
            <Link href={`/puppies/${next.slug}`} className="ml-auto font-semibold text-toffee-deep">
              Next pup {puppyDisplayName(next)} →
            </Link>
          )}
        </nav>
      </div>
    </div>
  );
}
