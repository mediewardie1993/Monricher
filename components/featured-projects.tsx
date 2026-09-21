"use client";

import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform
} from "framer-motion";
import { useRef, useState, type PointerEvent as ReactPointerEvent, type RefObject } from "react";
import { Lightbox } from "@/components/lightbox";
import { Reveal } from "@/components/reveal";
import { featuredProjects } from "@/lib/site-data";

const canHoverTilt = () =>
  typeof window !== "undefined" && window.matchMedia("(hover: hover) and (pointer: fine)").matches;

const TILT_MAX = 7;

function usePointerTilt(prefersReducedMotion: boolean | null) {
  const ref = useRef<HTMLElement | null>(null);
  const [hovered, setHovered] = useState(false);
  const pointerX = useMotionValue(0.5);
  const pointerY = useMotionValue(0.5);
  const springConfig = { stiffness: 240, damping: 20, mass: 0.5 };
  const smoothX = useSpring(pointerX, springConfig);
  const smoothY = useSpring(pointerY, springConfig);

  const rotateX = useTransform(smoothY, [0, 1], [TILT_MAX, -TILT_MAX]);
  const rotateY = useTransform(smoothX, [0, 1], [-TILT_MAX, TILT_MAX]);
  const glareBackground = useTransform([smoothX, smoothY], ([x, y]) => {
    const px = (x as number) * 100;
    const py = (y as number) * 100;
    return `radial-gradient(280px circle at ${px}% ${py}%, rgba(255,255,255,0.16), transparent 55%)`;
  });

  const handlePointerMove = (event: ReactPointerEvent<HTMLElement>) => {
    if (prefersReducedMotion || !canHoverTilt()) return;
    const node = ref.current;
    if (!node) return;
    const bounds = node.getBoundingClientRect();
    pointerX.set((event.clientX - bounds.left) / bounds.width);
    pointerY.set((event.clientY - bounds.top) / bounds.height);
  };

  const handlePointerEnter = () => {
    if (canHoverTilt()) setHovered(true);
  };

  const handlePointerLeave = () => {
    pointerX.set(0.5);
    pointerY.set(0.5);
    setHovered(false);
  };

  return { ref, hovered, rotateX, rotateY, glareBackground, handlePointerMove, handlePointerEnter, handlePointerLeave };
}

type VerticalProjectCardProps = {
  title: string;
  subtitle: string;
  image: string;
  index: number;
  activeIndex: number;
  setActiveIndex: (index: number) => void;
  scrollProgress: ReturnType<typeof useScroll>["scrollYProgress"];
  onOpen: () => void;
};

type MobileProjectCardProps = {
  title: string;
  subtitle: string;
  image: string;
  index: number;
  scrollProgress: ReturnType<typeof useScroll>["scrollYProgress"];
  onOpen: () => void;
};

