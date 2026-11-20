"use client";

import Image from "next/image";
import { useMemo, useState, type CSSProperties } from "react";
import { Search } from "lucide-react";
import type { Faq } from "@/lib/types";
import { whatsappHref } from "@/lib/whatsapp";
import { cn } from "@/lib/utils/cn";

const PIN_COLORS = ["#E07A3A", "#5B8FC7", "#E391B0", "#C9A227", "#6AAE6A", "#C45C3A"];
const TILTS = ["-1.1deg", "0.9deg", "-0.6deg", "1.2deg", "-0.8deg", "0.7deg"];

export function FaqBoard({ faqs }: { faqs: Faq[] }) {
  const [query, setQuery] = useState("");
  const [openId, setOpenId] = useState<string | null>(faqs[0]?.id ?? null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return faqs;
    return faqs.filter(
      (f) =>
        f.question.toLowerCase().includes(q) ||
        f.answer.toLowerCase().includes(q),
    );
  }, [faqs, query]);

  return (
    <div className="faq-notes mx-auto grid max-w-[110rem] gap-8 px-4 pb-10 md:grid-cols-[minmax(14rem,18rem)_minmax(0,1fr)] md:gap-8 md:px-8 lg:gap-10 lg:px-12">
      <aside className="faq-notes__side flex flex-col gap-3">
        <p className="font-scrawl text-[1.15rem] text-[#fbe3b4]">sniff out a question</p>
        <label className="faq-notes__search relative block w-full max-w-md">
          <Search className="pointer-events-none absolute left-5 top-1/2 h-[1.45rem] w-[1.45rem] -translate-y-1/2 text-cocoa" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="delivery, Korea, vaccinated..."
            className="h-14 w-full rounded-full border-[3px] border-cocoa bg-milk py-3 pl-14 pr-5 text-[17px] text-cocoa shadow-[0_6px_0_-2px_rgba(42,23,14,0.35)] outline-none placeholder:text-cocoa-soft/65 focus:shadow-[0_0_0_5px_rgba(242,190,107,0.7),0_6px_0_-2px_rgba(42,23,14,0.35)]"
            aria-label="Search FAQs"
          />
        </label>
        <p className="font-scrawl font-semibold text-[#fbe3b4]/90">
          {filtered.length} notes on the board
        </p>

        <div className="faq-notes__teddy relative mx-auto mt-8 w-[clamp(8rem,34vw,11rem)] md:mx-0 md:ml-4">
          <span className="faq-notes__bubble" aria-hidden>
            <span>?</span>
          </span>
          <Image
            src="/brand/walking-puppy.svg"
            alt=""
            width={176}
            height={150}
            className="mx-auto drop-shadow-[0_12px_20px_rgba(0,0,0,.28)]"
          />
        </div>

        <a
          href={whatsappHref("Hi TeddyPups! I have a question that isn't in the FAQ.")}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-whatsapp mt-2 w-full shadow-[0_0.5rem_0_-0.15rem_var(--color-cocoa)]"
        >
          Ask your own question
        </a>
      </aside>

      <div className="faq-corkboard">
        <div className="faq-notes__list mx-auto grid w-full max-w-none gap-[clamp(1.6rem,3vw,2.2rem)]">
          {filtered.length === 0 && (
            <p className="faq-note faq-note--empty rounded-lg border-[3px] border-cocoa bg-[#fffcf3] p-5 text-center text-cocoa-soft">
              No matching notes — try another sniff, or ask on WhatsApp.
            </p>
          )}
          {filtered.map((faq, i) => {
            const open = openId === faq.id;
            const pin = PIN_COLORS[i % PIN_COLORS.length];
            const tilt = TILTS[i % TILTS.length];
            return (
              <article
                key={faq.id}
                className={cn("faq-note", open && "is-open")}
                style={
                  {
                    "--pin": pin,
                    "--tilt": tilt,
                    "--i": i,
                  } as CSSProperties
                }
              >
                <span className="faq-note__pin" aria-hidden />
                <button
                  type="button"
                  className="flex w-full items-center gap-4 rounded px-5 pb-[1.2rem] pt-[1.35rem] text-left focus-ring"
                  aria-expanded={open}
                  onClick={() => setOpenId(open ? null : faq.id)}
                >
                  <span className="font-plush flex-1 text-[clamp(1.1rem,1.6vw,1.3rem)] font-bold leading-snug text-cocoa">
                    {faq.question}
                  </span>
                  <span
                    className={cn("faq-note__chevron", open && "is-open")}
                    aria-hidden
                  />
                </button>
                <div className={cn("faq-note__answer", open && "is-open")}>
                  <div className="faq-note__flap">
                    <p>{faq.answer}</p>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </div>
  );
}
