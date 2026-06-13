"use client";

import { useState } from "react";
import styles from "./phone-field.module.css";

function format(digits: string): string {
  const d = digits.slice(0, 10);
  if (!d) return "";
  if (d.length < 4) return `(${d}`;
  if (d.length < 7) return `(${d.slice(0, 3)}) ${d.slice(3)}`;
  return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`;
}

export function PhoneField() {
  const [digits, setDigits] = useState("");
  return (
    <span className={styles.figure}>
      <span className={styles.field}>
        <span className={styles.flag} aria-hidden="true">
          🇺🇸
        </span>
        <input
          className={styles.input}
          inputMode="tel"
          autoComplete="off"
          spellCheck={false}
          placeholder="(000) 000-0000"
          aria-label="Phone number"
          value={format(digits)}
          onChange={(event) =>
            setDigits(event.target.value.replace(/\D/g, ""))
          }
        />
      </span>
      <span className={styles.caption}>Try it — the formatting is live.</span>
    </span>
  );
}
