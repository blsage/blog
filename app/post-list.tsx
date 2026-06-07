import Link from "next/link";
import { site } from "@/site.config";
import type { Post } from "./get-posts";
import styles from "./post-list.module.css";

export function PostList({ posts }: { posts: Post[] }) {
  const years = [...new Set(posts.map((post) => post.date.slice(0, 4)))];

  return (
    <section className={styles.postList}>
      <h3 className={styles.title}>{site.listTitle}</h3>
      <ul>
        {years.map((year) => (
          <li key={year}>
            <ul>
              {posts
                .filter((post) => post.date.startsWith(year))
                .map((post) => {
                  const [y, m, d] = post.date.split("-");
                  return (
                    <li key={post.id}>
                      <Link href={`/${post.id}`}>
                        <h2>{post.title}</h2>
                        <time dateTime={post.date}>
                          <span>{`${d}/${m}`}</span>
                          <span>/</span>
                          <span>{y}</span>
                        </time>
                      </Link>
                    </li>
                  );
                })}
            </ul>
          </li>
        ))}
      </ul>
    </section>
  );
}
