import type { MetadataRoute } from "next";
import { articles } from "./blog/articles";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://anchor-agent.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const blogEntries = articles.map((article) => ({
    url: `${BASE_URL}/blog/${article.slug}`,
    lastModified: new Date(article.publishedAt),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${BASE_URL}/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    ...blogEntries,
  ];
}
