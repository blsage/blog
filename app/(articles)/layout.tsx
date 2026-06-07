import Link from "next/link";
import { ArticleAside } from "./article-aside";
import { ArticleHeader } from "./article-header";
import styles from "./article.module.css";

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
        <footer className={styles.footer}>
          <Link href="/" className={styles.backLink}>
            ← Back
          </Link>
        </footer>
      </article>
    </>
  );
}
