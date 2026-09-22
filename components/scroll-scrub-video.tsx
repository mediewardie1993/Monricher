"use client";

import { useEffect, useRef, useState } from "react";
import { animate, useMotionValue, useMotionValueEvent } from "framer-motion";

export type ScrubChapter = {
  src: string;
  poster?: string;
  /** Seconds. If omitted, read from the video once its metadata loads. */
  duration?: number;
};

type ScrollScrubVideoProps = {
  chapters: ScrubChapter[];
  /** The time (seconds, across all chapters combined) to ease the video toward. */
  targetTime: number;
  fallbackImage: string;
  className?: string;
};

// A fixed-duration tween, not a spring, so every stop-to-stop transition
// takes exactly this long regardless of distance — a spring's settle time
// varies with how far it has to travel, which isn't what "ease in and out,
// 2 seconds" asks for.
const TRANSITION_DURATION = 2.5;
const TRANSITION_EASE = "easeInOut" as const;

/**
 * A video (or chain of chapters) whose `currentTime` eases toward an
 * externally controlled `targetTime` via a fixed-duration ease-in-out tween
 * instead of snapping to it — so moving between two target times reads as a
 * smooth eased fast-forward/rewind rather than a hard cut.
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
export function ScrollScrubVideo({ chapters, targetTime, fallbackImage, className = "" }: ScrollScrubVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const durationsRef = useRef<number[]>(chapters.map((chapter) => chapter.duration ?? 10));
  const readyRef = useRef(false);
  const seekRafRef = useRef(0);
  const pendingTimeRef = useRef(0);
  const [activeIndex, setActiveIndex] = useState(0);

  const totalDuration = durationsRef.current.reduce((sum, value) => sum + value, 0);

  const rawTime = useMotionValue(targetTime);

  useEffect(() => {
    const controls = animate(rawTime, targetTime, {
      duration: TRANSITION_DURATION,
      ease: TRANSITION_EASE
    });
    return () => controls.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetTime]);

  // Coalesces tween updates to at most one seek per animation frame and
  // skips sub-frame deltas — stops the video visibly flickering
  // backward/forward from overlapping seeks resolving out of order.
  const flushSeek = () => {
    seekRafRef.current = 0;
    const video = videoRef.current;
    if (!video || !readyRef.current) return;
    if (Math.abs(video.currentTime - pendingTimeRef.current) < 0.008) return;
    video.currentTime = pendingTimeRef.current;
  };

  useMotionValueEvent(rawTime, "change", (elapsedTotal) => {
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
