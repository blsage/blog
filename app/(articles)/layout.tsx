import Link from "next/link";
import { ArticleHeader } from "./article-header";
import styles from "./article.module.css";

export default function ArticleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <article className="article">
      <ArticleHeader />
      {children}
      <footer className={styles.footer}>
        <Link href="/" className={styles.backLink}>
          ← Back
        </Link>
      </footer>
    </article>
  );
}
