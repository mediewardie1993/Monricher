"use client";

import { useMotionValueEvent, useScroll, useTransform, motion } from "framer-motion";
import { useRef, useState } from "react";
import { ScrollScrubVideo } from "@/components/scroll-scrub-video";
import { withBasePath } from "@/lib/base-path";

const heroChapters = [
  { src: "/videos/hero-entrance.mp4", poster: "/videos/hero-entrance-poster.jpg", duration: 30 }
].map((chapter) => ({ ...chapter, src: withBasePath(chapter.src), poster: withBasePath(chapter.poster) }));

const LAST_FRAME = withBasePath("/videos/hero-entrance-lastframe.jpg");

// How much extra scroll distance (in viewport heights) the whole video gets
// to play out across, on top of the one screen it's pinned within. Roughly
// 2.6 screens per 10s of footage keeps scrub sensitivity consistent.
const SCRUB_SCREENS = 2.6 * (heroChapters[0].duration / 10);

// Extra scroll distance, after the video finishes, where the pinned view
// holds on the last frame with the closing CTA up — so the payoff gets a
// few honest scrolls of dwell time instead of being swept away the instant
// the video ends.
const HOLD_SCREENS = 2;

// Interpolates progress through a set of keyframes, clamped to the ends —
// a plain-JS stand-in for Framer's interpolate() used because driving these
// cued fades through useTransform's own style binding proved unreliable on
// this element tree (values computed correctly but never reliably reached
// the DOM), while plain React state always does.
function interpolate(progress: number, input: number[], output: number[]): number {
  if (progress <= input[0]) return output[0];
  const last = input.length - 1;
  if (progress >= input[last]) return output[last];
  for (let i = 0; i < last; i++) {
    if (progress >= input[i] && progress <= input[i + 1]) {
      const t = (progress - input[i]) / (input[i + 1] - input[i]);
      return output[i] + t * (output[i + 1] - output[i]);
    }
  }
  return output[last];
}

// Just two beats now: the opening headline, and the closing CTA once the
// video settles on its last frame. No mid-scroll act boundaries to keep in
// sync with — one continuous video, one simple fade in and fade out.
const BEATS = {
  openingOpacity: { input: [0.02, 0.1, 0.85, 0.94], output: [0, 1, 1, 0] },
  openingY: { input: [0.02, 0.1], output: [24, 0] },

  finalOpacity: { input: [0.94, 1], output: [0, 1] },
  finalY: { input: [0.94, 1], output: [28, 0] },
  finalScale: { input: [0.94, 1], output: [0.92, 1] }
} as const;

type BeatValues = Record<keyof typeof BEATS, number>;

function computeBeats(progress: number): BeatValues {
  const result = {} as BeatValues;
  for (const key in BEATS) {
    const k = key as keyof typeof BEATS;
    result[k] = interpolate(progress, [...BEATS[k].input], [...BEATS[k].output]);
  }
  return result;
}

