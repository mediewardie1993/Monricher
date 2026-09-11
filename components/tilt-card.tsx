"use client";

import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";
import { useRef, useState, type PointerEvent as ReactPointerEvent, type ReactNode } from "react";

type TiltCardProps = {
  children: ReactNode;
  className?: string;
  maxTilt?: number;
  glare?: boolean;
};

const canHoverTilt = () =>
  typeof window !== "undefined" && window.matchMedia("(hover: hover) and (pointer: fine)").matches;

/**
 * A glass-panel card with a pointer-driven 3D tilt, subtle content lift, and a
 * moving specular glare. Falls back to a flat, static card on touch devices
 * and when the user prefers reduced motion.
 */
export function TiltCard({ children, className = "", maxTilt = 9, glare = true }: TiltCardProps) {
  const ref = useRef<HTMLElement | null>(null);
  const prefersReducedMotion = useReducedMotion();
  const [hovered, setHovered] = useState(false);

  const pointerX = useMotionValue(0.5);
  const pointerY = useMotionValue(0.5);
  const springConfig = { stiffness: 240, damping: 20, mass: 0.5 };
  const smoothX = useSpring(pointerX, springConfig);
  const smoothY = useSpring(pointerY, springConfig);

  const rotateX = useTransform(smoothY, [0, 1], [maxTilt, -maxTilt]);
  const rotateY = useTransform(smoothX, [0, 1], [-maxTilt, maxTilt]);
  const glareBackground = useTransform([smoothX, smoothY], ([x, y]) => {
    const px = (x as number) * 100;
    const py = (y as number) * 100;
    return `radial-gradient(280px circle at ${px}% ${py}%, rgba(255,255,255,0.18), transparent 55%)`;
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

  return (
    <motion.article
      ref={ref}
      onPointerMove={handlePointerMove}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      style={prefersReducedMotion ? undefined : { rotateX, rotateY, transformPerspective: 1000 }}
      whileHover={prefersReducedMotion ? undefined : { scale: 1.015 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      className={`relative [transform-style:preserve-3d] ${className}`}
    >
      <div className="relative [transform:translateZ(16px)]">{children}</div>
      {glare && !prefersReducedMotion ? (
        <motion.span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-[inherit] transition-opacity duration-300"
          style={{ background: glareBackground, opacity: hovered ? 1 : 0 }}
        />
      ) : null}
    </motion.article>
  );
}
