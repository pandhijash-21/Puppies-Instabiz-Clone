import { ButtonLink } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-4 py-24 text-center">
      <h1 className="font-plush text-4xl font-extrabold">Page not found</h1>
      <p className="mt-3 text-cocoa-soft">
        That page wandered off. Let&apos;s get you back to the puppies.
      </p>
      <ButtonLink href="/puppies" className="mt-8">
        View available puppies
      </ButtonLink>
    </div>
  );
}
