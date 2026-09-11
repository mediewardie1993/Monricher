"use client";

import { useMotionValueEvent, useScroll, useTransform, motion } from "framer-motion";
import { useRef, useState } from "react";
import { ScrollScrubVideo } from "@/components/scroll-scrub-video";
import { withBasePath } from "@/lib/base-path";

const heroChapters = [
  { src: "/videos/hero-chapter-1.mp4", poster: "/videos/hero-chapter-1-poster.jpg", duration: 10 },
  { src: "/videos/hero-chapter-2.mp4", poster: "/videos/hero-chapter-2-poster.jpg", duration: 10 },
  { src: "/videos/hero-chapter-3.mp4", poster: "/videos/hero-chapter-3-poster.jpg", duration: 10 }
  // Next chapter goes here once generated, starting from
  // /videos/hero-chapter-3-lastframe.jpg. Bump SCRUB_SCREENS proportionally
  // and add another chapterWindow(3, [...]) beat below to keep pacing
  // consistent — nothing else needs to change, chapterWindow() re-divides
  // the whole timeline automatically as chapters are added.
].map((chapter) => ({ ...chapter, src: withBasePath(chapter.src), poster: withBasePath(chapter.poster) }));

const LAST_FRAME = withBasePath("/videos/hero-chapter-3-lastframe.jpg");

// How much extra scroll distance (in viewport heights) the whole story gets
// to play out across, on top of the one screen it's pinned within. Roughly
// 2.6 screens per 10s of footage keeps scrub sensitivity consistent.
const SCRUB_SCREENS = 2.6 * heroChapters.length;

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

// Maps a window local to one chapter (0–1 across just that chapter) onto
// the overall 0–1 video progress — so beats stay correctly placed relative
// to their own footage no matter how many chapters exist in total.
function chapterWindow(chapterIndex: number, local: number[]): number[] {
  const width = 1 / heroChapters.length;
  const start = chapterIndex * width;
  return local.map((v) => start + v * width);
}

// One continuous scroll, one story, a run of cued beats instead of a single
// block of text sitting on screen the whole time. Each fades in only once
// its shot has had a moment to establish, holds, then clears out before the
// next beat. Every beat — the chapter headlines and the quick stat flashes
// between them alike — shares the same low, same-side treatment so it reads
// as one consistent theme rather than a mix of styles. All of this is
// normalized against the VIDEO's own scroll range, not the trailing hold —
// so it's unaffected by how long the hold lasts.
const BEATS = {
  // Chapter 1 — aerial approach into the logo reveal.
  beat1Opacity: { input: chapterWindow(0, [0.05, 0.15, 0.45, 0.55]), output: [0, 1, 1, 0] },
  beat1Y: { input: chapterWindow(0, [0.05, 0.15]), output: [24, 0] },
  cardAOpacity: { input: chapterWindow(0, [0.62, 0.68, 0.74, 0.8]), output: [0, 1, 1, 0] },
  cardAY: { input: chapterWindow(0, [0.62, 0.68]), output: [24, 0] },

  // Chapter 2 — the multi-site drone reveal.
  beat2Opacity: { input: chapterWindow(1, [0.1, 0.2, 0.55, 0.65]), output: [0, 1, 1, 0] },
  beat2Y: { input: chapterWindow(1, [0.1, 0.2]), output: [24, 0] },
  cardBOpacity: { input: chapterWindow(1, [0.72, 0.78, 0.84, 0.9]), output: [0, 1, 1, 0] },
  cardBY: { input: chapterWindow(1, [0.72, 0.78]), output: [24, 0] },

  // Chapter 3 — the medical clinic close-in.
  beat3CaptionOpacity: { input: chapterWindow(2, [0.08, 0.18, 0.55, 0.65]), output: [0, 1, 1, 0] },
  beat3CaptionY: { input: chapterWindow(2, [0.08, 0.18]), output: [24, 0] },
  cardCOpacity: { input: chapterWindow(2, [0.7, 0.76, 0.82, 0.88]), output: [0, 1, 1, 0] },
  cardCY: { input: chapterWindow(2, [0.7, 0.76]), output: [24, 0] },

  // Closing payoff — a single, centered conversion CTA, entering right as
  // the video settles on its last frame and held through the hold zone.
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

type TextBeatProps = {
  opacity: number;
  y: number;
  kicker: string;
  title: string;
  text?: string;
};

// Every beat in the story — the opening line, the chapter captions, and the
// quick stat flashes in between — shares this one treatment: a small
// uppercase kicker over a bold headline, anchored low on the same side.
// One consistent look reads as a single story rather than a mix of styles.
function TextBeat({ opacity, y, kicker, title, text }: TextBeatProps) {
  return (
    <div
      className="pointer-events-none container-shell absolute inset-0 grid h-full items-end pb-16 md:pb-24"
      style={{ opacity }}
    >
      <div className="max-w-[36rem]" style={{ transform: `translateY(${y}px)` }}>
        <span className="mb-4 inline-flex text-[0.62rem] font-semibold uppercase tracking-[0.24em] text-white/75 sm:text-[0.68rem]">
          {kicker}
        </span>
        <h2 className="max-w-[16ch] text-balance font-display text-[2.2rem] font-semibold leading-[0.98] tracking-[-0.03em] text-white sm:text-[3rem]">
          {title}
        </h2>
        {text ? (
          <p className="mt-4 max-w-[30rem] text-[0.95rem] leading-7 text-slate-200/92">{text}</p>
        ) : null}
      </div>
    </div>
  );
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

        {/* Beat 1 — chapter 1 headline */}
        <div
          className="pointer-events-none container-shell absolute inset-0 grid h-full items-end pb-16 md:pb-24"
          style={{ opacity: beats.beat1Opacity }}
        >
          <div className="max-w-[41rem]" style={{ transform: `translateY(${beats.beat1Y}px)` }}>
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

        {/* Card A — chapter 1 stat flash */}
        <TextBeat
          opacity={beats.cardAOpacity}
          y={beats.cardAY}
          kicker="100% Filipino-Owned"
          title="A proudly Filipino capitalized corporation."
        />

        {/* Beat 2 — chapter 2 headline */}
        <TextBeat
          opacity={beats.beat2Opacity}
          y={beats.beat2Y}
          kicker="One team, every site"
          title="Hospitals, retail, and residences — built across Luzon."
        />

        {/* Card B — chapter 2 stat flash */}
        <TextBeat
          opacity={beats.cardBOpacity}
          y={beats.cardBY}
          kicker="10 Core Services"
          title="From consultation to final electrical fit-out, all under one team."
        />

        {/* Beat 3 — chapter 3 headline */}
        <TextBeat
          opacity={beats.beat3CaptionOpacity}
          y={beats.beat3CaptionY}
          kicker="Built for healthcare"
          title="Trusted for hospitals and medical clinics across Luzon."
        />

        {/* Card C — chapter 3 stat flash */}
        <TextBeat
          opacity={beats.cardCOpacity}
          y={beats.cardCY}
          kicker="Certified Professionals"
          title="Every project meets the highest standards of quality and workmanship."
        />

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
