import Image from "next/image";
import { siteConfig } from "@/lib/config";

function PawIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 64 64" fill="currentColor" aria-hidden>
      <path d="M32 30.5c-7.6 0-15.6 8.3-15.6 15.5 0 5.4 4.2 8.3 9.2 8.3 2.6 0 4.5-1.1 6.4-1.1s3.8 1.1 6.4 1.1c5 0 9.2-2.9 9.2-8.3 0-7.2-8-15.5-15.6-15.5zM19.28 26.71C21.07 30.08 20.42 33.92 17.84 35.29C15.25 36.67 11.71 35.05 9.92 31.69C8.13 28.32 8.78 24.48 11.36 23.11C13.95 21.73 17.49 23.35 19.28 26.71ZM29.62 15.64C30.32 19.62 28.46 23.26 25.47 23.79C22.48 24.32 19.48 21.53 18.78 17.56C18.08 13.58 19.94 9.94 22.93 9.41C25.92 8.88 28.92 11.67 29.62 15.64ZM45.22 17.56C44.52 21.53 41.52 24.32 38.53 23.79C35.54 23.26 33.68 19.62 34.38 15.64C35.08 11.67 38.08 8.88 41.07 9.41C44.06 9.94 45.92 13.58 45.22 17.56ZM54.08 31.69C52.29 35.05 48.75 36.67 46.16 35.29C43.58 33.92 42.93 30.08 44.72 26.71C46.51 23.35 50.05 21.73 52.64 23.11C55.22 24.48 55.87 28.32 54.08 31.69Z" />
    </svg>
  );
}

export function VisitShopfront({ photoUrl }: { photoUrl?: string | null }) {
  const src = photoUrl || "/brand/teddy-mascot.jpg";

  return (
    <section aria-labelledby="visit-title" className="tp-shopfront mt-12">
      <svg
        viewBox="0 0 300 120"
        className="pointer-events-none absolute -bottom-1 right-0 w-3/4 text-toffee/30"
        aria-hidden
      >
        <path
          d="M4 116h292M20 116V78h16v38M44 116V60h18v56M70 116V84h12v32M150 116V36l4-6v-14l3-4 3 4v14l4 6v80M118 116V70l12-8v54M174 116V64l14 8v44M200 116V82h18v34M226 116V56h14v60M248 116V88h22v28"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      <div className="tp-visit relative p-7 pt-6">
        <div>
          <h2 id="visit-title" className="font-plush text-[2rem] leading-tight text-cocoa">
            Visit us in Downtown Dubai
          </h2>
          <p className="mt-3 max-w-[38ch] text-cocoa-soft">
            Step into our Downtown Dubai showroom and experience the joy of choosing your puppy
            face-to-face.
          </p>
          <p className="mt-4 flex items-center gap-2 font-semibold text-cocoa">
            <PawIcon className="size-5 shrink-0 text-toffee-deep" />
            {siteConfig.address}
          </p>
          <a
            href={siteConfig.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-ghost mt-6 !bg-milk"
          >
            Open in Google Maps
          </a>
        </div>

        <figure className="tp-visit__photo">
          <Image
            src={src}
            alt="A fluffy puppy from our Downtown Dubai showroom"
            fill
            className="object-cover"
            sizes="(min-width: 640px) 11rem, 90vw"
          />
        </figure>
      </div>
    </section>
  );
}
