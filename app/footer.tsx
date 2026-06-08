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

const DIE_FACES = ["⚀", "⚁", "⚂", "⚃", "⚄", "⚅"];

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

export function Footer() {
  const [clock, setClock] = useState<Clock | null>(null);
  const [dice, setDice] = useState<[number, number]>([4, 0]);
  const [rolling, setRolling] = useState(false);

  useEffect(() => {
    const update = () => setClock(clockIn(site.location.timeZone));
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let shuffle: ReturnType<typeof setInterval>;
    const roll = () => {
      setRolling(true);
      let ticks = 0;
      shuffle = setInterval(() => {
        setDice([
          Math.floor(Math.random() * 6),
          Math.floor(Math.random() * 6),
        ]);
        ticks++;
        if (ticks >= 8) {
          clearInterval(shuffle);
          setRolling(false);
        }
      }, 75);
    };
    const interval = setInterval(roll, 10000);
    return () => {
      clearInterval(interval);
      clearInterval(shuffle);
    };
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
                />{" "}
                {clock.meridiem} in {site.location.city},{" "}
                {site.location.region}
              </>
            )}
          </p>
          <span
            className={`${styles.dice} ${rolling ? styles.rolling : ""}`}
            aria-hidden="true"
          >
            {DIE_FACES[dice[0]]} {DIE_FACES[dice[1]]}
          </span>
        </div>
      </div>
    </footer>
  );
}
