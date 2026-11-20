import type { Puppy } from "@/lib/types";

export function getWhatsAppNumber() {
  return (
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.replace(/\D/g, "") || "971500000000"
  );
}

export function buildWhatsAppUrl(text: string) {
  const number = getWhatsAppNumber();
  return `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
}

export function generalWhatsAppMessage() {
  return "Hi TeddyPups! I'd love to know more about your puppies.";
}

export function puppyWhatsAppMessage(puppy: Pick<Puppy, "name" | "breed">) {
  return `Hi TeddyPups! I'd love to know more about ${puppy.name} (${puppy.breed}).`;
}

export function whatsappHref(message?: string) {
  return buildWhatsAppUrl(message || generalWhatsAppMessage());
}
