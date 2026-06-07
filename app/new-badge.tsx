"use client";

import { useEffect, useRef } from "react";
import { annotate } from "rough-notation";
import styles from "./post-list.module.css";

export function NewBadge() {
  const badgeRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const badge = badgeRef.current;
    if (!badge) return;

    const annotation = annotate(badge, {
      type: "circle",
      color: "rgb(255, 0, 170)",
      strokeWidth: 1.5,
      padding: [3, 7],
      iterations: 1,
      animationDuration: 600,
    });
    const timer = setTimeout(() => annotation.show(), 900);

    return () => {
      clearTimeout(timer);
      annotation.remove();
    };
  }, []);

  return (
    <span ref={badgeRef} className={styles.new}>
      New
    </span>
  );
}
