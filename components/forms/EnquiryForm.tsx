"use client";

import { useState } from "react";
import type { Puppy } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import { puppyWhatsAppMessage } from "@/lib/whatsapp";
import { cn } from "@/lib/utils/cn";

type Mode = "letter" | "puppy";

function Stamp() {
  return (
    <span aria-hidden className="tp-letter__stamp">
      <svg viewBox="0 0 64 64" className="size-9" fill="currentColor">
        <path d="M32 30.5c-7.6 0-15.6 8.3-15.6 15.5 0 5.4 4.2 8.3 9.2 8.3 2.6 0 4.5-1.1 6.4-1.1s3.8 1.1 6.4 1.1c5 0 9.2-2.9 9.2-8.3 0-7.2-8-15.5-15.6-15.5zM19.28 26.71C21.07 30.08 20.42 33.92 17.84 35.29C15.25 36.67 11.71 35.05 9.92 31.69C8.13 28.32 8.78 24.48 11.36 23.11C13.95 21.73 17.49 23.35 19.28 26.71ZM29.62 15.64C30.32 19.62 28.46 23.26 25.47 23.79C22.48 24.32 19.48 21.53 18.78 17.56C18.08 13.58 19.94 9.94 22.93 9.41C25.92 8.88 28.92 11.67 29.62 15.64ZM45.22 17.56C44.52 21.53 41.52 24.32 38.53 23.79C35.54 23.26 33.68 19.62 34.38 15.64C35.08 11.67 38.08 8.88 41.07 9.41C44.06 9.94 45.92 13.58 45.22 17.56ZM54.08 31.69C52.29 35.05 48.75 36.67 46.16 35.29C43.58 33.92 42.93 30.08 44.72 26.71C46.51 23.35 50.05 21.73 52.64 23.11C55.22 24.48 55.87 28.32 54.08 31.69Z" />
      </svg>
    </span>
  );
}

const dashInput =
  "mx-1 inline-block w-full min-w-0 max-w-full border-0 border-b-2 border-dashed border-cocoa/35 bg-transparent px-1 py-0.5 text-cocoa outline-none transition placeholder:text-cocoa-soft/55 focus:border-toffee sm:w-auto sm:min-w-[7rem]";