function VerticalProjectCard({
  title,
  subtitle,
  image,
  index,
  activeIndex,
  setActiveIndex,
  scrollProgress,
  onOpen
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

  const tilt = usePointerTilt(prefersReducedMotion);

  return (
    <motion.button
      type="button"
      ref={tilt.ref as RefObject<HTMLButtonElement>}
      onMouseEnter={() => setActiveIndex(index)}
      onFocus={() => setActiveIndex(index)}
      onClick={() => {
        setActiveIndex(index);
        onOpen();
      }}
      onPointerMove={tilt.handlePointerMove}
      onPointerEnter={tilt.handlePointerEnter}
      onPointerLeave={tilt.handlePointerLeave}
      animate={{
        width: isActive ? "56%" : "22%"
      }}
      style={
        prefersReducedMotion
          ? undefined
          : { rotateX: tilt.rotateX, rotateY: tilt.rotateY, transformPerspective: 1000 }
      }
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className="group relative h-[25rem] min-w-0 cursor-pointer overflow-hidden rounded-[26px] border border-white/10 bg-panel text-left shadow-soft [transform-style:preserve-3d] md:h-[31rem]"
      aria-label={`View photos: ${title}`}
    >
      <motion.div
        style={prefersReducedMotion ? undefined : { y: imageY }}
        className="absolute inset-0"
        aria-hidden="true"
      >
        <div
          className="photo-grade h-full w-[220%] bg-cover bg-center transition-transform duration-700 group-hover:scale-[1.03]"
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

      {!prefersReducedMotion ? (
        <motion.span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 transition-opacity duration-300"
          style={{ background: tilt.glareBackground, opacity: tilt.hovered ? 1 : 0 }}
        />
      ) : null}
    </motion.button>
  );
}

function MobileProjectCard({
  title,
  subtitle,
  image,
  index,
  scrollProgress,
  onOpen
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

  const tilt = usePointerTilt(prefersReducedMotion);

  return (
    <motion.button
      type="button"
      ref={tilt.ref as RefObject<HTMLButtonElement>}
      onClick={onOpen}
      onPointerMove={tilt.handlePointerMove}
      onPointerEnter={tilt.handlePointerEnter}
      onPointerLeave={tilt.handlePointerLeave}
      style={
        prefersReducedMotion
          ? undefined
          : { y: mobileY, rotateX: tilt.rotateX, rotateY: tilt.rotateY, transformPerspective: 1000 }
      }
      className="relative block w-full cursor-pointer overflow-hidden rounded-[24px] border border-white/10 bg-panel text-left shadow-soft [transform-style:preserve-3d]"
      aria-label={`View photos: ${title}`}
    >
      <div className="photo-grade absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url('${image}')` }} />
      <div className="absolute inset-0 bg-gradient-to-b from-[rgba(5,10,18,0.2)] via-[rgba(5,10,18,0.42)] to-[rgba(5,10,18,0.9)]" />
      <div className="relative min-h-[22rem]" />
      <div className="pointer-events-none absolute inset-0 flex flex-col justify-end p-5">
        <p className="text-[0.7rem] font-bold uppercase tracking-[0.2em] text-white/88">{subtitle}</p>
        <h3 className="mt-3 text-[1.5rem] font-bold leading-tight text-white">{title}</h3>
      </div>
      {!prefersReducedMotion ? (
        <motion.span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 transition-opacity duration-300"
          style={{ background: tilt.glareBackground, opacity: tilt.hovered ? 1 : 0 }}
        />
      ) : null}
    </motion.button>
  );
}

export function FeaturedProjects() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [activeIndex, setActiveIndex] = useState(1);
  const [lightbox, setLightbox] = useState<{ projectIndex: number; imageIndex: number } | null>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  const projects = featuredProjects.slice(0, 4);
  const activeGallery = lightbox ? projects[lightbox.projectIndex] : null;
  const activeImages = activeGallery ? activeGallery.images ?? [activeGallery.image] : [];

  return (
    <section ref={sectionRef} id="projects" className="relative py-16 md:py-24">
      <div className="container-shell">
        <Reveal className="mx-auto max-w-3xl text-center">
          <span className="section-kicker">Featured Projects</span>
          <h2 className="text-balance text-[2rem] font-bold leading-tight text-white md:text-5xl">
            Featured Projects
          </h2>
          <p className="mt-4 text-base leading-7 text-slate-200 md:mt-5 md:text-lg md:leading-8">
            Real branch photos from The Medical City Clinics — click a card to look closer.
          </p>
        </Reveal>

        <div className="mt-10 hidden gap-4 md:mt-14 md:flex md:h-[31rem]">
          {projects.map((project, index) => (
            <VerticalProjectCard
              key={project.title}
              title={project.title}
              subtitle={project.subtitle}
              image={project.image}
              index={index}
              activeIndex={activeIndex}
              setActiveIndex={setActiveIndex}
              scrollProgress={scrollYProgress}
              onOpen={() => setLightbox({ projectIndex: index, imageIndex: 0 })}
            />
          ))}
        </div>

        <div className="mt-10 grid gap-5 md:hidden">
          {projects.map((project, index) => (
            <MobileProjectCard
              key={`${project.title}-mobile`}
              title={project.title}
              subtitle={project.subtitle}
              image={project.image}
              index={index}
              scrollProgress={scrollYProgress}
              onOpen={() => setLightbox({ projectIndex: index, imageIndex: 0 })}
            />
          ))}
        </div>

        <Reveal className="mt-8 text-center md:mt-10">
          <p className="text-sm leading-7 text-muted">
            Hover desktop cards or tap a card on mobile to focus a project. Click any card to view its photos.
          </p>
        </Reveal>
      </div>

      {lightbox && activeGallery ? (
        <Lightbox
          images={activeImages}
          index={lightbox.imageIndex}
          title={activeGallery.title}
          onClose={() => setLightbox(null)}
          onNavigate={(imageIndex) => setLightbox({ projectIndex: lightbox.projectIndex, imageIndex })}
        />
      ) : null}
    </section>
  );
}
