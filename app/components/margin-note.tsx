"use client";

import { useEffect, useRef, useState } from "react";
import { annotate } from "rough-notation";
import styles from "./margin-note.module.css";

export function MarginNote({
  note,
  children,
}: {
  note: string;
  children: React.ReactNode;
}) {
  const targetRef = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const target = targetRef.current;
    if (!target) return;

    if (window.matchMedia("(max-width: 1080px)").matches) {
      setShown(true);
      return;
    }

    const annotation = annotate(target, {
      type: "bracket",
      brackets: ["right"],
      color: "#1a1a1a",
      strokeWidth: 2,
      padding: [4, 7, 4, 0],
      iterations: 1,
      animationDuration: 700,
    });

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          annotation.show();
          setShown(true);
          observer.disconnect();
        }
      },
      { threshold: 0.7 }
    );
    observer.observe(target);

    return () => {
      observer.disconnect();
      annotation.remove();
    };
  }, []);

  return (
    <div className={styles.wrapper}>
      <div ref={targetRef}>{children}</div>
      <span
        className={`${styles.note} ${shown ? styles.visible : ""}`}
        aria-hidden="true"
      >
        {note}
      </span>
    </div>
  );
}
