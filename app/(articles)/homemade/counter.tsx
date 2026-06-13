"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import styles from "./counter.module.css";

export function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div className={styles.demo}>
      <motion.button
        className={styles.button}
        whileTap={{ scale: 0.94 }}
        onClick={() => setCount(count + 1)}
      >
        Click me
      </motion.button>
      <motion.span
        key={count}
        className={styles.count}
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {count === 0
          ? "You haven’t clicked yet"
          : `You’ve clicked ${count} ${count === 1 ? "time" : "times"}`}
      </motion.span>
    </div>
  );
}
