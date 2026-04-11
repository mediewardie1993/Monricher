"use client";

import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue
} from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Reveal } from "@/components/reveal";
import { featuredProjects } from "@/lib/site-data";

type ProjectCardProps = {
  title: string;
  subtitle: string;
  image: string;
  progress: MotionValue<number>;
  imageRange: {
    desktop: [number, number];
    tablet: [number, number];
    mobile: [number, number];
  };
};

function ProjectCard({ title, subtitle, image, progress, imageRange }: ProjectCardProps) {
  const prefersReducedMotion = useReducedMotion();
  const [viewportMode, setViewportMode] = useState<"desktop" | "tablet" | "mobile">("desktop");

  useEffect(() => {
    const updateViewportMode = () => {
      if (window.innerWidth < 768) {
        setViewportMode("mobile");
        return;
      }

      if (window.innerWidth < 1280) {
        setViewportMode("tablet");
        return;
      }

      setViewportMode("desktop");
    };

    updateViewportMode();
    window.addEventListener("resize", updateViewportMode, { passive: true });
    return () => window.removeEventListener("resize", updateViewportMode);
  }, []);

  const activeRange =
    viewportMode === "mobile"
      ? imageRange.mobile
      : viewportMode === "tablet"
        ? imageRange.tablet
        : imageRange.desktop;
  const imageBaseY = useTransform(
    progress,
    [0, 1],
    prefersReducedMotion ? [0, 0] : activeRange
  );
  const imageY = useSpring(imageBaseY, {
    stiffness: 72,
    damping: 24,
    mass: 0.6
  });

  return (
    <article className="group relative overflow-hidden rounded-[28px] border border-white/10 bg-panel shadow-soft">
      <motion.div
        style={{ y: imageY }}
        className="absolute inset-x-0 -top-6 -bottom-6 md:-top-7 md:-bottom-7"
      >
        <div
          className="h-full w-full bg-cover bg-center transition duration-700 group-hover:scale-[1.035]"
          style={{
            backgroundImage: `url('${image}')`
          }}
        />
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-b from-[rgba(4,10,18,0.12)] via-[rgba(4,10,18,0.4)] to-[rgba(4,10,18,0.92)]" />
      <div className="min-h-[22rem] md:min-h-[23.5rem] xl:min-h-[24.5rem]" />
      <div className="pointer-events-none absolute inset-0 flex flex-col justify-end p-6 md:p-7 xl:p-8">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-100">{subtitle}</p>
        <h3 className="mt-3 max-w-[14ch] text-[1.75rem] font-bold leading-tight text-white md:text-[1.95rem] xl:text-[2.1rem]">
          {title}
        </h3>
      </div>
    </article>
  );
}

function buildColumns() {
  return [
    featuredProjects.filter((_, index) => index % 3 === 0),
    featuredProjects.filter((_, index) => index % 3 === 1),
    featuredProjects.filter((_, index) => index % 3 === 2)
  ];
}

