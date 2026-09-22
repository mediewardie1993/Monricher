"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import { useMotionValueEvent, useMotionValue, useScroll, useSpring, useVelocity } from "framer-motion";

export type ScrubChapter = {
  src: string;
  poster?: string;
  /** Seconds. If omitted, read from the video once its metadata loads. */
  duration?: number;
};

type ScrollScrubVideoProps = {
  /** Kept for API compatibility — no longer used to derive a position mapping. */
  containerRef: RefObject<HTMLElement | null>;
  chapters: ScrubChapter[];
  fallbackImage: string;
  className?: string;
};

// How fast the video drifts forward entirely on its own, as a fraction of
// real playback speed — the ambient "it's alive even if you don't touch it"
// motion the client asked for.
const AUTOPLAY_RATE = 0.5;

// Converts page scroll speed (px/s) into extra playback-rate. Scrolling
// down adds to the rate (fast-forward), scrolling up subtracts from it —
// enough to go negative and genuinely rewind on a firm upward scroll.
const VELOCITY_TO_RATE = 1 / 1400;

// Bounds how much a single instant of scroll can influence the rate, so a
// violent trackpad fling can't fling the video wildly either direction.
const MAX_RATE = 3.5;

// The spring is what actually delivers "eased in and out": the target time
// changes continuously (autoplay drift + scroll influence) and the video's
// displayed time always eases toward it rather than snapping.
const SPRING_CONFIG = { stiffness: 70, damping: 22, mass: 0.7 };

/**
 * Plays a chain of video chapters back on its own at half speed, with
 * scrolling nudging the effective playback rate up (fast-forward) or down
 * past zero (rewind) — eased toward via a spring rather than snapped to a
 * raw scroll-position mapping, so it reads as one continuously moving shot
 * that responds to scroll rather than a slider being dragged.
 *
 * Browsers won't actually decode+paint a new frame from a `currentTime` seek
 * until the video has genuinely played at least once. The fix is to let it
 * play(), then pause the instant `timeupdate` fires — that event only
 * fires once real decoded progress has happened, which is what actually
 * primes the pipeline. Deciding "when to pause" from a timer or
 * requestAnimationFrame instead (both tried here first) is unreliable:
 * rAF gets throttled hard on a backgrounded/inactive tab while the video
 * itself keeps playing regardless, so the "brief" priming play can end up
 * running to completion before the rAF ever fires to stop it.
 */
