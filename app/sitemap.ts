import type { MetadataRoute } from "next";
import { getSitemapEntries } from "@/lib/catalog";
import { absoluteUrl } from "@/lib/site";

export const dynamic = "force-dynamic";

export default function sitemap(): MetadataRoute.Sitemap {
  const { categories, products } = getSitemapEntries();
  const now = new Date();
  return [
    { url: absoluteUrl("/"), lastModified: now, changeFrequency: "daily", priority: 1 },
    { url: absoluteUrl("/danh-muc"), lastModified: now, changeFrequency: "weekly", priority: 0.6 },
    { url: absoluteUrl("/khuyen-mai"), lastModified: now, changeFrequency: "daily", priority: 0.8 },
    { url: absoluteUrl("/gioi-thieu"), changeFrequency: "monthly", priority: 0.4 },
    { url: absoluteUrl("/lien-he"), changeFrequency: "monthly", priority: 0.4 },
    ...categories.map((c) => ({ url: absoluteUrl(`/danh-muc/${c.slug}`), lastModified: now, changeFrequency: "daily" as const, priority: 0.8 })),
    ...products.map((p) => ({
      url: absoluteUrl(`/san-pham/${p.slug}`),
      lastModified: new Date(p.updated_at.replace(" ", "T") + "Z"),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
    { url: absoluteUrl("/tra-cuu-don-hang"), changeFrequency: "yearly", priority: 0.2 },
  ];
}
