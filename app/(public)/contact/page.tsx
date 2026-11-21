import type { Metadata } from "next";
import Image from "next/image";
import { VisitShopfront } from "@/components/contact/VisitShopfront";
import { EnquiryForm } from "@/components/forms/EnquiryForm";
import { siteConfig } from "@/lib/config";
import { getPuppies } from "@/lib/db/puppies";
import { whatsappHref } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Visit & contact",
  description:
    "Visit TeddyPups in Downtown Dubai or get in touch on WhatsApp, by phone or email.",
};

export default async function ContactPage() {
  const puppies = await getPuppies({ availability: "available" });
  const visitPhoto =
    puppies.find((p) => p.puppy_images?.some((i) => i.media_type === "image"))?.puppy_images?.find(
      (i) => i.media_type === "image",
    )?.url ?? null;

  const telHref = `tel:${siteConfig.phoneDisplay.replace(/\D/g, "")}`;

  return (
    <section className="tp-scene tp-contact" aria-label="Get in touch with us">
      <div className="mx-auto max-w-[110rem] px-4 pb-24 pt-10 md:px-8 md:pt-16 lg:px-12">
        <header className="grid gap-6 lg:grid-cols-12 lg:items-end">
          <h1 className="tp-giant max-w-[12ch] text-cocoa lg:col-span-7">
            Get in touch with us
          </h1>
          <p className="max-w-xl text-base leading-relaxed text-cocoa-soft md:text-lg lg:col-span-5 lg:pb-3">
            Have questions about our puppies or adoption process? Fill out the form, and our team
            will get back to you promptly. Whether ready to adopt or just seeking info, we&apos;d
            love to hear from you!
          </p>
        </header>

        <div className="mt-12 grid gap-12 lg:grid-cols-12 lg:gap-14">
          {/* Letter form — right on desktop */}
          <div className="lg:col-span-7 lg:col-start-6 lg:row-start-1">
            <EnquiryForm mode="letter" puppies={puppies} />
            <div className="ml-auto mr-6 -mt-3 hidden w-36 md:block md:w-40">
              <Image
                src="/brand/walking-puppy.svg"
                alt=""
                width={160}
                height={128}
                className="h-auto w-full drop-shadow-[0_10px_16px_rgba(42,23,14,.18)]"
              />
            </div>
          </div>

          {/* Channels + visit — left on desktop */}
          <div className="lg:col-span-5 lg:row-start-1">
            <a
              href={whatsappHref()}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-whatsapp w-full shadow-[0_0.5rem_0_-0.15rem_var(--color-cocoa)] sm:w-auto"
            >
              WhatsApp {siteConfig.phoneDisplay}
            </a>

            <dl className="mt-10 space-y-6">
              <div>
                <dt className="font-scrawl text-cocoa-soft">call us</dt>
                <dd className="mt-1 text-lg font-semibold">
                  <a href={telHref} className="link-ink">
                    {siteConfig.phoneDisplay}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="font-scrawl text-cocoa-soft">email</dt>
                <dd className="mt-1 break-all text-lg font-semibold">
                  <a href={`mailto:${siteConfig.email}`} className="link-ink">
                    {siteConfig.email}
                  </a>
                </dd>
              </div>
            </dl>

            <VisitShopfront photoUrl={visitPhoto} />
          </div>
        </div>
      </div>
    </section>
  );
}
