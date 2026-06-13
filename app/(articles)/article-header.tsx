"use client";

import { usePathname } from "next/navigation";
import { getPosts, formatArticleDate } from "@/app/get-posts";
import { ArticleJsonLd } from "@/app/json-ld";

export function ArticleHeader() {
  const pathname = usePathname();
  const slug = pathname.split("/")[1];
  const post = getPosts().find((p) => p.id === slug);

  if (!post) return null;

  return (
    <header>
      <ArticleJsonLd post={post} />
      <h1>{post.title}</h1>
      <time dateTime={post.date}>{formatArticleDate(post.date)}</time>
    </header>
  );
}
