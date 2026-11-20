"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { navLinks } from "@/content/static";
import { siteConfig } from "@/lib/config";
import { whatsappHref } from "@/lib/whatsapp";
import { cn } from "@/lib/utils/cn";

function PawMark({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      <ellipse cx="12" cy="15.5" rx="5" ry="4.2" />
      <circle cx="6.5" cy="9.5" r="2" />
      <circle cx="10.5" cy="7.2" r="2.1" />
      <circle cx="14.5" cy="7.2" r="2.1" />
      <circle cx="18" cy="9.5" r="2" />
    </svg>
  );
}

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="site-header sticky top-0 z-50">
      <div className="site-header__bar">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 md:px-6 md:py-4">
          <Link
            href="/"
            className="flex items-center gap-2 focus-ring rounded-full"
            aria-label={`${siteConfig.name} — home`}
          >
            <Image
              src="/brand/logo.svg"
              alt=""
              width={48}
              height={48}
              className="rounded-full"
              priority
            />
            <span className="font-plush text-xl font-extrabold leading-none text-cocoa md:text-2xl">
              TeddyPups
            </span>
          </Link>

          <nav className="hidden items-center gap-1 lg:flex" aria-label="Main">
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
                    "tp-nav-link relative px-3 py-2 text-[16px] text-cocoa transition hover:text-toffee-deep",
                    active && "font-semibold",
                  )}
                  aria-current={active ? "page" : undefined}
                >
                  {link.label}
                  {active && (
                    <PawMark className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 text-toffee" />
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
              className="btn btn-whatsapp hidden text-[15.2px] sm:inline-flex"
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
          <div id="mobile-nav" className="border-t border-cocoa/10 bg-milk px-4 py-6 lg:hidden">
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
              className="btn btn-whatsapp mt-6 w-full"
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
