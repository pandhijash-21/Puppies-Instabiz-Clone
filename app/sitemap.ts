import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/config";
import { getPuppies } from "@/lib/db/puppies";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const puppies = await getPuppies();
  const base = siteConfig.siteUrl.replace(/\/$/, "");

  const staticRoutes = [
    "",
    "/puppies",
    "/gone-home",
    "/happy-families",
    "/how-it-works",
    "/faq",
    "/contact",
  ].map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
  }));

  const puppyRoutes = puppies.map((p) => ({
    url: `${base}/puppies/${p.slug}`,
    lastModified: new Date(p.updated_at),
  }));

  return [...staticRoutes, ...puppyRoutes];
}
