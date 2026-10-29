"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useMotionValueEvent, useScroll, useSpring, useTransform } from "framer-motion";
import { ScrollScrubVideo } from "@/components/scroll-scrub-video";
import { withBasePath } from "@/lib/base-path";

const toChapters = (src: string) => [
  { src: withBasePath(src), poster: withBasePath("/videos/hero-entrance-poster.jpg"), duration: 30 }
];

const heroChapters = toChapters("/videos/hero-entrance.mp4");

// Phones get a lighter encode of the same footage: a keyframe every 3 frames
// and no B-frames, so every scroll-driven seek only has to decode a couple of
// frames instead of rebuilding a long chain — that's what keeps the scrub
// smooth on mobile hardware. (It's also ~30% smaller to download.)
const heroChaptersMobile = toChapters("/videos/hero-entrance-mobile.mp4");

const TOTAL_DURATION = heroChapters.reduce((sum, chapter) => sum + chapter.duration, 0);

// How much extra scroll distance (in screens) the whole video gets to play
// out across, on top of the one screen it's pinned within. Roughly 2.6
// screens per 10s of footage keeps scrub sensitivity consistent.
const SCRUB_SCREENS = 2.6 * (TOTAL_DURATION / 10);

// Extra scroll distance, after the video finishes, where the pinned view
// holds on the last frame with the closing CTA up — so the payoff gets a
// few honest scrolls of dwell time instead of being swept away the instant
// the video ends.
const HOLD_SCREENS = 2;

// Interpolates through a set of keyframes, clamped to the ends.
function interpolate(value: number, input: number[], output: number[]): number {
  if (value <= input[0]) return output[0];
  const last = input.length - 1;
  if (value >= input[last]) return output[last];
  for (let i = 0; i < last; i++) {
    if (value >= input[i] && value <= input[i + 1]) {
      const t = (value - input[i]) / (input[i + 1] - input[i]);
      return output[i] + t * (output[i + 1] - output[i]);
    }
  }
  return output[last];
}

// Each caption is a window on the video's own timeline (in seconds), so it
// stays locked to what's on screen as the user scrubs forward or back —
// [fade-in start, fully in, start fading out, fully out]. The headline is
// kept clear of the video's baked-in logo reveal (roughly 0:08-0:13).
type Window = [number, number, number, number];

const WINDOWS = {
  brand: [0, 0, 2.5, 4],
  headline: [4.5, 6, 7.2, 8.2],
  filipino: [13.4, 14.4, 16.2, 17],
  sites: [17.5, 19, 21.5, 23],
  healthcare: [23.2, 24, 25.4, 26.2],
  cta: [26.5, 29, TOTAL_DURATION + 1, TOTAL_DURATION + 2]
} as const satisfies Record<string, Window>;

type CaptionKey = keyof typeof WINDOWS;
type Captions = Record<CaptionKey, number>;

function computeCaptions(time: number): Captions {
  const result = {} as Captions;
  for (const key in WINDOWS) {
    const k = key as CaptionKey;
    result[k] = interpolate(time, [...WINDOWS[k]], [0, 1, 1, 0]);
  }
  // First frame should already show the brand intro, not fade up from nothing.
  if (time <= 0) result.brand = 1;
  return result;
}

function captionStyle(opacity: number) {
  return {
    opacity,
    transform: `translateY(${(1 - opacity) * 22}px)`,
    pointerEvents: opacity > 0.5 ? ("auto" as const) : ("none" as const)
  };
}

// Static starting look for each caption; after mount, scrolling updates them directly.
const initialCaptions = computeCaptions(0);

const panelClass =
  "container-shell absolute inset-0 flex flex-col items-center justify-center pb-14 pt-4 text-center md:pb-28 md:pt-10";

