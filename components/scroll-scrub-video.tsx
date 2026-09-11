"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import { useMotionValueEvent, useScroll } from "framer-motion";

export type ScrubChapter = {
  src: string;
  poster?: string;
  /** Seconds. If omitted, read from the video once its metadata loads. */
  duration?: number;
};

type ScrollScrubVideoProps = {
  /** The tall scroll container this timeline is mapped across (start..end = 0..1). */
  containerRef: RefObject<HTMLElement | null>;
  chapters: ScrubChapter[];
  fallbackImage: string;
  className?: string;
};

/**
 * Maps a chain of video chapters onto one continuous scroll-driven timeline:
 * scrolling down plays the story forward frame by frame, scrolling up rewinds
 * it, exactly as far as the scroll position dictates. Adding a chapter is
 * just appending to the array — the total scrollable length and per-chapter
 * boundaries adjust automatically.
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
export function ScrollScrubVideo({ containerRef, chapters, fallbackImage, className = "" }: ScrollScrubVideoProps) {
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end end"] });
  const videoRef = useRef<HTMLVideoElement>(null);
  const durationsRef = useRef<number[]>(chapters.map((chapter) => chapter.duration ?? 10));
  const pendingTimeRef = useRef(0);
  const readyRef = useRef(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const applyProgress = (progress: number) => {
    const durations = durationsRef.current;
    const total = durations.reduce((sum, value) => sum + value, 0);
    if (total <= 0) return;

    let elapsed = Math.min(Math.max(progress, 0), 1) * total;
    let index = 0;
    for (; index < durations.length - 1; index++) {
      if (elapsed <= durations[index]) break;
      elapsed -= durations[index];
    }

    pendingTimeRef.current = elapsed;
    setActiveIndex((current) => (current === index ? current : index));

    const video = videoRef.current;
    if (video && readyRef.current) {
      video.currentTime = elapsed;
    }
  };

  useMotionValueEvent(scrollYProgress, "change", applyProgress);

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
