import Image from "next/image";
import Link from "next/link";
import { FooterBasketBuddy } from "@/components/layout/FooterBasketBuddy";
import { footerExplore } from "@/content/static";
import { siteConfig } from "@/lib/config";
import { whatsappHref } from "@/lib/whatsapp";

function CrescentMoon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      <path d="M14.5 2.1a9.8 9.8 0 0 0-1.2.08 9.2 9.2 0 1 0 8.5 12.9A8.2 8.2 0 0 1 14.5 2.1Z" />
    </svg>
  );
}

export function SiteFooter() {
  return (
    <footer className="site-footer relative text-milk">
      <svg
        aria-hidden
        viewBox="0 0 1440 80"
        preserveAspectRatio="none"
        className="site-footer__hill"
      >
        <path
          fill="currentColor"
          d="M0 80V44c120-30 240-44 360-30s240 46 360 34 240-58 360-46 240 40 360 26v52z"
        />
      </svg>

      <div className="site-footer__sky relative">
        <span className="footer-star left-[10%] top-12" />
        <span className="footer-star footer-star--lg left-[22%] top-28" />
        <span className="footer-star left-[38%] top-16" />
        <span className="footer-star right-[24%] top-20" />
        <span className="footer-star footer-star--lg right-[12%] top-32" />
        <span className="footer-star right-[6%] top-14" />
        <span className="footer-moon" aria-hidden>
          <CrescentMoon />
        </span>

        <div className="relative mx-auto grid max-w-[110rem] gap-12 px-4 pt-16 md:grid-cols-12 md:gap-x-12 md:gap-y-6 md:px-8 md:pt-24 lg:px-12">
          <div className="md:col-span-5">
            <p className="tp-big text-honey-soft">Home, at last.</p>
            <p className="mt-5 max-w-md text-[15px] leading-relaxed text-milk/80">
              TeddyPups U.A.E. is a Dubai-based brand specializing in miniature puppies, offering
              premium services and worldwide shipping.
            </p>
          </div>

          <div className="order-last md:order-none md:col-span-5 md:col-start-1 md:row-start-2">
            <FooterBasketBuddy />
          </div>

          <nav
            aria-label="Footer"
            className="md:col-span-3 md:col-start-7 md:row-span-2 md:row-start-1"
          >
            <h2 className="font-scrawl text-lg text-honey">Explore</h2>
            <ul className="mt-4 space-y-2.5">
              {footerExplore.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="font-semibold text-milk/90 underline-offset-4 transition hover:text-honey hover:underline"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="md:col-span-3 md:row-span-2 md:row-start-1">
            <h2 className="font-scrawl text-lg text-honey">Say hello</h2>
            <ul className="mt-4 space-y-2.5 text-milk/90">
              <li>
                <a
                  href={whatsappHref()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold transition hover:text-honey"
                >
                  WhatsApp {siteConfig.phoneDisplay}
                </a>
              </li>
              <li>
                <a href={`mailto:${siteConfig.email}`} className="break-all transition hover:text-honey">
                  {siteConfig.email}
                </a>
              </li>
              <li>{siteConfig.address}</li>
            </ul>
            <div className="mt-5 flex flex-wrap gap-2">
              {[
                { href: siteConfig.instagram, label: "Instagram" },
                { href: siteConfig.tiktok, label: "TikTok" },
                { href: siteConfig.facebook, label: "Facebook" },
              ].map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-milk/40 px-4 py-1.5 text-sm text-milk/90 transition hover:border-honey hover:text-honey"
                >
                  {s.label}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="relative mx-auto mt-12 flex max-w-[110rem] flex-col items-start justify-between gap-4 border-t border-milk/15 px-4 py-6 text-sm text-milk/60 md:mt-16 md:flex-row md:items-center md:px-8 lg:px-12">
          <div className="flex items-center gap-2">
            <Image src="/brand/logo.png" alt="" width={32} height={32} className="rounded-full object-cover" />
            <span>
              © {new Date().getFullYear()} {siteConfig.name}
            </span>
          </div>
          <p className="font-scrawl text-base text-honey/80">every puppy is family</p>
        </div>
      </div>
    </footer>
  );
}
