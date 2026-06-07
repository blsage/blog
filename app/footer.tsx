"use client";

import { useEffect, useState } from "react";
import { site } from "@/site.config";
import styles from "./footer.module.css";

export function Footer() {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const update = () =>
      setTime(
        new Intl.DateTimeFormat("en-US", {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
          timeZone: site.location.timeZone,
        })
          .format(new Date())
          .toLowerCase()
          .replace(" ", "")
      );
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <p className={time ? styles.visible : styles.hidden}>
          {time} in {site.location.city}, {site.location.region}
        </p>
      </div>
    </footer>
  );
}
