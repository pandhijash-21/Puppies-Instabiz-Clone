"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import type { Faq } from "@/lib/types";
import { cn } from "@/lib/utils/cn";

export function FaqAccordion({
  faqs,
  inverted = false,
}: {
  faqs: Faq[];
  inverted?: boolean;
}) {
  const [openId, setOpenId] = useState<string | null>(faqs[0]?.id ?? null);

  return (
    <div className="space-y-3">
      {faqs.map((faq) => {
        const open = openId === faq.id;
        return (
          <div
            key={faq.id}
            className={cn(
              "overflow-hidden rounded-2xl border",
              inverted
                ? "border-white/15 bg-white/5"
                : "border-cocoa/10 bg-white/70",
            )}
          >
            <button
              type="button"
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left focus-ring"
              aria-expanded={open}
              onClick={() => setOpenId(open ? null : faq.id)}
            >
              <span className={cn("font-plush text-lg font-bold", inverted && "text-milk")}>
                {faq.question}
              </span>
              <ChevronDown
                className={cn(
                  "shrink-0 transition",
                  open && "rotate-180",
                  inverted ? "text-honey" : "text-toffee",
                )}
              />
            </button>
            {open && (
              <div
                className={cn(
                  "border-t px-5 py-4",
                  inverted ? "border-white/10 text-milk/85" : "border-cocoa/10 text-cocoa-soft",
                )}
              >
                {faq.answer}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
