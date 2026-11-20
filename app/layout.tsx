import type { Metadata, Viewport } from "next";
import { Figtree, Fraunces, Shantell_Sans } from "next/font/google";
import { LenisProvider } from "@/components/layout/LenisProvider";
import { RouteCurtain } from "@/components/layout/RouteCurtain";
import { siteConfig } from "@/lib/config";
import "./globals.css";
import "./curtain.css";

const figtree = Figtree({
  variable: "--font-figtree",
  subsets: ["latin"],
  display: "swap",
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
  axes: ["SOFT", "WONK", "opsz"],
});

const shantell = Shantell_Sans({
  variable: "--font-shantell",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.siteUrl),
  title: {
    default: `${siteConfig.name} — Premium teacup puppies in Dubai`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  openGraph: {
    siteName: siteConfig.name,
    locale: "en_AE",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#fffdf8",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${figtree.variable} ${fraunces.variable} ${shantell.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans text-cocoa">
        <RouteCurtain />
        <LenisProvider>{children}</LenisProvider>
      </body>
    </html>
  );
}
