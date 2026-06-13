import type { MetadataRoute } from "next";
import { site } from "@/site.config";
import { getPosts } from "./get-posts";

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getPosts().map((post) => ({
    url: `${site.url}/${post.id}`,
    lastModified: new Date(`${post.date}T00:00:00Z`),
  }));
  return [
    { url: site.url, lastModified: new Date(`${site.updated}T00:00:00Z`) },
    ...posts,
  ];
}
