"use client";

import { useRef, useState } from "react";
import styles from "./video.module.css";

export function Video({
  src,
  caption,
  poster,
}: {
  src: string;
  caption?: string;
  poster?: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [rate, setRate] = useState(1);

  const toggleRate = () => {
    const next = rate === 1 ? 0.5 : 1;
    setRate(next);
    if (videoRef.current) videoRef.current.playbackRate = next;
  };

  return (
    <figure className={styles.figure}>
      <div className={styles.frame}>
        <button
          className={styles.rate}
          onClick={toggleRate}
          aria-label="Toggle playback speed"
        >
          {rate === 1 ? "1x" : "0.5x"}
        </button>
        <video
          ref={videoRef}
          src={src}
          poster={poster}
          className={styles.video}
          autoPlay
          loop
          muted
          playsInline
        />
      </div>
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  );
}
