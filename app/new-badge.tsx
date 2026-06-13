"use client";

import { useEffect, useRef } from "react";
import { annotate } from "rough-notation";
import styles from "./post-list.module.css";

export function NewBadge() {
  const badgeRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const badge = badgeRef.current;
    if (!badge) return;

    const base = {
      type: "circle" as const,
      color: "rgb(255, 0, 170)",
      strokeWidth: 1.5,
      padding: [3, 7] as [number, number],
    };

    const first = annotate(badge, { ...base, iterations: 1, animate: false });
    first.show();

    const second = annotate(badge, {
      ...base,
      iterations: 1,
      animationDuration: 600,
    });
    const timer = setTimeout(() => second.show(), 700);

    return () => {
      clearTimeout(timer);
      first.remove();
      second.remove();
    };
  }, []);

  return (
    <span ref={badgeRef} className={styles.new}>
      New
    </span>
  );
}