export function FeaturedProjects() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const prefersReducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  const columns = buildColumns();
  const mobileRange = prefersReducedMotion ? [0, 0] : [-10, 10];
  const tabletRange = prefersReducedMotion ? [0, 0] : [-12, 12];
  const desktopRanges: [number, number][] = prefersReducedMotion
    ? [
        [0, 0],
        [0, 0],
        [0, 0]
      ]
    : [
        [12, -18],
        [20, -32],
        [16, -24]
      ];

  const columnOneBase = useTransform(scrollYProgress, [0, 1], desktopRanges[0]);
  const columnTwoBase = useTransform(scrollYProgress, [0, 1], desktopRanges[1]);
  const columnThreeBase = useTransform(scrollYProgress, [0, 1], desktopRanges[2]);

  const columnOne = useSpring(columnOneBase, { stiffness: 78, damping: 24, mass: 0.52 });
  const columnTwo = useSpring(columnTwoBase, { stiffness: 78, damping: 24, mass: 0.52 });
  const columnThree = useSpring(columnThreeBase, { stiffness: 78, damping: 24, mass: 0.52 });

  const tabletOneBase = useTransform(scrollYProgress, [0, 1], tabletRange);
  const tabletTwoBase = useTransform(scrollYProgress, [0, 1], [tabletRange[1], tabletRange[0]]);
  const mobileBase = useTransform(scrollYProgress, [0, 1], mobileRange);

  const tabletOne = useSpring(tabletOneBase, { stiffness: 84, damping: 24, mass: 0.5 });
  const tabletTwo = useSpring(tabletTwoBase, { stiffness: 84, damping: 24, mass: 0.5 });
  const mobileOne = useSpring(mobileBase, { stiffness: 88, damping: 26, mass: 0.5 });
  const imageRanges: ProjectCardProps["imageRange"][] = prefersReducedMotion
    ? featuredProjects.map(() => ({
        desktop: [0, 0] as [number, number],
        tablet: [0, 0] as [number, number],
        mobile: [0, 0] as [number, number]
      }))
    : [
        { desktop: [0, -18], tablet: [0, -10], mobile: [0, -4] },
        { desktop: [0, -24], tablet: [0, -12], mobile: [0, -5] },
        { desktop: [0, -20], tablet: [0, -10], mobile: [0, -4] },
        { desktop: [0, -28], tablet: [0, -14], mobile: [0, -6] },
        { desktop: [0, -22], tablet: [0, -12], mobile: [0, -5] },
        { desktop: [0, -30], tablet: [0, -16], mobile: [0, -6] },
        { desktop: [0, -20], tablet: [0, -10], mobile: [0, -4] },
        { desktop: [0, -26], tablet: [0, -14], mobile: [0, -5] },
        { desktop: [0, -22], tablet: [0, -12], mobile: [0, -5] }
      ];
  const desktopCardRanges = imageRanges;
  const tabletCardRanges = [
    desktopCardRanges[0],
    desktopCardRanges[3],
    desktopCardRanges[6],
    desktopCardRanges[2],
    desktopCardRanges[1],
    desktopCardRanges[4],
    desktopCardRanges[5],
    desktopCardRanges[7],
    desktopCardRanges[8]
  ];

  return (
    <section ref={sectionRef} id="projects" className="relative h-[180vh] py-20 md:py-28">
      <div className="sticky top-24">
        <div className="container-shell">
          <Reveal className="mx-auto max-w-3xl text-center">
            <span className="section-kicker">Featured Projects</span>
            <h2 className="text-balance text-3xl font-bold leading-tight text-white md:text-5xl">
              Featured Projects
            </h2>
            <p className="mt-5 text-lg leading-8 text-slate-200">
              A premium portfolio gallery with calm scroll motion, designed to feel architectural,
              polished, and easy to follow.
            </p>
          </Reveal>

          <div className="mt-14 hidden grid-cols-3 gap-7 xl:grid">
            <div className="[mask-image:linear-gradient(to_bottom,transparent_0%,black_10%,black_90%,transparent_100%)]">
              <motion.div style={{ y: columnOne }} className="grid gap-5">
                {columns[0].map((project, index) => (
                  <ProjectCard
                    key={project.title}
                    {...project}
                    progress={scrollYProgress}
                    imageRange={desktopCardRanges[index * 3]}
                  />
                ))}
              </motion.div>
            </div>
            <div className="[mask-image:linear-gradient(to_bottom,transparent_0%,black_9%,black_91%,transparent_100%)]">
              <motion.div style={{ y: columnTwo }} className="grid gap-5">
                {columns[1].map((project, index) => (
                  <ProjectCard
                    key={project.title}
                    {...project}
                    progress={scrollYProgress}
                    imageRange={desktopCardRanges[index * 3 + 1]}
                  />
                ))}
              </motion.div>
            </div>
            <div className="[mask-image:linear-gradient(to_bottom,transparent_0%,black_10%,black_90%,transparent_100%)]">
              <motion.div style={{ y: columnThree }} className="grid gap-5">
                {columns[2].map((project, index) => (
                  <ProjectCard
                    key={project.title}
                    {...project}
                    progress={scrollYProgress}
                    imageRange={desktopCardRanges[index * 3 + 2]}
                  />
                ))}
              </motion.div>
            </div>
          </div>

          <div className="mt-14 hidden grid-cols-2 gap-6 md:grid xl:hidden">
            <div className="[mask-image:linear-gradient(to_bottom,transparent_0%,black_9%,black_91%,transparent_100%)]">
              <motion.div style={{ y: tabletOne }} className="grid gap-5">
                {[...columns[0], ...columns[2].slice(0, 1)].map((project, index) => (
                  <ProjectCard
                    key={project.title}
                    {...project}
                    progress={scrollYProgress}
                    imageRange={tabletCardRanges[index]}
                  />
                ))}
              </motion.div>
            </div>
            <div className="[mask-image:linear-gradient(to_bottom,transparent_0%,black_9%,black_91%,transparent_100%)]">
              <motion.div style={{ y: tabletTwo }} className="grid gap-5">
                {[...columns[1], ...columns[2].slice(1)].map((project, index) => (
                  <ProjectCard
                    key={project.title}
                    {...project}
                    progress={scrollYProgress}
                    imageRange={tabletCardRanges[index + 4]}
                  />
                ))}
              </motion.div>
            </div>
          </div>

          <div className="mt-10 md:hidden [mask-image:linear-gradient(to_bottom,transparent_0%,black_8%,black_92%,transparent_100%)]">
            <motion.div style={{ y: mobileOne }} className="grid gap-5">
              {featuredProjects.slice(0, 4).map((project, index) => (
                <ProjectCard
                  key={project.title}
                  {...project}
                  progress={scrollYProgress}
                  imageRange={desktopCardRanges[index]}
                />
              ))}
            </motion.div>
          </div>

          <Reveal className="mt-10 flex justify-center md:mt-12">
            <a href="#contact" className="button-gold-sweep">
              <span>See More Projects</span>
            </a>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
