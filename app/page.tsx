import { site } from "@/site.config";
import Bio from "./bio.mdx";
import { Footer } from "./footer";
import { PostList } from "./post-list";
import { getPosts, formatShortDate } from "./get-posts";

export default function Home() {
  return (
    <div className="homepage">
      <article className="article">
        <header>
          <h1>{site.name}</h1>
          <time>Updated {formatShortDate(site.updated)}</time>
        </header>
        <Bio />
      </article>
      <PostList posts={getPosts()} />
      <Footer />
    </div>
  );
}