export function ScrollScrubVideo({ chapters, fallbackImage, className = "" }: ScrollScrubVideoProps) {
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);

  const videoRef = useRef<HTMLVideoElement>(null);
  const durationsRef = useRef<number[]>(chapters.map((chapter) => chapter.duration ?? 10));
  const readyRef = useRef(false);
  const seekRafRef = useRef(0);
  const pendingTimeRef = useRef(0);
  const [activeIndex, setActiveIndex] = useState(0);

  // The unsprung target time — advances every animation frame by the
  // autoplay drift plus whatever the current scroll velocity contributes,
  // clamped to the total runtime.
  const rawTime = useMotionValue(0);
  const smoothTime = useSpring(rawTime, SPRING_CONFIG);

  const totalDuration = durationsRef.current.reduce((sum, value) => sum + value, 0);

  useEffect(() => {
    let raf = 0;
    let lastNow: number | null = null;

    // A throttled/backgrounded tab can leave rAF ticks seconds apart —
    // resetting on visibility change (rather than just clamping every dt to
    // something tiny) means a genuinely slow tick still accumulates the
    // real elapsed time correctly, while only a truly stale gap (tab was
    // hidden) gets discarded instead of played back as one big jump.
    const handleVisibility = () => {
      if (document.hidden) lastNow = null;
    };
    document.addEventListener("visibilitychange", handleVisibility);

    const tick = (now: number) => {
      if (lastNow == null) {
        lastNow = now;
        raf = window.requestAnimationFrame(tick);
        return;
      }
      const dt = Math.min((now - lastNow) / 1000, 0.5);
      lastNow = now;

      const velocityContribution = Math.max(
        -MAX_RATE,
        Math.min(MAX_RATE, scrollVelocity.get() * VELOCITY_TO_RATE)
      );
      const rate = AUTOPLAY_RATE + velocityContribution;

      const total = durationsRef.current.reduce((sum, value) => sum + value, 0);
      if (total > 0) {
        const next = Math.max(0, Math.min(total, rawTime.get() + rate * dt));
        rawTime.set(next);
      }

      raf = window.requestAnimationFrame(tick);
    };

    raf = window.requestAnimationFrame(tick);
    return () => {
      window.cancelAnimationFrame(raf);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Coalesces spring updates to at most one seek per animation frame and
  // skips sub-frame deltas — the same fix that stopped the video visibly
  // flickering backward/forward when scroll settles.
  const flushSeek = () => {
    seekRafRef.current = 0;
    const video = videoRef.current;
    if (!video || !readyRef.current) return;
    if (Math.abs(video.currentTime - pendingTimeRef.current) < 0.008) return;
    video.currentTime = pendingTimeRef.current;
  };

  useMotionValueEvent(smoothTime, "change", (elapsedTotal) => {
    const durations = durationsRef.current;
    let elapsed = Math.max(0, Math.min(totalDuration, elapsedTotal));
    let index = 0;
    for (; index < durations.length - 1; index++) {
      if (elapsed <= durations[index]) break;
      elapsed -= durations[index];
    }

    pendingTimeRef.current = elapsed;
    setActiveIndex((current) => (current === index ? current : index));

    if (!seekRafRef.current) {
      seekRafRef.current = window.requestAnimationFrame(flushSeek);
    }
  });

  useEffect(() => {
    return () => {
      if (seekRafRef.current) window.cancelAnimationFrame(seekRafRef.current);
    };
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    readyRef.current = false;

    let safetyTimer = 0;

    const finishPriming = () => {
      window.clearTimeout(safetyTimer);
      video.removeEventListener("timeupdate", finishPriming);
      video.pause();
      video.currentTime = pendingTimeRef.current;
      readyRef.current = true;
    };

    const prime = () => {
      if (!chapters[activeIndex].duration) {
        durationsRef.current[activeIndex] = video.duration || durationsRef.current[activeIndex];
      }

      // The instant currentTime actually advances from real decoded
      // progress, the pipeline is primed — pause right there.
      video.addEventListener("timeupdate", finishPriming, { once: true });
      // Belt and suspenders: if timeupdate never fires for some reason,
      // don't stay unprimed (and silently playing) forever.
      safetyTimer = window.setTimeout(finishPriming, 800);

      video.play().catch(() => {
        // Autoplay genuinely blocked — a direct (unprimed) seek is
        // still better than staying frozen forever.
        finishPriming();
      });
    };

    if (video.readyState >= 1) {
      prime();
    } else {
      video.addEventListener("loadedmetadata", prime, { once: true });
    }

    return () => {
      window.clearTimeout(safetyTimer);
      video.removeEventListener("loadedmetadata", prime);
      video.removeEventListener("timeupdate", finishPriming);
    };
  }, [chapters, activeIndex]);

  if (chapters.length === 0) {
    return (
      <div
        className={`photo-grade absolute inset-0 bg-cover bg-center ${className}`}
        style={{ backgroundImage: `url('${fallbackImage}')` }}
        aria-hidden="true"
      />
    );
  }

  const current = chapters[activeIndex];

  return (
    <video
      ref={videoRef}
      key={current.src}
      className={`photo-grade pointer-events-none absolute inset-0 h-full w-full object-cover ${className}`}
      src={current.src}
      poster={current.poster}
      muted
      playsInline
      preload="auto"
      aria-hidden="true"
    />
  );
}
