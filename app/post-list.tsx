import Link from "next/link";
import { site } from "@/site.config";
import type { Post } from "./get-posts";
import { NewBadge } from "./new-badge";
import styles from "./post-list.module.css";

const NEW_BADGE_DAYS = 30;

function isNew(date: string): boolean {
  const ageMs = Date.now() - new Date(`${date}T00:00:00Z`).getTime();
  return ageMs < NEW_BADGE_DAYS * 24 * 60 * 60 * 1000;
}

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
                  const month = new Date(
                    `${post.date}T00:00:00Z`
                  ).toLocaleDateString("en-US", {
                    month: "short",
                    timeZone: "UTC",
                  });
                  return (
                    <li key={post.id}>
                      <Link href={`/${post.id}`}>
                        <h2>
                          {post.title}
                          {isNew(post.date) && <NewBadge />}
                        </h2>
                        <time dateTime={post.date}>
                          <span>{`${month} ${Number(d)}`}</span>
                          <span>,</span>
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
