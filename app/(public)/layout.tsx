import { PawCursor } from "@/components/layout/PawCursor";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteMascot } from "@/components/layout/SiteMascot";
import { SkipToContent } from "@/components/layout/SkipToContent";
import { PawCursorBodyClass } from "@/components/layout/PawCursorBodyClass";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <SkipToContent />
      <PawCursorBodyClass />
      <SiteHeader />
      <main id="main" className="flex-1">
        {children}
      </main>
      <SiteFooter />
      <SiteMascot />
      <PawCursor />
    </>
  );
}
