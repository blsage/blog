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
    meridiem: partOf("dayPeriod"),
  };
}

function isBrewing(clock: Clock): boolean {
  const early = clock.meridiem === "AM" && (clock.hour === 12 || clock.hour < 6);
  return !early;
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
        <div
          className={`${styles.row} ${clock ? styles.visible : styles.hidden}`}
        >
          <p>
            {clock && (
              <>
                <NumberFlow value={clock.hour} />
                :
                <NumberFlow
                  value={clock.minute}
                  format={{ minimumIntegerDigits: 2 }}
                />
                {" "}
                {clock.meridiem} in {site.location.city},{" "}
                {site.location.region}
              </>
            )}
          </p>
          <span className={styles.cup} aria-hidden="true">
            <span
              className={`${styles.steam} ${
                clock && isBrewing(clock) ? "" : styles.steamOff
              }`}
            >
              <span className={styles.wisp1}>(</span>
              <span className={styles.wisp2}>(</span>
              <span className={styles.wisp3}>(</span>
            </span>
            c[_]
          </span>
        </div>
      </div>
    </footer>
  );
}
