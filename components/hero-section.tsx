"use client";

import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { useRef } from "react";
import { Reveal } from "@/components/reveal";

export function HeroSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"]
  });

  const backgroundBaseY = useTransform(scrollYProgress, [0, 1], [0, 88]);
  const gridBaseY = useTransform(scrollYProgress, [0, 1], [0, 26]);
  const cardBaseY = useTransform(scrollYProgress, [0, 1], [0, -18]);

  const backgroundY = useSpring(backgroundBaseY, { stiffness: 82, damping: 26, mass: 0.62 });
  const gridY = useSpring(gridBaseY, { stiffness: 88, damping: 28, mass: 0.62 });
  const cardY = useSpring(cardBaseY, { stiffness: 96, damping: 28, mass: 0.6 });

  return (
    <section ref={sectionRef} className="relative overflow-hidden pb-14 pt-4 md:pb-28 md:pt-10">
      <motion.div
        style={{ y: backgroundY }}
        className="absolute inset-0"
        aria-hidden="true"
      >
        <div className="absolute inset-0 scale-[1.08] bg-[url('https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=1800&q=80')] bg-cover bg-center opacity-[0.92]" />
      </motion.div>

      <motion.div
        style={{ y: gridY }}
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_100%_0%,rgba(72,130,227,0.22),transparent_28%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(7,14,24,0.8)_0%,rgba(7,14,24,0.46)_28%,rgba(7,14,24,0.12)_54%,rgba(7,14,24,0.5)_100%)]" />
        <div className="absolute inset-0 opacity-[0.18] [mask-image:linear-gradient(to_bottom,black,transparent_78%)]">
          <div className="h-full w-full bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:88px_88px]" />
        </div>
      </motion.div>

      <div className="container-shell relative grid min-h-[calc(100vh-6.5rem)] items-end gap-10 pt-12 lg:grid-cols-[1.08fr_0.72fr]">
        <Reveal className="max-w-[41rem] py-10 md:py-20">
          <span className="mb-5 inline-flex text-[0.62rem] font-semibold uppercase tracking-[0.24em] text-white/75 sm:text-[0.68rem]">
            Built for confidence. Designed for the future.
          </span>
          <h1 className="max-w-[9ch] text-balance font-display text-[3.3rem] font-semibold leading-[0.92] tracking-[-0.04em] text-white sm:text-[4.4rem] lg:text-[5.6rem]">
            Reliable construction with a modern standard of precision.
          </h1>
          <p className="mt-5 max-w-[34rem] text-[0.97rem] leading-7 text-slate-200/92 sm:text-base">
            Monricher Construction delivers refined residential, commercial, and
            fit-out projects with dependable planning, quality workmanship, and
            clear client communication.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <a href="/contact" className="button-primary w-full sm:w-auto">
              <span>Get a Free Quote</span>
            </a>
            <a href="/projects" className="button-secondary w-full sm:w-auto">
              <span>View Projects</span>
            </a>
          </div>
          <div className="mt-7 flex flex-col gap-2 text-[0.82rem] font-medium text-white/78 sm:flex-row sm:flex-wrap sm:gap-5">
            <span>Clear project timelines</span>
            <span>Premium workmanship</span>
            <span>Client-first delivery</span>
          </div>
        </Reveal>

        <motion.div style={{ y: cardY }} className="lg:justify-self-end">
          <Reveal className="mx-auto w-full max-w-[21rem] self-center rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(12,20,32,0.82),rgba(12,20,32,0.58))] p-5 shadow-[0_24px_60px_rgba(0,0,0,0.26)] backdrop-blur-xl md:p-6" delay={0.15}>
            <div className="flex items-center justify-between gap-4">
              <p className="text-sm font-semibold text-white">Monricher Overview</p>
            </div>
            <div className="mt-4 grid gap-4">
              {[
                ["12+", "Years shaping residential and commercial spaces"],
                ["180+", "Completed projects delivered with consistent quality"],
                ["98%", "Client satisfaction across fit-out and construction work"]
              ].map(([value, label]) => (
                <div key={label} className="border-t border-white/8 pt-4 first:border-t-0 first:pt-0">
                  <p className="font-display text-[2rem] font-semibold leading-none text-white md:text-[2.3rem]">
                    {value}
                  </p>
                  <p className="mt-2 max-w-[18rem] text-[0.92rem] leading-7 text-white/72">
                    {label}
                  </p>
                </div>
              ))}
            </div>
          </Reveal>
        </motion.div>
      </div>
    </section>
  );
}
