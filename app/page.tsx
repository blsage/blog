import { site } from "@/site.config";
import Bio from "./bio.mdx";
import { PostList } from "./post-list";
import { getPosts, formatShortDate } from "./get-posts";
import { HomeJsonLd } from "./json-ld";
import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
  openGraph: { url: site.url },
};

export default function Home() {
  return (
    <div className="homepage">
      <HomeJsonLd />
      <article className="article">
        <header>
          <h1>{site.name}</h1>
          <time>Updated {formatShortDate(site.updated)}</time>
        </header>
        <Bio />
      </article>
      <PostList posts={getPosts()} />
    </div>
  );
}