export function HeroSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  // The video/beats progress is measured against this marker instead of the
  // whole section, so it stays exactly as tuned above regardless of how
  // long HOLD_SCREENS holds the closing CTA afterward.
  const videoRangeRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: videoRangeRef,
    offset: ["start start", "end end"]
  });
  const progressWidth = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  const [beats, setBeats] = useState<BeatValues>(() => computeBeats(0));

  useMotionValueEvent(scrollYProgress, "change", (progress) => {
    setBeats(computeBeats(progress));
  });

  return (
    <section
      ref={sectionRef}
      className="relative"
      style={{ height: `${100 + SCRUB_SCREENS * 100 + HOLD_SCREENS * 100}vh` }}
    >
      <div
        ref={videoRangeRef}
        className="pointer-events-none absolute inset-x-0 top-0"
        style={{ height: `${100 + SCRUB_SCREENS * 100}vh` }}
        aria-hidden="true"
      />

      <div className="sticky top-0 h-screen overflow-hidden pb-14 pt-4 md:pb-28 md:pt-10">
        {/* A slow, continuous breathing scale — imperceptible while frames
            are changing during the scrub, but gives the frozen last frame a
            gentle, alive quality once the story settles on it. */}
        <div className="absolute inset-0 opacity-[0.92] frame-breathing" aria-hidden="true">
          <ScrollScrubVideo containerRef={videoRangeRef} chapters={heroChapters} fallbackImage={LAST_FRAME} />
        </div>

        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_100%_0%,rgba(72,130,227,0.22),transparent_28%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(7,14,24,0.82)_0%,rgba(7,14,24,0.5)_28%,rgba(7,14,24,0.16)_54%,rgba(7,14,24,0.54)_100%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,14,24,0.1)_0%,rgba(7,14,24,0.05)_55%,rgba(7,14,24,0.55)_100%)]" />
          <div className="absolute inset-0 opacity-[0.18] [mask-image:linear-gradient(to_bottom,black,transparent_78%)]">
            <div className="h-full w-full bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:88px_88px]" />
          </div>
        </div>

        {/* Opening headline — holds through most of the video, clears out
            just before the closing CTA takes over. */}
        <div
          className="pointer-events-none container-shell absolute inset-0 grid h-full items-end pb-16 md:pb-24"
          style={{ opacity: beats.openingOpacity }}
        >
          <div className="max-w-[41rem]" style={{ transform: `translateY(${beats.openingY}px)` }}>
            <span className="mb-5 inline-flex text-[0.62rem] font-semibold uppercase tracking-[0.24em] text-white/75 sm:text-[0.68rem]">
              High quality design and construction for all industries
            </span>
            <h1 className="max-w-[11ch] text-balance font-display text-[3.3rem] font-semibold leading-[0.92] tracking-[-0.04em] text-white sm:text-[4.4rem] lg:text-[5.2rem]">
              Constructing solutions, crafting excellence.
            </h1>
            <p className="mt-5 max-w-[34rem] text-[0.97rem] leading-7 text-slate-200/92 sm:text-base">
              Monricher Construction & Development Corp is a 100% Filipino capitalized
              corporation delivering new construction, renovation, expansion, and
              demolition with honesty, integrity, and a client-focused result.
            </p>
          </div>
        </div>

        {/* Closing payoff — one centered, unmissable conversion CTA */}
        <div
          className="container-shell absolute inset-0 flex flex-col items-center justify-center text-center"
          style={{
            opacity: beats.finalOpacity,
            transform: `translateY(${beats.finalY}px) scale(${beats.finalScale})`
          }}
        >
          <span className="mb-6 inline-flex text-[0.68rem] font-semibold uppercase tracking-[0.3em] text-white/70">
            Ready when you are
          </span>
          <a href={withBasePath("/contact")} className="button-primary cta-glow min-h-20 px-14 py-6 text-2xl sm:text-3xl">
            <span>Inquire Now</span>
          </a>
          <a
            href={withBasePath("/projects")}
            className="mt-6 text-sm font-semibold uppercase tracking-[0.16em] text-white/70 underline decoration-white/30 underline-offset-8 transition hover:text-white hover:decoration-white/70"
          >
            View Projects
          </a>
          <div className="mt-8 flex flex-col gap-2 text-[0.8rem] font-medium text-white/60 sm:flex-row sm:flex-wrap sm:justify-center sm:gap-5">
            <span>Consultation to turnover</span>
            <span>Certified professionals</span>
            <span>Sta. Maria, Bulacan</span>
          </div>
        </div>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex justify-center pb-4" aria-hidden="true">
          <div className="h-[3px] w-40 overflow-hidden rounded-full bg-white/12">
            <motion.div className="h-full rounded-full bg-accent" style={{ width: progressWidth }} />
          </div>
        </div>
      </div>
    </section>
  );
}
