import type { Metadata } from "next";
import { FaqBoard } from "@/components/faq/FaqBoard";
import { FaqRoomPaint } from "@/components/faq/FaqRoomPaint";
import { getFaqs } from "@/lib/db/faqs";

export const metadata: Metadata = {
  title: "Questions & answers",
  description:
    "Can't find what you're looking for? Message us on WhatsApp — our team is available 24/7.",
};

export default async function FaqPage() {
  const faqs = await getFaqs();

  return (
    <div className="faq-page">
      <FaqRoomPaint />
      <section className="faq-hero relative overflow-hidden pb-8 pt-10 md:pb-10 md:pt-14">
        <div className="mx-auto max-w-[110rem] px-4 md:px-8 lg:px-12">
          <div className="max-w-4xl text-left">
            <h1 className="tp-giant">
              Questions &amp; answers
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-[#f3e6d4]/95 md:text-lg">
              Can&apos;t find what you&apos;re looking for? Message us on WhatsApp — our team is
              available 24/7.
            </p>
          </div>
        </div>
      </section>

      <section className="faq-board-wrap relative pb-2 pt-4 md:pt-6">
        <FaqBoard faqs={faqs} />
      </section>
    </div>
  );
}
