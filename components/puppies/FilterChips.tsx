"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils/cn";

const chips = [
  { key: "everywhere", label: "Everywhere" },
  { key: "imported", label: "Imported" },
  { key: "korean", label: "Korean Teacup" },
  { key: "maltipoo", label: "Maltipoo" },
  { key: "pomeranian", label: "Pomeranian" },
  { key: "poodle", label: "Poodle" },
  { key: "cavapoo", label: "Cavapoo" },
  { key: "shih", label: "Shih Tzu" },
  { key: "boys", label: "Boys" },
  { key: "girls", label: "Girls" },
] as const;

export function FilterChips() {
  const router = useRouter();
  const params = useSearchParams();
  const active = params.get("filter") || "everywhere";

  function setFilter(key: string) {
    const next = new URLSearchParams(params.toString());
    if (key === "everywhere") next.delete("filter");
    else next.set("filter", key);
    router.push(`/puppies${next.toString() ? `?${next}` : ""}`);
  }

  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label="Filter puppies">
      {chips.map((chip) => {
        const pressed = active === chip.key || (chip.key === "everywhere" && !params.get("filter"));
        return (
          <button
            key={chip.key}
            type="button"
            aria-pressed={pressed}
            onClick={() => setFilter(chip.key)}
            className={cn(
              "rounded-full border px-4 py-2 text-sm font-semibold transition focus-ring",
              pressed
                ? "border-toffee-deep bg-toffee-deep text-milk"
                : "border-cocoa/20 bg-white text-cocoa hover:border-toffee",
            )}
          >
            {chip.label}
          </button>
        );
      })}
    </div>
  );
}
