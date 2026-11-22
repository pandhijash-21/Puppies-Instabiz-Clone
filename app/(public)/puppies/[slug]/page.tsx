import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ButtonLink } from "@/components/ui/Button";
import { EnquiryForm } from "@/components/forms/EnquiryForm";
import { MediaGallery } from "@/components/puppies/MediaGallery";
import { PuppyRibbon } from "@/components/puppies/PuppyRibbon";
import { TeddyFace } from "@/components/brand/TeddyFace";
import { importedHomeSteps, localHomeSteps, puppyComesWith } from "@/content/static";
import { getAdjacentPuppies, getPuppyBySlug } from "@/lib/db/puppies";
import {
  featuredImage,
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

function CheckIcon() {
  return (
    <svg viewBox="0 0 32 32" className="mt-0.5 size-6 shrink-0 text-toffee-deep" aria-hidden>
      <path
        d="M5 17l7 7L27 8"
        fill="none"
        stroke="currentColor"
        strokeWidth="3.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
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
  const tone = "#383848";
  const enquireId = `enquire-${slug}`;

  return (
    <article
      className="tp-storybook"
      style={{
        background: `linear-gradient(180deg, color-mix(in oklab, ${tone} 24%, var(--color-milk)) 0, var(--color-milk) 85%)`,
      }}
    >
      <PuppyRibbon />

      <div className="gutter mx-auto max-w-[110rem] pt-8 pb-20 md:pt-12">
        <nav aria-label="Breadcrumb" className="text-[0.95rem] font-semibold text-cocoa-soft">
          <Link href="/puppies" className="link-ink">
            Available puppies
          </Link>
          <span aria-hidden> / </span>
          <span aria-current="page">{name}</span>
        </nav>

        <p className="tp-chapter">
          <span aria-hidden className="tp-chapter__n font-plush">
            1
          </span>
          <span className="font-scrawl">hello, it&apos;s me</span>
        </p>

        <div className="mt-4 grid gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="min-w-0 lg:col-span-7">
            <MediaGallery media={media} name={name} />
          </div>

          <div className="min-w-0 lg:col-span-5">
            <div className="lg:sticky lg:top-[calc(var(--header-h)+5.5rem)]">
              <div className="tp-tag tp-board mt-16 !rounded-[2.2rem_2.2rem_2.2rem_0.6rem] !p-7 md:!p-9 lg:mt-20">
                <span aria-hidden className="tp-tag__ring" />
                <div className="pup-buddy absolute -top-[4.8rem] right-6 w-[9.5rem]" aria-hidden>
                  <TeddyFace crop="head" className="h-auto w-full drop-shadow-md" />
                </div>

                <span className="inline-flex items-center gap-1.5 rounded-full bg-honey-soft px-3 py-1 text-xs font-semibold text-cocoa">
                  <span aria-hidden>🐾</span>
                  {puppy.availability === "available" ? "Available" : "Gone home"}
                </span>

                <h1 className="font-plush mt-4 text-[clamp(2.1rem,4.5vw,3.1rem)] leading-[0.98] font-extrabold">
                  {name}
                </h1>

                <dl className="mt-6 grid grid-cols-2 gap-x-4 gap-y-4">
                  {[
                    ["Breed", puppy.breed],
                    ["Boy or girl", genderLabel(puppy.gender)],
                    ["Age", puppy.age_label],
                    ["Where", locationLabel(puppy.location_type)],
                  ].map(([label, value]) => (
                    <div key={label}>
                      <dt className="text-sm font-semibold text-cocoa-soft">{label}</dt>
                      <dd className="mt-0.5 font-semibold">{value}</dd>
                    </div>
                  ))}
                </dl>

                <div className="mt-8 flex flex-col gap-3">
                  <ButtonLink
                    href={whatsappHref(puppyWhatsAppMessage(puppy))}
                    variant="whatsapp"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full justify-center"
                  >
                    Ask about this puppy on WhatsApp
                  </ButtonLink>
                  <ButtonLink href={`#${enquireId}`} variant="ghost" className="w-full justify-center">
                    Send an enquiry
                  </ButtonLink>
                </div>
              </div>

              <div className="tp-paper mt-8 -rotate-1">
                <p className="tp-chapter">
                  <span aria-hidden className="tp-chapter__n font-plush">
                    2
                  </span>
                  <span className="font-scrawl">what comes with this {name}</span>
                </p>
                <h2 className="font-plush mt-1 text-[1.9rem] font-extrabold">
                  Every Teddy Pup comes
                </h2>
                <ul className="mt-4 space-y-2.5">
                  {puppyComesWith.map((item) => (
                    <li key={item} className="flex items-start gap-3 font-semibold">
                      <CheckIcon />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        <section
          className="mt-20"
          aria-label={
            puppy.location_type === "imported"
              ? "Coming home from abroad"
              : "Coming home from our showroom"
          }
        >
          <p className="tp-chapter">
            <span aria-hidden className="tp-chapter__n font-plush">
              3
            </span>
            <span className="font-scrawl">the way home</span>
          </p>
          <h2 className="font-plush mt-2 text-[clamp(1.9rem,4vw,2.75rem)] font-extrabold">
            {puppy.location_type === "imported"
              ? "Coming home from abroad"
              : "Coming home from our showroom"}
          </h2>
          <ol className="tp-trail tp-trail--row tp-trail--paws mt-10">
            {steps.map((step, i) => (
              <li key={step.title}>
                <span aria-hidden className="tp-trail__num font-plush">
                  {i + 1}
                </span>
                <h3 className="font-plush text-xl leading-tight font-bold">{step.title}</h3>
                <p className="mt-2 max-w-[38ch] text-cocoa-soft">{step.body}</p>
              </li>
            ))}
          </ol>
        </section>

        <section
          id={enquireId}
          aria-labelledby={`${enquireId}-title`}
          className="tp-letter mt-20 grid gap-10 lg:grid-cols-12"
        >
          <span aria-hidden className="tp-letter__stamp">
            <svg viewBox="0 0 64 64" className="size-9" fill="currentColor">
              <path d="M32 30.5c-7.6 0-15.6 8.3-15.6 15.5 0 5.4 4.2 8.3 9.2 8.3 2.6 0 4.5-1.1 6.4-1.1s3.8 1.1 6.4 1.1c5 0 9.2-2.9 9.2-8.3 0-7.2-8-15.5-15.6-15.5zM19.28 26.71C21.07 30.08 20.42 33.92 17.84 35.29C15.25 36.67 11.71 35.05 9.92 31.69C8.13 28.32 8.78 24.48 11.36 23.11C13.95 21.73 17.49 23.35 19.28 26.71ZM29.62 15.64C30.32 19.62 28.46 23.26 25.47 23.79C22.48 24.32 19.48 21.53 18.78 17.56C18.08 13.58 19.94 9.94 22.93 9.41C25.92 8.88 28.92 11.67 29.62 15.64ZM45.22 17.56C44.52 21.53 41.52 24.32 38.53 23.79C35.54 23.26 33.68 19.62 34.38 15.64C35.08 11.67 38.08 8.88 41.07 9.41C44.06 9.94 45.92 13.58 45.22 17.56ZM54.08 31.69C52.29 35.05 48.75 36.67 46.16 35.29C43.58 33.92 42.93 30.08 44.72 26.71C46.51 23.35 50.05 21.73 52.64 23.11C55.22 24.48 55.87 28.32 54.08 31.69Z" />
            </svg>
          </span>
          <div className="lg:col-span-4">
            <p className="tp-chapter">
              <span aria-hidden className="tp-chapter__n font-plush">
                4
              </span>
              <span className="font-scrawl">dear TeddyPups…</span>
            </p>
            <h2
              id={`${enquireId}-title`}
              className="font-plush mt-2 text-[clamp(1.9rem,4vw,2.75rem)] font-extrabold"
            >
              Ask about this puppy
            </h2>
            <p className="mt-4 text-cocoa-soft">
              Leave your details and our team will get back to you promptly — or message us on
              WhatsApp for the quickest reply.
            </p>
          </div>
          <div className="lg:col-span-7 lg:col-start-6">
            <EnquiryForm mode="puppy" puppy={puppy} />
          </div>
        </section>

        <nav aria-label="More puppies" className="mt-16 grid gap-4 sm:grid-cols-2">
          {prev && (
            <AdjacentCard
              href={`/puppies/${prev.slug}`}
              label="Previous pup"
              name={puppyDisplayName(prev)}
              image={featuredImage(prev.puppy_images)?.url}
              reverse={false}
            />
          )}
          {next && (
            <AdjacentCard
              href={`/puppies/${next.slug}`}
              label="Next pup"
              name={puppyDisplayName(next)}
              image={featuredImage(next.puppy_images)?.url}
              reverse
            />
          )}
        </nav>
      </div>
    </article>
  );
}

function AdjacentCard({
  href,
  label,
  name,
  image,
  reverse,
}: {
  href: string;
  label: string;
  name: string;
  image?: string;
  reverse?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`group flex items-center gap-5 rounded-[2rem] border-[3px] border-cocoa bg-milk p-4 transition-transform duration-500 hover:-rotate-1 ${
        reverse ? "sm:flex-row-reverse sm:text-right" : ""
      }`}
    >
      <span className="relative h-24 w-20 shrink-0 overflow-hidden rounded-[999px_999px_0.6rem_0.6rem] border-[3px] border-cocoa bg-honey-soft">
        {image ? (
          <Image src={image} alt="" fill className="object-cover" sizes="80px" />
        ) : null}
      </span>
      <span className="min-w-0">
        <span className="block text-sm font-semibold text-cocoa-soft">{label}</span>
        <span className="font-plush mt-1 block text-2xl font-extrabold">{name}</span>
      </span>
    </Link>
  );
}
