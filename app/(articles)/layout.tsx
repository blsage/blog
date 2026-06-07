import Link from "next/link";
import { ArticleAside } from "./article-aside";
import { ArticleHeader } from "./article-header";
import { ArticleTransition } from "./article-transition";
import styles from "./article.module.css";

export default function ArticleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ArticleTransition>
      <ArticleAside />
      <article className="article">
        <ArticleHeader />
        {children}
        <footer className={styles.footer}>
          <Link href="/" className={styles.backLink}>
            ← Back
          </Link>
        </footer>
      </article>
    </ArticleTransition>
  );
}
