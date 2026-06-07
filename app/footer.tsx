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
                {clock.meridiem} in {site.location.city},{" "}
                {site.location.region}
              </>
            )}
          </p>
          <svg
            className={styles.phone}
            width="26"
            height="30"
            viewBox="0 0 26 30"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <g className={styles.phoneBody}>
              <rect
                x="6.7"
                y="3.6"
                width="13"
                height="23"
                rx="3.2"
                stroke="rgba(0, 0, 0, 0.4)"
                strokeWidth="1.4"
              />
              <rect
                x="11"
                y="6"
                width="4.5"
                height="1.6"
                rx="0.8"
                fill="rgba(0, 0, 0, 0.4)"
              />
              <rect
                x="10.4"
                y="23.4"
                width="5.8"
                height="1.1"
                rx="0.55"
                fill="rgba(0, 0, 0, 0.25)"
              />
              <circle
                className={styles.badge}
                cx="20"
                cy="4.4"
                r="3"
                fill="rgb(255, 0, 170)"
              />
            </g>
          </svg>
        </div>
      </div>
    </footer>
  );
}
