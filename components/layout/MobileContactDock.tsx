import { siteConfig } from "@/lib/config";
import { whatsappHref } from "@/lib/whatsapp";

/** Fixed bottom WhatsApp + Call bar — mobile only. */
export function MobileContactDock() {
  const telHref = `tel:${siteConfig.phoneDisplay.replace(/\D/g, "")}`;

  return (
    <div className="tp-mobile-dock" role="navigation" aria-label="Quick contact">
      <a
        href={whatsappHref()}
        target="_blank"
        rel="noopener noreferrer"
        className="btn btn-whatsapp tp-mobile-dock__wa"
      >
        WhatsApp us
      </a>
      <a href={telHref} className="btn btn-ghost tp-mobile-dock__call">
        Call
      </a>
    </div>
  );
}
