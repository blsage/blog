import { ArticleAside } from "./article-aside";
import { ArticleHeader } from "./article-header";

export default function ArticleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <ArticleAside />
      <article className="article">
        <ArticleHeader />
        {children}
      </article>
    </>
  );
}
