"use client";

import NumberFlow from "@number-flow/react";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { site } from "@/site.config";
import { PLAYLIST } from "./playlist";
import styles from "./footer.module.css";

interface Clock {
  hour: number;
  minute: number;
  meridiem: string;
  hour24: number;
}

const BAR_COUNT = 6;
const BAR_MIN = 2;
const BAR_MAX = 11;
const NOISE_FLOOR = 1e-8;

function clockIn(timeZone: string): Clock {
  const parts = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone,
  }).formatToParts(new Date());
  const partOf = (type: string) =>
    parts.find((part) => part.type === type)?.value ?? "";
  const hour = Number(partOf("hour"));
  const meridiem = partOf("dayPeriod");
  return {
    hour,
    minute: Number(partOf("minute")),
    meridiem,
    hour24: (hour % 12) + (meridiem === "PM" ? 12 : 0),
  };
}

function bucketEnergy(data: Float32Array, barIndex: number): number {
  const start = Math.max(
    1,
    Math.floor(Math.pow(data.length, barIndex / BAR_COUNT))
  );
  const end = Math.max(
    start + 1,
    Math.floor(Math.pow(data.length, (barIndex + 1) / BAR_COUNT))
  );
  let energy = 0;
  for (let i = start; i < end; i++) {
    const db = data[i];
    if (Number.isFinite(db)) energy += Math.pow(10, db / 10);
  }
  return energy / (end - start);
}

