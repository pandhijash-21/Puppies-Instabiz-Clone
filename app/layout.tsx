import type { Metadata, Viewport } from "next";
import { Figtree, Fraunces, Shantell_Sans } from "next/font/google";
import { LenisProvider } from "@/components/layout/LenisProvider";
import { RouteCurtain } from "@/components/layout/RouteCurtain";
import { siteConfig } from "@/lib/config";
import "./globals.css";
import "./curtain.css";
import "./families.css";
import "./puppies.css";

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
  icons: {
    icon: [
      { url: "/brand/logo.png", type: "image/png", sizes: "512x512" },
      { url: "/favicon-32.png", type: "image/png", sizes: "32x32" },
      { url: "/favicon-16.png", type: "image/png", sizes: "16x16" },
    ],
    apple: [{ url: "/apple-icon.png", type: "image/png", sizes: "180x180" }],
  },
  openGraph: {
    siteName: siteConfig.name,
    locale: "en_AE",
    type: "website",
    images: [{ url: "/brand/logo.png", width: 512, height: 512, alt: siteConfig.name }],
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
