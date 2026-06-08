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

const BAR_COUNT = 6;
const BAR_MIN = 2;
const BAR_MAX = 11;

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

function bucketValue(data: Uint8Array, barIndex: number): number {
  const start = Math.max(
    1,
    Math.floor(Math.pow(data.length, barIndex / BAR_COUNT))
  );
  const end = Math.max(
    start + 1,
    Math.floor(Math.pow(data.length, (barIndex + 1) / BAR_COUNT))
  );
  let sum = 0;
  for (let i = start; i < end; i++) sum += data[i];
  return sum / (end - start);
}

export function Footer() {
  const [clock, setClock] = useState<Clock | null>(null);
  const [trackIndex, setTrackIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [hover, setHover] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const barsRef = useRef<HTMLSpanElement | null>(null);
  const rafRef = useRef<number>(0);
  const playingRef = useRef(false);
  const maxesRef = useRef<number[]>(Array(BAR_COUNT).fill(100));
  const heightsRef = useRef<number[]>(Array(BAR_COUNT).fill(BAR_MIN));
  const silentFramesRef = useRef(0);
  const fallbackTargetsRef = useRef<number[]>(Array(BAR_COUNT).fill(BAR_MIN));

  useEffect(() => {
    setTrackIndex(trackOfTheDay());
    const update = () => setClock(clockIn(site.location.timeZone));
    update();
    const interval = setInterval(update, 1000);
    return () => {
      clearInterval(interval);
      cancelAnimationFrame(rafRef.current);
      audioRef.current?.pause();
      audioContextRef.current?.close();
    };
  }, []);

  const renderBars = () => {
    const container = barsRef.current;
    if (!container) return;
    const spans = container.children;
    heightsRef.current.forEach((h, i) => {
      const bar = spans[i] as HTMLElement;
      if (bar) bar.style.height = `${h}px`;
    });
  };

  const draw = () => {
    if (playingRef.current && analyserRef.current) {
      const data = new Uint8Array(analyserRef.current.frequencyBinCount);
      analyserRef.current.getByteFrequencyData(data);
      const total = data.reduce((a, b) => a + b, 0);

      if (total === 0) {
        silentFramesRef.current++;
      } else {
        silentFramesRef.current = 0;
      }

      if (silentFramesRef.current > 30) {
        heightsRef.current = heightsRef.current.map((h, i) => {
          const target = fallbackTargetsRef.current[i];
          if (Math.abs(h - target) < 0.5) {
            fallbackTargetsRef.current[i] =
              BAR_MIN + Math.random() * (BAR_MAX - BAR_MIN);
          }
          return h + (target - h) * 0.25;
        });
      } else {
        heightsRef.current = heightsRef.current.map((_, i) => {
          const value = bucketValue(data, i);
          if (value > maxesRef.current[i]) maxesRef.current[i] = value;
          const normalized = value / maxesRef.current[i];
          const curved = Math.pow(normalized, 5);
          return curved * (BAR_MAX - BAR_MIN) + BAR_MIN;
        });
      }
      renderBars();
      rafRef.current = requestAnimationFrame(draw);
    } else {
      heightsRef.current = heightsRef.current.map((h) =>
        Math.max(BAR_MIN, h * 0.9)
      );
      renderBars();
      if (heightsRef.current.some((h) => h > BAR_MIN)) {
        rafRef.current = requestAnimationFrame(draw);
      }
    }
  };

  const ensureAnalyser = () => {
    if (audioContextRef.current || !audioRef.current) return;
    const Ctx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext;
    const ctx = new Ctx();
    const source = ctx.createMediaElementSource(audioRef.current);
    const analyser = ctx.createAnalyser();
    analyser.fftSize = 256;
    source.connect(analyser);
    analyser.connect(ctx.destination);
    audioContextRef.current = ctx;
    analyserRef.current = analyser;
  };

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
      if (!audioRef.current) {
        audioRef.current = new Audio();
        audioRef.current.crossOrigin = "anonymous";
      }
      const audio = audioRef.current;
      audio.src = url;
      audio.onended = () => {
        const next = (i + 1) % PLAYLIST.length;
        setTrackIndex(next);
        play(next);
      };
      ensureAnalyser();
      audioContextRef.current?.resume();
      await audio.play();
      silentFramesRef.current = 0;
      playingRef.current = true;
      setPlaying(true);
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(draw);
    } catch {
      playingRef.current = false;
      setPlaying(false);
    }
  };

  const toggle = () => {
    if (playing) {
      audioRef.current?.pause();
      playingRef.current = false;
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
          }`}
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
                  />
                  {` ${clock.meridiem} in ${site.location.city}, ${site.location.region}`}
                </>
              )}
            </span>
            <span className={styles.trackLine}>
              <span
                className={styles.barsSlot}
                ref={barsRef}
                aria-hidden="true"
              >
                <span />
                <span />
                <span />
                <span />
                <span />
                <span />
              </span>
              {track.title} by {track.artist}
            </span>
          </span>
          <span className={styles.metronome} aria-hidden="true">
            <span className={styles.pendulum} />
          </span>
        </button>
      </div>
    </footer>
  );
}
