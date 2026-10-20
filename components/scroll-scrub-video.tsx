"use client";

import { useEffect, useRef, useState } from "react";
import { useMotionValueEvent, type MotionValue } from "framer-motion";

export type ScrubChapter = {
  src: string;
  poster?: string;
  /** Seconds. If omitted, read from the video once its metadata loads. */
  duration?: number;
};

type ScrollScrubVideoProps = {
  /** Scroll progress through the whole timeline, 0..1 across all chapters combined. */
  progress: MotionValue<number>;
  chapters: ScrubChapter[];
  fallbackImage: string;
  className?: string;
};

// The source footage is 30fps, so it can only ever produce a new decoded
// frame every ~33ms — asking for a seek on every animation frame (~16ms,
// 60/sec) requests frames far faster than the video can actually supply
// them, and those extra requests queue up behind the decoder instead of
// just being wasted, which is what reads as the whole thing lagging.
// Matching the seek rate to the real frame rate stops that queueing.
const MIN_SEEK_INTERVAL_MS = 1000 / 30;

/**
 * Maps a chain of video chapters onto one continuous scroll-driven timeline:
 * scrolling down plays the story forward frame by frame, scrolling up rewinds
 * it, exactly as far as the scroll position dictates. Adding a chapter is
 * just appending to the array — the per-chapter boundaries adjust
 * automatically.
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
export function ScrollScrubVideo({ progress, chapters, fallbackImage, className = "" }: ScrollScrubVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const durationsRef = useRef<number[]>(chapters.map((chapter) => chapter.duration ?? 10));
  const readyRef = useRef(false);
  const seekRafRef = useRef(0);
  const pendingTimeRef = useRef(0);
  const lastSeekAtRef = useRef(0);
  // True from the moment a seek is requested until the video reports it has
  // landed (`seeked`). Phones decode seeks one at a time; firing a new seek
  // while one is still in flight cancels it before it ever paints, so a fast
  // scroll produces a stream of abandoned seeks and the picture stutters or
  // freezes. Waiting for each frame to land, then jumping straight to the
  // *latest* position, always shows something real.
  const seekingRef = useRef(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const scheduleFlush = () => {
    if (!seekRafRef.current) {
      seekRafRef.current = window.requestAnimationFrame(flushSeek);
    }
  };

  // Coalesces scroll updates to at most one seek per animation frame and
  // skips sub-frame deltas — stops the video visibly flickering
  // backward/forward from overlapping seeks resolving out of order. Also
  // throttled to the video's own real frame rate (see
  // MIN_SEEK_INTERVAL_MS) rather than firing on every rendered frame, so
  // the decoder never gets more seek requests than it can actually keep
  // up with — always seeking to the latest pending time once it does run.
  const flushSeek = () => {
    seekRafRef.current = 0;
    const video = videoRef.current;
    if (!video) return;
    if (!readyRef.current) {
      // Priming (see the effect below) hasn't finished yet — the pending
      // time is still valid, it just can't be applied yet. Keep retrying
      // instead of dropping it, otherwise a seek requested in this brief
      // window is lost forever with nothing left to re-trigger it once
      // priming does finish.
      seekRafRef.current = window.requestAnimationFrame(flushSeek);
      return;
    }

    const now = performance.now();

    // A seek is still in flight: leave it alone. `onSeeked` below schedules
    // the next one. (If `seeked` never arrives, stop waiting after 300ms so
    // the video can't stay stuck.)
    if (seekingRef.current && now - lastSeekAtRef.current < 300) return;

    if (now - lastSeekAtRef.current < MIN_SEEK_INTERVAL_MS) {
      seekRafRef.current = window.requestAnimationFrame(flushSeek);
      return;
    }

    if (Math.abs(video.currentTime - pendingTimeRef.current) < 0.008) return;
    seekingRef.current = true;
    video.currentTime = pendingTimeRef.current;
    lastSeekAtRef.current = now;
  };

  const handleSeeked = () => {
    seekingRef.current = false;
    const video = videoRef.current;
    if (video && Math.abs(video.currentTime - pendingTimeRef.current) >= 0.008) {
      scheduleFlush();
    }
  };

  const applyProgress = (value: number) => {
    const durations = durationsRef.current;
    const total = durations.reduce((sum, duration) => sum + duration, 0);
    if (total <= 0) return;

    let elapsed = Math.min(Math.max(value, 0), 1) * total;
    let index = 0;
    for (; index < durations.length - 1; index++) {
      if (elapsed <= durations[index]) break;
      elapsed -= durations[index];
    }

    pendingTimeRef.current = elapsed;
    setActiveIndex((current) => (current === index ? current : index));

    scheduleFlush();
  };

  useMotionValueEvent(progress, "change", applyProgress);

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
      onSeeked={handleSeeked}
      aria-hidden="true"
    />
  );
}
