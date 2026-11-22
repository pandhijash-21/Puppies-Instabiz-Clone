"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { navLinks } from "@/content/static";
import { siteConfig } from "@/lib/config";
import { whatsappHref } from "@/lib/whatsapp";
import { cn } from "@/lib/utils/cn";

/** Active-page paw under nav links — fuller pad + four toes */
function PawMark({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="18"
      height="16"
      viewBox="0 0 28 24"
      fill="currentColor"
      aria-hidden
    >
      <ellipse cx="14" cy="16.2" rx="6.2" ry="5.2" />
      <ellipse cx="5.2" cy="9.2" rx="2.55" ry="3.1" transform="rotate(-18 5.2 9.2)" />
      <ellipse cx="10.2" cy="6.4" rx="2.7" ry="3.3" transform="rotate(-6 10.2 6.4)" />
      <ellipse cx="17.8" cy="6.4" rx="2.7" ry="3.3" transform="rotate(6 17.8 6.4)" />
      <ellipse cx="22.8" cy="9.2" rx="2.55" ry="3.1" transform="rotate(18 22.8 9.2)" />
    </svg>
  );
}

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.classList.toggle("tp-nav-open", open);
    return () => document.body.classList.remove("tp-nav-open");
  }, [open]);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header className="site-header sticky top-0 z-50">
      <div className="site-header__bar">
        <div className="mx-auto flex w-full max-w-[96rem] items-center justify-between gap-4 px-5 py-3 md:px-8 md:py-4 lg:px-10">
          <Link
            href="/"
            className="flex items-center gap-2.5 focus-ring rounded-full"
            aria-label={`${siteConfig.name} — home`}
          >
            <Image
              src="/brand/logo.png"
              alt=""
              width={52}
              height={52}
              className="h-[48px] w-[48px] rounded-full object-cover shadow-[0_2px_8px_rgba(42,23,14,0.18)] md:h-[52px] md:w-[52px]"
              priority
            />
            <span className="font-plush text-xl font-extrabold leading-none tracking-tight text-cocoa md:text-2xl">
              TeddyPups
            </span>
          </Link>

          <nav className="hidden items-center gap-3 lg:flex" aria-label="Main">
            {navLinks.map((link) => {
              const active =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "tp-nav-link relative px-3.5 py-2 text-[16px] font-bold text-cocoa transition hover:text-toffee-deep",
                    active && "font-extrabold text-toffee-deep",
                  )}
                  aria-current={active ? "page" : undefined}
                >
                  {link.label}
                  {active && (
                    <PawMark className="tp-nav-paw absolute -bottom-1 left-1/2 -translate-x-1/2 text-toffee-deep" />
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <a
              href={whatsappHref()}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-whatsapp hidden text-[15.2px] font-bold sm:inline-flex"
            >
              WhatsApp us
            </a>
            <button
              type="button"
              className="rounded-full border border-cocoa/20 p-2 lg:hidden focus-ring"
              aria-expanded={open}
              aria-controls="mobile-nav"
              onClick={() => setOpen((v) => !v)}
            >
              {open ? <X /> : <Menu />}
              <span className="sr-only">Menu</span>
            </button>
          </div>
        </div>

        {open && (
          <div
            id="mobile-nav"
            className="max-h-[calc(100svh-5.5rem)] overflow-y-auto border-t border-cocoa/10 bg-milk px-4 py-6 lg:hidden"
          >
            <nav aria-label="Mobile" className="space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="font-plush block py-2 text-[clamp(2rem,8vw,2.8rem)] font-extrabold text-cocoa"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            <a
              href={whatsappHref()}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-whatsapp mt-6 w-full font-bold"
            >
              WhatsApp us
            </a>
          </div>
        )}
      </div>

      <svg
        aria-hidden
        className="site-header__hem"
        width="100%"
        height="14"
        preserveAspectRatio="none"
      >
        <defs>
          <pattern id="tp-hem" width="44" height="14" patternUnits="userSpaceOnUse">
            <path d="M0 0H44V2A22 11 0 0 1 0 2Z" className="site-header__hem-fill" />
            <path d="M0 2A22 11 0 0 0 44 2" className="site-header__hem-line" />
          </pattern>
        </defs>
        <rect width="100%" height="14" fill="url(#tp-hem)" />
      </svg>
    </header>
  );
}