export function HeroSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const captionRefs = useRef<Record<CaptionKey, HTMLDivElement | null>>({
    brand: null,
    headline: null,
    filipino: null,
    sites: null,
    healthcare: null,
    cta: null
  });

  // Which encode to use is only known on the client (phone vs. desktop), so
  // the video mounts after the first render and the poster shows until then —
  // this way a phone never starts downloading the large desktop file.
  const [videoChapters, setVideoChapters] = useState<typeof heroChapters | null>(null);

  useEffect(() => {
    const phone = window.matchMedia("(max-width: 767px), (hover: none)");
    setVideoChapters(phone.matches ? heroChaptersMobile : heroChapters);
  }, []);

  // The sticky site header sits above this section in normal document flow
  // (it isn't an overlay), so sizing the pinned view to a flat 100vh would
  // push its bottom edge below the actual viewport by the header's height.
  // Measuring it keeps the pinned view exactly viewport-fitted regardless
  // of breakpoint.
  const [headerHeight, setHeaderHeight] = useState(0);

  useEffect(() => {
    const header = document.querySelector("header");
    if (!header) return;

    const update = () => setHeaderHeight(header.getBoundingClientRect().height);
    update();

    const resizeObserver = new ResizeObserver(update);
    resizeObserver.observe(header);
    return () => resizeObserver.disconnect();
  }, []);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"]
  });

  // `scrollYProgress` spans the whole section, including the closing hold.
  // Rescale it so 0..1 covers just the video, then lightly smooth it so a
  // mouse-wheel notch doesn't jump the footage in one hard step.
  const videoShare = (1 + SCRUB_SCREENS) / (1 + SCRUB_SCREENS + HOLD_SCREENS);
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 170, damping: 32, mass: 0.6, restDelta: 0.00005 });
  const videoProgress = useTransform(smoothProgress, (value) => Math.min(1, Math.max(0, value / videoShare)));

  // Captions are written straight to the DOM instead of through React state:
  // re-rendering the whole hero 60 times a second while scrolling is real
  // work on a phone's CPU and competes with the video decoder for time.
  useMotionValueEvent(videoProgress, "change", (progress) => {
    const captions = computeCaptions(progress * TOTAL_DURATION);
    for (const key in captions) {
      const element = captionRefs.current[key as CaptionKey];
      if (!element) continue;
      const style = captionStyle(captions[key as CaptionKey]);
      element.style.opacity = String(style.opacity);
      element.style.transform = style.transform;
      element.style.pointerEvents = style.pointerEvents;
    }
  });

  const screen = `(100svh - ${headerHeight}px)`;

  return (
    <section ref={sectionRef} className="relative" style={{ height: `calc(${screen} * ${1 + SCRUB_SCREENS + HOLD_SCREENS})` }}>
      <div className="sticky overflow-hidden" style={{ top: headerHeight, height: `calc${screen}` }}>
        {/* Persistent background layer — the video and its overlays stay
            pinned while the scroll distance below plays it out. */}
        <div className="absolute inset-0" aria-hidden="true">
          {videoChapters ? (
            <ScrollScrubVideo progress={videoProgress} chapters={videoChapters} fallbackImage={heroChapters[0].poster} />
          ) : (
            <div
              className="photo-grade absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url('${heroChapters[0].poster}')` }}
            />
          )}

          <div className="pointer-events-none absolute inset-0">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_100%_0%,rgba(72,130,227,0.22),transparent_28%)]" />
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(7,14,24,0.82)_0%,rgba(7,14,24,0.5)_28%,rgba(7,14,24,0.16)_54%,rgba(7,14,24,0.54)_100%)]" />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,14,24,0.1)_0%,rgba(7,14,24,0.05)_55%,rgba(7,14,24,0.55)_100%)]" />
            <div className="absolute inset-0 opacity-[0.18] [mask-image:linear-gradient(to_bottom,black,transparent_78%)]">
              <div className="h-full w-full bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:88px_88px]" />
            </div>
          </div>
        </div>

        {/* Opening brand intro */}
        <div ref={(node) => { captionRefs.current.brand = node; }} className={`${panelClass} pointer-events-none`} style={captionStyle(initialCaptions.brand)}>
          <div className="relative h-20 w-20 sm:h-24 sm:w-24">
            <Image src={withBasePath("/logo-icon.png")} alt="" fill sizes="96px" className="object-contain" priority />
          </div>
          <h1 className="mt-6 text-balance font-display text-[1.6rem] font-semibold leading-tight tracking-[-0.02em] text-white sm:text-[2.1rem]">
            Monricher Construction and Development
          </h1>
        </div>

        {/* Opening headline */}
        <div ref={(node) => { captionRefs.current.headline = node; }} className={`${panelClass} pointer-events-none`} style={captionStyle(initialCaptions.headline)}>
          <div className="max-w-[41rem] text-left">
            <span className="mb-5 inline-flex text-[0.62rem] font-semibold uppercase tracking-[0.24em] text-white/75 sm:text-[0.68rem]">
              High quality design and construction for all industries
            </span>
            <h2 className="max-w-[16ch] text-balance font-display text-[2.4rem] font-semibold leading-[0.98] tracking-[-0.03em] text-white sm:text-[3.4rem]">
              Constructing solutions, crafting excellence.
            </h2>
            <p className="mt-5 max-w-[34rem] text-[0.97rem] leading-7 text-slate-200/92 sm:text-base">
              Monricher Construction &amp; Development Corp is a 100% Filipino capitalized corporation delivering new
              construction, renovation, expansion, and demolition with honesty, integrity, and a client-focused result.
            </p>
          </div>
        </div>

        {/* Ownership beat — lands in the stretch after the baked-in logo reveal */}
        <div ref={(node) => { captionRefs.current.filipino = node; }} className={`${panelClass} pointer-events-none`} style={captionStyle(initialCaptions.filipino)}>
          <div className="max-w-[41rem] text-left">
            <span className="mb-5 inline-flex text-[0.62rem] font-semibold uppercase tracking-[0.24em] text-white/75 sm:text-[0.68rem]">
              100% Filipino-Owned
            </span>
            <h2 className="max-w-[16ch] text-balance font-display text-[2.4rem] font-semibold leading-[0.98] tracking-[-0.03em] text-white sm:text-[3.4rem]">
              A proudly Filipino capitalized corporation.
            </h2>
          </div>
        </div>

        {/* Mid-story beat */}
        <div ref={(node) => { captionRefs.current.sites = node; }} className={`${panelClass} pointer-events-none`} style={captionStyle(initialCaptions.sites)}>
          <div className="max-w-[41rem] text-left">
            <span className="mb-5 inline-flex text-[0.62rem] font-semibold uppercase tracking-[0.24em] text-white/75 sm:text-[0.68rem]">
              One team, every site
            </span>
            <h2 className="max-w-[16ch] text-balance font-display text-[2.4rem] font-semibold leading-[0.98] tracking-[-0.03em] text-white sm:text-[3.4rem]">
              Hospitals, retail, and residences — built across Luzon.
            </h2>
          </div>
        </div>

        {/* Healthcare beat — leads into the clinic storefront at the end of the footage */}
        <div ref={(node) => { captionRefs.current.healthcare = node; }} className={`${panelClass} pointer-events-none`} style={captionStyle(initialCaptions.healthcare)}>
          <div className="max-w-[41rem] text-left">
            <span className="mb-5 inline-flex text-[0.62rem] font-semibold uppercase tracking-[0.24em] text-white/75 sm:text-[0.68rem]">
              Built for healthcare
            </span>
            <h2 className="max-w-[16ch] text-balance font-display text-[2.4rem] font-semibold leading-[0.98] tracking-[-0.03em] text-white sm:text-[3.4rem]">
              Trusted for hospitals and medical clinics across Luzon.
            </h2>
          </div>
        </div>

        {/* Closing payoff — one centered, unmissable conversion CTA */}
        <div ref={(node) => { captionRefs.current.cta = node; }} className={panelClass} style={captionStyle(initialCaptions.cta)}>
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
      </div>
    </section>
  );
}
