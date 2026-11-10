import type { MetadataRoute } from "next";
import { site } from "@/config/site";
import { locales } from "@/i18n/config";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["", "/privacitat", "/avis-legal"];
  return pages.flatMap((page) =>
    locales.map((lang) => ({
      url: `${site.url}/${lang}${page}`,
      changeFrequency: page === "" ? ("monthly" as const) : ("yearly" as const),
      priority: page === "" ? 1 : 0.3,
      alternates: {
        languages: Object.fromEntries(locales.map((l) => [l, `${site.url}/${l}${page}`])),
      },
    })),
  );
}