export function Footer() {
  const pathname = usePathname();
  const [clock, setClock] = useState<Clock | null>(null);
  const [trackIndex, setTrackIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [hover, setHover] = useState(false);
  const [isTouch, setIsTouch] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const barsRef = useRef<HTMLSpanElement | null>(null);
  const screenBarsRef = useRef<SVGGElement | null>(null);
  const rafRef = useRef<number>(0);
  const playingRef = useRef(false);
  const peaksRef = useRef<number[]>(Array(BAR_COUNT).fill(NOISE_FLOOR * 3));
  const heightsRef = useRef<number[]>(Array(BAR_COUNT).fill(BAR_MIN));
  const silentFramesRef = useRef(0);
  const fallbackTargetsRef = useRef<number[]>(Array(BAR_COUNT).fill(BAR_MIN));

  useEffect(() => {
    if (PLAYLIST.length > 0) {
      const saved = Number(localStorage.getItem("currentSongIndex"));
      const next = Number.isNaN(saved) ? 0 : (saved + 1) % PLAYLIST.length;
      setTrackIndex(next);
      localStorage.setItem("currentSongIndex", String(next));
    }
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
    const heights = heightsRef.current;
    const container = barsRef.current;
    if (container) {
      const spans = container.children;
      heights.forEach((h, i) => {
        const bar = spans[i] as HTMLElement;
        if (bar) bar.style.height = `${h}px`;
      });
    }
    const screen = screenBarsRef.current;
    if (screen) {
      const rects = screen.children;
      heights.forEach((h, i) => {
        const rect = rects[i] as SVGElement;
        if (!rect) return;
        const normalized = (h - BAR_MIN) / (BAR_MAX - BAR_MIN);
        const scale = 0.16 + normalized * 0.84;
        rect.style.transform = `scaleY(${scale})`;
      });
    }
  };

  const draw = () => {
    if (playingRef.current && analyserRef.current) {
      const data = new Float32Array(analyserRef.current.frequencyBinCount);
      analyserRef.current.getFloatFrequencyData(data);

      const energies = heightsRef.current.map((_, i) => bucketEnergy(data, i));
      const totalEnergy = energies.reduce((a, b) => a + b, 0);

      if (totalEnergy <= 1e-7) {
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
        heightsRef.current = heightsRef.current.map((prev, i) => {
          const peak = Math.max(
            energies[i],
            peaksRef.current[i] * 0.985,
            NOISE_FLOOR * 3
          );
          peaksRef.current[i] = peak;
          const ratio = Math.max(
            0,
            (energies[i] - NOISE_FLOOR) / (peak - NOISE_FLOOR)
          );
          const target = BAR_MIN + Math.pow(ratio, 0.6) * (BAR_MAX - BAR_MIN);
          const responsiveness = target > prev ? 0.55 : 0.14;
          return prev + (target - prev) * responsiveness;
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
    analyser.fftSize = 512;
    analyser.smoothingTimeConstant = 0.6;
    source.connect(analyser);
    analyser.connect(ctx.destination);
    audioContextRef.current = ctx;
    analyserRef.current = analyser;
  };

  const play = async (i: number) => {
    try {
      const url = `/playlist/${PLAYLIST[i].file}`;
      if (!audioRef.current) {
        audioRef.current = new Audio();
      }
      const audio = audioRef.current;
      if (!audio.src.endsWith(url)) {
        audio.src = url;
      }
      audio.onended = () => {
        const next = (i + 1) % PLAYLIST.length;
        setTrackIndex(next);
        localStorage.setItem("currentSongIndex", String(next));
        play(next);
      };
      ensureAnalyser();
      audioContextRef.current?.resume();
      try {
        audio.currentTime = 0;
      } catch {}
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
    if (PLAYLIST.length === 0) return;
    if (playing) {
      audioRef.current?.pause();
      playingRef.current = false;
      setPlaying(false);
      return;
    }
    const audio = audioRef.current;
    const url = `/playlist/${PLAYLIST[trackIndex].file}`;
    if (audio && audio.src.endsWith(url) && !audio.ended) {
      ensureAnalyser();
      audioContextRef.current?.resume();
      audio
        .play()
        .then(() => {
          silentFramesRef.current = 0;
          playingRef.current = true;
          setPlaying(true);
          cancelAnimationFrame(rafRef.current);
          rafRef.current = requestAnimationFrame(draw);
        })
        .catch(() => {
          playingRef.current = false;
          setPlaying(false);
        });
    } else {
      play(trackIndex);
    }
  };

  const track = PLAYLIST[trackIndex] ?? null;
  const hasMusic = track !== null;
  const musicMode = hasMusic && (hover || (isTouch && playing));
  const pluggedIn =
    !playing && clock !== null && (clock.hour24 >= 22 || clock.hour24 < 8);

  return (
    <footer
      className={`${styles.footer} ${
        pathname === "/" ? "" : styles.concealed
      }`}
    >
      <div className={styles.inner}>
        <button
          className={`${styles.row} ${clock ? styles.visible : styles.hidden} ${
            musicMode ? styles.music : ""
          }`}
          onPointerEnter={(e) => {
            if (e.pointerType === "touch") {
              setIsTouch(true);
            } else {
              setHover(true);
            }
          }}
          onPointerLeave={() => setHover(false)}
          onClick={toggle}
          aria-label={
            !hasMusic
              ? "Local time"
              : playing
              ? "Pause"
              : `Play ${track.title} by ${track.artist}`
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
              {track && `${track.title} by ${track.artist}`}
            </span>
          </span>
          <span className={styles.player} aria-hidden="true">
            <svg
              className={pluggedIn ? styles.plugged : undefined}
              width="16"
              height={pluggedIn ? 30 : 24}
              viewBox={pluggedIn ? "0 0 16 30" : "0 0 16 24"}
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect
                x="0.6"
                y="0.6"
                width="14.8"
                height="22.8"
                rx="3"
                stroke="#989897"
                strokeWidth="1.2"
              />
              <rect
                x="3"
                y="3.4"
                width="10"
                height="6.4"
                rx="1"
                stroke="#989897"
                strokeWidth="1"
              />
              {playing ? (
                <g ref={screenBarsRef}>
                  <rect
                    className={styles.screenBar}
                    x="4.2"
                    y="4.2"
                    width="0.9"
                    height="4.6"
                    rx="0.45"
                    fill="#989897"
                  />
                  <rect
                    className={styles.screenBar}
                    x="5.55"
                    y="4.2"
                    width="0.9"
                    height="4.6"
                    rx="0.45"
                    fill="#989897"
                  />
                  <rect
                    className={styles.screenBar}
                    x="6.9"
                    y="4.2"
                    width="0.9"
                    height="4.6"
                    rx="0.45"
                    fill="#989897"
                  />
                  <rect
                    className={styles.screenBar}
                    x="8.25"
                    y="4.2"
                    width="0.9"
                    height="4.6"
                    rx="0.45"
                    fill="#989897"
                  />
                  <rect
                    className={styles.screenBar}
                    x="9.6"
                    y="4.2"
                    width="0.9"
                    height="4.6"
                    rx="0.45"
                    fill="#989897"
                  />
                  <rect
                    className={styles.screenBar}
                    x="10.95"
                    y="4.2"
                    width="0.9"
                    height="4.6"
                    rx="0.45"
                    fill="#989897"
                  />
                </g>
              ) : pluggedIn ? (
                <g>
                  <rect
                    x="4.6"
                    y="5.2"
                    width="5.6"
                    height="2.8"
                    rx="0.7"
                    stroke="#989897"
                    strokeWidth="0.9"
                  />
                  <rect
                    x="10.7"
                    y="6"
                    width="0.9"
                    height="1.2"
                    rx="0.3"
                    fill="#989897"
                  />
                  <rect
                    className={styles.charge}
                    x="5.4"
                    y="6"
                    width="3.9"
                    height="1.2"
                    rx="0.4"
                    fill="#989897"
                  />
                </g>
              ) : (
                <g>
                  <defs>
                    <clipPath id="ipodScreen">
                      <rect
                        x="3.5"
                        y="3.9"
                        width="9"
                        height="5.4"
                        rx="0.7"
                      />
                    </clipPath>
                  </defs>
                  <rect
                    x="3.5"
                    y="3.9"
                    width="9"
                    height="5.4"
                    rx="0.7"
                    fill="#e6e6e5"
                  />
                  <g clipPath="url(#ipodScreen)">
                    <rect
                      className={styles.glint}
                      x="3"
                      y="-3"
                      width="2.2"
                      height="15"
                      fill="#fbfbfa"
                    />
                  </g>
                </g>
              )}
              <circle
                cx="8"
                cy="16.4"
                r="4.1"
                stroke="#989897"
                strokeWidth="1"
              />
              <circle
                className={styles.hub}
                cx="8"
                cy="16.4"
                r="1.4"
                stroke="#989897"
                strokeWidth="0.9"
              />
              {pluggedIn && (
                <>
                  <rect
                    x="5"
                    y="23.2"
                    width="6"
                    height="2.6"
                    rx="0.8"
                    fill="#989897"
                  />
                  <path
                    d="M8 25.8v3.2"
                    stroke="#989897"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                  />
                </>
              )}
            </svg>
          </span>
        </button>
      </div>
    </footer>
  );
}
