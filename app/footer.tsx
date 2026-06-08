"use client";

import NumberFlow from "@number-flow/react";
import { Fragment, useEffect, useRef, useState } from "react";
import { site } from "@/site.config";
import styles from "./footer.module.css";

interface Clock {
  hour: number;
  minute: number;
  meridiem: string;
}

const REEL_SYMBOLS = ["♠", "♥", "♦", "♣", "7", "★"];

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
  const [slot, setSlot] = useState({ reels: [4, 4, 4], locked: 3 });

  useEffect(() => {
    const update = () => setClock(clockIn(site.location.timeZone));
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  const tickerRef = useRef<ReturnType<typeof setInterval> | undefined>(
    undefined
  );
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    const ticker = tickerRef;
    const timeouts = timeoutsRef;
    return () => {
      clearInterval(ticker.current);
      timeouts.current.forEach(clearTimeout);
    };
  }, []);

  const spin = () => {
    if (slot.locked < 3) return;
    const rand = () => Math.floor(Math.random() * REEL_SYMBOLS.length);
    setSlot((s) => ({ ...s, locked: 0 }));
    tickerRef.current = setInterval(() => {
      setSlot((s) =>
        s.locked >= 3
          ? s
          : {
              ...s,
              reels: s.reels.map((v, i) => (i >= s.locked ? rand() : v)),
            }
      );
    }, 70);
    timeoutsRef.current.push(
      setTimeout(() => setSlot((s) => ({ ...s, locked: 1 })), 600),
      setTimeout(() => setSlot((s) => ({ ...s, locked: 2 })), 1000),
      setTimeout(() => {
        setSlot((s) => ({ ...s, locked: 3 }));
        clearInterval(tickerRef.current);
      }, 1400)
    );
  };

  const jackpot =
    slot.locked === 3 && slot.reels.every((r) => r === slot.reels[0]);

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
          <button
            className={`${styles.slot} ${jackpot ? styles.jackpot : ""}`}
            onClick={spin}
            aria-label="Spin the slot machine"
          >
            [
            {slot.reels.map((r, i) => (
              <Fragment key={i}>
                {i > 0 && "|"}
                <span
                  className={`${styles.reel} ${
                    i >= slot.locked ? styles.spinning : ""
                  }`}
                >
                  {REEL_SYMBOLS[r]}
                </span>
              </Fragment>
            ))}
            ]
          </button>
        </div>
      </div>
    </footer>
  );
}
