"use client";

import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import { Reveal } from "@/components/reveal";
import { featuredProjects } from "@/lib/site-data";

type VerticalProjectCardProps = {
  title: string;
  subtitle: string;
  image: string;
  index: number;
  activeIndex: number;
  setActiveIndex: (index: number) => void;
  scrollProgress: ReturnType<typeof useScroll>["scrollYProgress"];
};

type MobileProjectCardProps = {
  title: string;
  subtitle: string;
  image: string;
  index: number;
  scrollProgress: ReturnType<typeof useScroll>["scrollYProgress"];
};

function VerticalProjectCard({
  title,
  subtitle,
  image,
  index,
  activeIndex,
  setActiveIndex,
  scrollProgress
}: VerticalProjectCardProps) {
  const prefersReducedMotion = useReducedMotion();
  const isActive = activeIndex === index;

  const lagRanges: [number, number][] = [
    [8, -14],
    [10, -18],
    [6, -12],
    [8, -14],
    [12, -20],
    [8, -14],
    [10, -16],
    [8, -14],
    [12, -18]
  ];

  const imageBaseY = useTransform(
    scrollProgress,
    [0, 1],
    prefersReducedMotion ? [0, 0] : lagRanges[index % lagRanges.length]
  );
  const imageY = useSpring(imageBaseY, {
    stiffness: 74,
    damping: 24,
    mass: 0.56
  });

  return (
    <motion.a
      href="/projects#projects-all"
      onMouseEnter={() => setActiveIndex(index)}
      onFocus={() => setActiveIndex(index)}
      onClick={() => setActiveIndex(index)}
      animate={{
        width: isActive ? "56%" : "22%"
      }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className="group relative h-[25rem] min-w-0 overflow-hidden rounded-[26px] border border-white/10 bg-panel shadow-soft md:h-[31rem]"
      aria-label={`View project: ${title}`}
    >
      <motion.div
        style={prefersReducedMotion ? undefined : { y: imageY }}
        className="absolute inset-0"
        aria-hidden="true"
      >
        <div
          className="h-full w-[220%] bg-cover bg-center transition-transform duration-700 group-hover:scale-[1.03]"
          style={{ backgroundImage: `url('${image}')` }}
        />
      </motion.div>

      <motion.div
        animate={{ x: isActive ? "0%" : "-36%" }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className="absolute inset-0"
      >
        <div className="h-full w-full bg-gradient-to-b from-[rgba(5,10,18,0.18)] via-[rgba(5,10,18,0.42)] to-[rgba(5,10,18,0.9)]" />
      </motion.div>

      <div className="pointer-events-none absolute inset-0 flex flex-col justify-end p-5 md:p-7">
        <p className="text-[0.7rem] font-bold uppercase tracking-[0.2em] text-white/88">{subtitle}</p>
        <h3 className="mt-3 max-w-[15ch] text-[1.35rem] font-bold leading-tight text-white md:text-[1.9rem]">
          {title}
        </h3>
      </div>
    </motion.a>
  );
}

function MobileProjectCard({
  title,
  subtitle,
  image,
  index,
  scrollProgress
}: MobileProjectCardProps) {
  const prefersReducedMotion = useReducedMotion();
  const mobileBase = useTransform(
    scrollProgress,
    [0, 1],
    prefersReducedMotion ? [0, 0] : [8 + index * 2, -10 - index * 3]
  );
  const mobileY = useSpring(mobileBase, {
    stiffness: 80,
    damping: 24,
    mass: 0.56
  });

  return (
    <motion.article
      style={prefersReducedMotion ? undefined : { y: mobileY }}
      className="relative overflow-hidden rounded-[24px] border border-white/10 bg-panel shadow-soft"
    >
      <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url('${image}')` }} />
      <div className="absolute inset-0 bg-gradient-to-b from-[rgba(5,10,18,0.2)] via-[rgba(5,10,18,0.42)] to-[rgba(5,10,18,0.9)]" />
      <div className="relative min-h-[22rem]" />
      <div className="pointer-events-none absolute inset-0 flex flex-col justify-end p-5">
        <p className="text-[0.7rem] font-bold uppercase tracking-[0.2em] text-white/88">{subtitle}</p>
        <h3 className="mt-3 text-[1.5rem] font-bold leading-tight text-white">{title}</h3>
      </div>
    </motion.article>
  );
}

export function FeaturedProjects() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [activeIndex, setActiveIndex] = useState(1);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  return (
    <section ref={sectionRef} id="projects" className="relative py-16 md:py-24">
      <div className="container-shell">
        <Reveal className="mx-auto max-w-3xl text-center">
          <span className="section-kicker">Featured Projects</span>
          <h2 className="text-balance text-[2rem] font-bold leading-tight text-white md:text-5xl">
            Featured Projects
          </h2>
          <p className="mt-4 text-base leading-7 text-slate-200 md:mt-5 md:text-lg md:leading-8">
            Vertical project cards with subtle motion and a clean reveal interaction for easier
            browsing.
          </p>
        </Reveal>

        <div className="mt-10 hidden gap-4 md:mt-14 md:flex md:h-[31rem]">
          {featuredProjects.slice(0, 4).map((project, index) => (
            <VerticalProjectCard
              key={project.title}
              title={project.title}
              subtitle={project.subtitle}
              image={project.image}
              index={index}
              activeIndex={activeIndex}
              setActiveIndex={setActiveIndex}
              scrollProgress={scrollYProgress}
            />
          ))}
        </div>

        <div className="mt-10 grid gap-5 md:hidden">
          {featuredProjects.slice(0, 4).map((project, index) => (
            <MobileProjectCard
              key={`${project.title}-mobile`}
              title={project.title}
              subtitle={project.subtitle}
              image={project.image}
              index={index}
              scrollProgress={scrollYProgress}
            />
          ))}
        </div>

        <Reveal className="mt-8 text-center md:mt-10">
          <p className="text-sm leading-7 text-muted">
            Hover desktop cards or tap a card on mobile to focus a project.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
