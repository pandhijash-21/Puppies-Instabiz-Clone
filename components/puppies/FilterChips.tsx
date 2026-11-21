"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils/cn";

const groups = [
  {
    label: "where",
    chips: [
      { key: "everywhere", label: "Everywhere" },
      { key: "imported", label: "Imported" },
      { key: "korean", label: "Korean Teacup" },
    ],
  },
  {
    label: "breed",
    chips: [
      { key: "maltipoo", label: "Maltipoo" },
      { key: "pomeranian", label: "Pomeranian" },
      { key: "poodle", label: "Poodle" },
      { key: "cavapoo", label: "Cavapoo" },
      { key: "shih", label: "Shih Tzu" },
    ],
  },
  {
    label: "boy or girl",
    chips: [
      { key: "boys", label: "Boys" },
      { key: "girls", label: "Girls" },
    ],
  },
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
    <div className="sketch-filters" role="group" aria-label="Filter puppies">
      <span className="sketch-filters__tape" aria-hidden />
      {groups.map((group) => (
        <div key={group.label} className="sketch-filters__row">
          <span className="sketch-filters__label">{group.label}</span>
          <div className="sketch-filters__chips">
            {group.chips.map((chip) => {
              const pressed =
                active === chip.key ||
                (chip.key === "everywhere" && !params.get("filter"));
              return (
                <button
                  key={chip.key}
                  type="button"
                  aria-pressed={pressed}
                  onClick={() => setFilter(chip.key)}
                  className={cn("sketch-filters__chip focus-ring", pressed && "is-active")}
                >
                  {chip.label}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
