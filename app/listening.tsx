"use client";

import { useEffect, useRef, useState } from "react";
import { PLAYLIST } from "./playlist";
import styles from "./listening.module.css";

function trackOfTheDay(): number {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const day = Math.floor((now.getTime() - start.getTime()) / 86400000);
  return day % PLAYLIST.length;
}

export function Listening() {
  const [index, setIndex] = useState<number | null>(null);
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    setIndex(trackOfTheDay());
    return () => {
      audioRef.current?.pause();
    };
  }, []);

  const play = async (i: number) => {
    const track = PLAYLIST[i];
    try {
      const res = await fetch(
        `https://itunes.apple.com/search?term=${encodeURIComponent(
          `${track.title} ${track.artist}`
        )}&media=music&limit=1`
      );
      const data = await res.json();
      const url = data.results?.[0]?.previewUrl;
      if (!url) return;
      if (!audioRef.current) audioRef.current = new Audio();
      const audio = audioRef.current;
      audio.src = url;
      audio.onended = () => {
        const next = (i + 1) % PLAYLIST.length;
        setIndex(next);
        play(next);
      };
      await audio.play();
      setPlaying(true);
    } catch {
      setPlaying(false);
    }
  };

  const toggle = () => {
    if (index === null) return;
    if (playing) {
      audioRef.current?.pause();
      setPlaying(false);
    } else {
      play(index);
    }
  };

  if (index === null) return <span className={styles.listening} />;

  const track = PLAYLIST[index];

  return (
    <span className={styles.listening}>
      <button
        className={`${styles.toggle} ${playing ? styles.active : ""}`}
        onClick={toggle}
        aria-label={playing ? "Pause" : "Play a preview"}
      >
        <span className={`${styles.bars} ${playing ? styles.playing : ""}`}>
          <span />
          <span />
          <span />
          <span />
        </span>
        <span className={styles.label}>
          {track.title} — {track.artist}
        </span>
      </button>
    </span>
  );
}
