"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import { useMotionValueEvent, useScroll, useSpring, useTransform } from "framer-motion";

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

// Spring the displayed time eases toward the scroll-position target with.
// Higher stiffness / lower damping = snappier and more tightly tied to
// scroll (closer to an instant 1:1 mapping); lower stiffness / higher
// damping = more lag, a more pronounced "catching up" feel. This sits
// around a 3-4/10 sensitivity — visibly eased but still responsive,
// tuned up from an earlier pass that read as a 1-2.
const SPRING_CONFIG = { stiffness: 170, damping: 30, mass: 0.5 };

/**
 * Maps a chain of video chapters onto one continuous scroll-driven timeline:
 * scrolling down plays the story forward, scrolling up rewinds it — always
 * anchored to scroll position, so scrolling all the way through the
 * container is guaranteed to reach the end of the footage (and all the way
 * back to the start on the way up), no matter how fast or slow. The
 * *displayed* time eases toward that position-based target via a spring
 * rather than snapping straight to it, which is what gives the fast-forward
 * and rewind their smooth accelerate/decelerate feel instead of feeling like
 * a slider being dragged frame by frame.
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
  const readyRef = useRef(false);
  const seekRafRef = useRef(0);
  const pendingTimeRef = useRef(0);
  const [activeIndex, setActiveIndex] = useState(0);

  const totalDuration = durationsRef.current.reduce((sum, value) => sum + value, 0);

  // The scroll-position target, in seconds — 0 at the very start of the
  // container, totalDuration at the very end. This is the ground truth the
  // spring always eases toward, so full playback is always exactly bounded
  // by the actual scroll range.
  const targetTime = useTransform(scrollYProgress, [0, 1], [0, totalDuration]);
  const smoothTime = useSpring(targetTime, SPRING_CONFIG);

  // Coalesces spring updates to at most one seek per animation frame and
  // skips sub-frame deltas — stops the video visibly flickering
  // backward/forward from overlapping seeks resolving out of order.
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