export function EnquiryForm({
  mode,
  puppies = [],
  puppy,
}: {
  mode: Mode;
  puppies?: Pick<Puppy, "id" | "name" | "breed" | "gender">[];
  puppy?: Pick<Puppy, "id" | "name" | "breed">;
}) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setError("");
    const form = new FormData(e.currentTarget);
    const payload = {
      name: String(form.get("name") || ""),
      phone: String(form.get("phone") || ""),
      email: String(form.get("email") || ""),
      area: String(form.get("area") || ""),
      message: String(form.get("message") || ""),
      puppy_id: String(form.get("puppy_id") || puppy?.id || "") || null,
      source: mode === "puppy" ? "puppy_form" : "contact_form",
      website: String(form.get("website") || ""),
    };

    try {
      const res = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Something went wrong");
      setStatus("success");
      e.currentTarget.reset();
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Failed to send");
    }
  }

  if (status === "success") {
    return (
      <div className="tp-letterform text-center">
        <p className="font-plush text-2xl font-bold">Thank you!</p>
        <p className="mt-2 text-cocoa-soft">
          We received your message and will get back to you promptly.
        </p>
        <button
          type="button"
          className="mt-4 text-toffee-deep underline"
          onClick={() => setStatus("idle")}
        >
          Send another
        </button>
      </div>
    );
  }

  if (mode === "letter") {
    return (
      <div className="tp-post">
        <form onSubmit={onSubmit} className="tp-letterform" noValidate={false}>
          <Stamp />
          <p className="tp-letterform__greeting font-scrawl">Dear TeddyPups,</p>

          <p className="tp-letterform__line">
            my name is{" "}
            <input
              name="name"
              required
              aria-label="Your name (required)"
              placeholder="Your name"
              className={cn(dashInput, "w-[9.5rem] sm:w-40")}
            />
            , and you can reach me on{" "}
            <input
              name="phone"
              required
              aria-label="Phone or WhatsApp number with country code (required)"
              placeholder="+971 50 123 4567"
              className={cn(dashInput, "w-[11rem] sm:w-52")}
            />{" "}
            or by email at{" "}
            <input
              name="email"
              type="email"
              aria-label="Email (optional)"
              placeholder="optional"
              className={cn(dashInput, "w-[9rem] sm:w-44")}
            />
            .
          </p>

          <p className="tp-letterform__line">
            I live in{" "}
            <input
              name="area"
              aria-label="Your area (optional)"
              placeholder="e.g. Dubai Marina"
              className={cn(dashInput, "w-[10rem] sm:w-48")}
            />
            , and I&apos;m curious about{" "}
            <label className="sr-only" htmlFor="puppy_id">
              Puppy you&apos;re interested in (optional)
            </label>
            <select
              id="puppy_id"
              name="puppy_id"
              className="mx-1 inline-block max-w-full rounded-full border-2 border-cocoa/20 bg-milk px-3 py-1 text-[0.95em] text-cocoa outline-none focus:border-toffee"
              defaultValue=""
            >
              <option value="">any puppy (not sure yet)</option>
              {puppies.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.breed}, {p.gender === "boy_and_girl" ? "boy & girl" : p.gender})
                </option>
              ))}
            </select>
            .
          </p>

          <textarea
            name="message"
            rows={4}
            aria-label="Your message (optional)"
            placeholder="Anything else you'd like to tell us…"
            className="tp-letterform__note font-scrawl"
          />

          <input
            name="website"
            tabIndex={-1}
            autoComplete="off"
            aria-label="Website"
            className="absolute left-[-9999px] h-0 w-0 opacity-0"
          />

          {error && (
            <div className="tp-letterform__alert" role="alert">
              {error}
            </div>
          )}

          <div className="tp-letterform__sign">
            <p className="font-scrawl">with love, a future puppy parent</p>
            <Button type="submit" disabled={status === "loading"}>
              {status === "loading" ? "Sending…" : "Post my letter"}
            </Button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="dotted-card space-y-4 p-6 md:p-8">
      <div>
        <label className="font-scrawl text-sm text-cocoa-soft" htmlFor="name">
          Your name *
        </label>
        <input
          id="name"
          name="name"
          required
          className="mt-1 w-full rounded-xl border border-cocoa/15 bg-white px-3 py-2 focus:border-toffee focus:outline-none"
        />
      </div>
      <div>
        <label className="font-scrawl text-sm text-cocoa-soft" htmlFor="phone">
          Phone or WhatsApp *
        </label>
        <input
          id="phone"
          name="phone"
          required
          className="mt-1 w-full rounded-xl border border-cocoa/15 bg-white px-3 py-2 focus:border-toffee focus:outline-none"
        />
        <p className="mt-1 text-xs text-cocoa-soft">With country code, e.g. +971 50 123 4567</p>
      </div>
      <div>
        <label className="font-scrawl text-sm text-cocoa-soft" htmlFor="email">
          Email (optional)
        </label>
        <input
          id="email"
          name="email"
          type="email"
          className="mt-1 w-full rounded-xl border border-cocoa/15 bg-white px-3 py-2 focus:border-toffee focus:outline-none"
        />
      </div>
      <div>
        <label className="font-scrawl text-sm text-cocoa-soft" htmlFor="area">
          Your area (optional)
        </label>
        <input
          id="area"
          name="area"
          placeholder="e.g. Dubai Marina"
          className="mt-1 w-full rounded-xl border border-cocoa/15 bg-white px-3 py-2 focus:border-toffee focus:outline-none"
        />
      </div>
      <div>
        <label className="font-scrawl text-sm text-cocoa-soft" htmlFor="message">
          Message (optional)
        </label>
        <textarea
          id="message"
          name="message"
          rows={3}
          defaultValue={
            puppy ? puppyWhatsAppMessage(puppy) : "Hi! I'd love to know more about your puppies."
          }
          className="mt-1 w-full rounded-xl border border-cocoa/15 bg-white px-3 py-2 focus:border-toffee focus:outline-none"
        />
      </div>
      <input
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-label="Website"
        className="absolute left-[-9999px] h-0 w-0 opacity-0"
      />
      {error && <p className="text-sm text-red-700">{error}</p>}
      <Button type="submit" disabled={status === "loading"}>
        {status === "loading" ? "Sending…" : "Send enquiry"}
      </Button>
    </form>
  );
}
