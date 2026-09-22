"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { ScrollScrubVideo } from "@/components/scroll-scrub-video";
import { withBasePath } from "@/lib/base-path";

const heroChapters = [
  { src: "/videos/hero-entrance.mp4", poster: "/videos/hero-entrance-poster.jpg", duration: 30 }
].map((chapter) => ({ ...chapter, src: withBasePath(chapter.src), poster: withBasePath(chapter.poster) }));

const TOTAL_DURATION = heroChapters.reduce((sum, chapter) => sum + chapter.duration, 0);

type Stop =
  | { kind: "brand" }
  | { kind: "text"; kicker: string; title: string; text?: string }
  | { kind: "cta" };

// Four stops landing exactly at 0:00, 0:10, 0:20 and 0:30 of the video.
// Each scroll gesture moves exactly one stop (enforced natively via CSS
// scroll-snap, not custom wheel handling) so a caption never gets caught
// mid-fade at some arbitrary in-between scroll position.
const STOPS: Stop[] = [
  { kind: "brand" },
  {
    kind: "text",
    kicker: "High quality design and construction for all industries",
    title: "Constructing solutions, crafting excellence.",
    text: "Monricher Construction & Development Corp is a 100% Filipino capitalized corporation delivering new construction, renovation, expansion, and demolition with honesty, integrity, and a client-focused result."
  },
  {
    kind: "text",
    kicker: "One team, every site",
    title: "Hospitals, retail, and residences — built across Luzon."
  },
  { kind: "cta" }
];

const STOP_TIMES = STOPS.map((_, index) => (index / (STOPS.length - 1)) * TOTAL_DURATION);

// Text now waits before appearing, landing closer to the end of each
// stop's (5s) video transition instead of fading in the instant the stop
// becomes active — matches framer-motion's `ease: "easeOut"` tween
// duration in scroll-scrub-video.tsx. No delay on the way out, so the
// outgoing stop's text clears immediately once the user moves on.
const TEXT_APPEAR_DELAY_MS = 2560;
const TEXT_FADE_DURATION_MS = 700;

function fadeStyle(isActive: boolean): CSSProperties {
  return {
    opacity: isActive ? 1 : 0,
    transitionDelay: isActive ? `${TEXT_APPEAR_DELAY_MS}ms` : "0ms",
    transitionDuration: `${TEXT_FADE_DURATION_MS}ms`
  };
}

export function HeroSection() {
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const panelRefs = useRef<Array<HTMLDivElement | null>>([]);
  const [activeStop, setActiveStop] = useState(0);

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const index = panelRefs.current.indexOf(entry.target as HTMLDivElement);
          if (index !== -1) setActiveStop(index);
        }
      },
      { root: scroller, threshold: 0.6 }
    );

    for (const panel of panelRefs.current) {
      if (panel) observer.observe(panel);
    }

    return () => observer.disconnect();
  }, []);

  // The sticky site header sits above this section in normal document flow
  // (it isn't an overlay), so sizing the hero to a flat 100vh would push its
  // bottom edge below the actual viewport by the header's height. Measuring
  // it keeps the hero exactly viewport-fitted regardless of breakpoint.
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

  return (
    <section className="relative" style={{ height: `calc(100vh - ${headerHeight}px)` }}>
      {/* Persistent background layer — the video and its overlays stay put
          while the panels above scroll/snap past them. */}
      <div className="absolute inset-0" aria-hidden="true">
        <ScrollScrubVideo chapters={heroChapters} targetTime={STOP_TIMES[activeStop]} fallbackImage={heroChapters[0].poster} />

        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_100%_0%,rgba(72,130,227,0.22),transparent_28%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(7,14,24,0.82)_0%,rgba(7,14,24,0.5)_28%,rgba(7,14,24,0.16)_54%,rgba(7,14,24,0.54)_100%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,14,24,0.1)_0%,rgba(7,14,24,0.05)_55%,rgba(7,14,24,0.55)_100%)]" />
          <div className="absolute inset-0 opacity-[0.18] [mask-image:linear-gradient(to_bottom,black,transparent_78%)]">
            <div className="h-full w-full bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:88px_88px]" />
          </div>
        </div>
      </div>

      {/* The actual scroll-snap container — one full-screen panel per stop,
          each holding only that stop's text. `scroll-snap-stop: always`
          stops a fast fling from skipping past a stop; once the last (or
          first) panel is exhausted, scroll naturally bubbles to the page. */}
      <div
        ref={scrollerRef}
        className="relative z-10 h-full snap-y snap-mandatory overflow-y-scroll [scroll-snap-stop:always] [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
      >
        {STOPS.map((stop, index) => (
          <div
            key={index}
            ref={(node) => {
              panelRefs.current[index] = node;
            }}
            className="container-shell flex h-full snap-start flex-col items-center justify-center pb-14 pt-4 text-center md:pb-28 md:pt-10"
          >
            {stop.kind === "brand" ? (
              <div className="flex flex-col items-center transition-opacity" style={fadeStyle(activeStop === 0)}>
                <div className="relative h-20 w-20 sm:h-24 sm:w-24">
                  <Image
                    src={withBasePath("/logo-icon.png")}
                    alt=""
                    fill
                    sizes="96px"
                    className="object-contain"
                    priority
                  />
                </div>
                <h1 className="mt-6 text-balance font-display text-[1.6rem] font-semibold leading-tight tracking-[-0.02em] text-white sm:text-[2.1rem]">
                  Monricher Construction and Development
                </h1>
              </div>
            ) : null}

            {stop.kind === "text" ? (
              <div className="max-w-[41rem] text-left transition-opacity" style={fadeStyle(activeStop === index)}>
                <span className="mb-5 inline-flex text-[0.62rem] font-semibold uppercase tracking-[0.24em] text-white/75 sm:text-[0.68rem]">
                  {stop.kicker}
                </span>
                <h2 className="max-w-[16ch] text-balance font-display text-[2.4rem] font-semibold leading-[0.98] tracking-[-0.03em] text-white sm:text-[3.4rem]">
                  {stop.title}
                </h2>
                {stop.text ? (
                  <p className="mt-5 max-w-[34rem] text-[0.97rem] leading-7 text-slate-200/92 sm:text-base">
                    {stop.text}
                  </p>
                ) : null}
              </div>
            ) : null}

            {stop.kind === "cta" ? (
              <div className="flex flex-col items-center transition-opacity" style={fadeStyle(activeStop === index)}>
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
            ) : null}
          </div>
        ))}
      </div>
    </section>
  );
}
