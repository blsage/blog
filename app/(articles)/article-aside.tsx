"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { getPosts } from "@/app/get-posts";
import styles from "./article-aside.module.css";

interface Heading {
  id: string;
  text: string;
}

export function ArticleAside() {
  const pathname = usePathname();
  const slug = pathname.split("/")[1];
  const post = getPosts().find((p) => p.id === slug);
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const nodes = Array.from(
      document.querySelectorAll<HTMLHeadingElement>("article h2[id]")
    );
    setHeadings(
      nodes.map((node) => ({ id: node.id, text: node.textContent ?? "" }))
    );

    const onScroll = () => {
      setScrolled(window.scrollY > 40);
      let current: string | null = null;
      for (const node of nodes) {
        if (node.getBoundingClientRect().top <= 96) current = node.id;
      }
      setActiveId(current);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname]);

  return (
    <aside className={styles.aside}>
      <Link href="/" className={styles.backButton}>
        <svg
          width="14"
          height="14"
          viewBox="0 0 14 14"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            d="M5.5 4L2 7.5l3.5 3.5M2 7.5h7.5A2.5 2.5 0 0 0 12 5V3.5"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        Index
      </Link>
      <div className={styles.tree} data-ready={headings.length > 0}>
        <nav data-scrolled={scrolled}>
          <h2
            data-active={!activeId}
            onClick={() => window.scrollTo({ top: 0 })}
          >
            {post?.title}
          </h2>
          <ul>
            {headings.map((heading) => (
              <li key={heading.id} data-active={activeId === heading.id}>
                <a href={`#${heading.id}`}>{heading.text}</a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </aside>
  );
}
