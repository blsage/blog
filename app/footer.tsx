"use client";

import NumberFlow from "@number-flow/react";
import { useEffect, useState } from "react";
import { site } from "@/site.config";
import styles from "./footer.module.css";

interface Clock {
  hour: number;
  minute: number;
  meridiem: string;
}

function clockIn(timeZone: string): Clock {
  const parts = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone,
  }).formatToParts(new Date());
  const partOf = (type: string) =>
    parts.find((part) => part.type === type)?.value ?? "";
  return {
    hour: Number(partOf("hour")),
    minute: Number(partOf("minute")),
    meridiem: partOf("dayPeriod").toLowerCase(),
  };
}

export function Footer() {
  const [clock, setClock] = useState<Clock | null>(null);

  useEffect(() => {
    const update = () => setClock(clockIn(site.location.timeZone));
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <p className={clock ? styles.visible : styles.hidden}>
          {clock && (
            <>
              <NumberFlow value={clock.hour} />
              :
              <NumberFlow
                value={clock.minute}
                format={{ minimumIntegerDigits: 2 }}
              />
              {clock.meridiem} in {site.location.city}, {site.location.region}
            </>
          )}
        </p>
      </div>
    </footer>
  );
}
