"use client";

import NumberFlow from "@number-flow/react";
import { useEffect, useRef, useState } from "react";
import { site } from "@/site.config";
import { PLAYLIST } from "./playlist";
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

function trackOfTheDay(): number {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const day = Math.floor((now.getTime() - start.getTime()) / 86400000);
  return day % PLAYLIST.length;
}

export function Footer() {
  const [clock, setClock] = useState<Clock | null>(null);
  const [trackIndex, setTrackIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [hover, setHover] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    setTrackIndex(trackOfTheDay());
    const update = () => setClock(clockIn(site.location.timeZone));
    update();
    const interval = setInterval(update, 1000);
    return () => {
      clearInterval(interval);
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
        setTrackIndex(next);
        play(next);
      };
      await audio.play();
      setPlaying(true);
    } catch {
      setPlaying(false);
    }
  };

  const toggle = () => {
    if (playing) {
      audioRef.current?.pause();
      setPlaying(false);
    } else {
      play(trackIndex);
    }
  };

  const track = PLAYLIST[trackIndex];
  const musicMode = playing || hover;

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <button
          className={`${styles.row} ${clock ? styles.visible : styles.hidden} ${
            musicMode ? styles.music : ""
          } ${playing ? styles.playing : ""}`}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          onClick={toggle}
          aria-label={
            playing ? "Pause" : `Play ${track.title} by ${track.artist}`
          }
        >
          <span className={styles.swap}>
            <span className={styles.clockLine}>
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
            </span>
            <span className={styles.trackLine}>
              {track.title} — {track.artist}
            </span>
          </span>
          <span className={styles.bars} aria-hidden="true">
            <span />
            <span />
            <span />
            <span />
          </span>
        </button>
      </div>
    </footer>
  );
}
