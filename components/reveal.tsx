"use client";

import { motion, useInView, useReducedMotion, useScroll } from "framer-motion";
import { useEffect, useRef, useState, type ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
};

export function Reveal({ children, className, delay = 0 }: RevealProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const prefersReducedMotion = useReducedMotion();
  const { scrollY } = useScroll();
  const [scrollDirection, setScrollDirection] = useState<"up" | "down">("down");
  const isInView = useInView(containerRef, {
    amount: 0.12,
    margin: "-150px 0px -32% 0px"
  });

  useEffect(() => {
    if (prefersReducedMotion) return;

    let previousY = scrollY.get();
    return scrollY.on("change", (currentY) => {
      if (currentY === previousY) return;
      setScrollDirection(currentY > previousY ? "down" : "up");
      previousY = currentY;
    });
  }, [prefersReducedMotion, scrollY]);

  const hiddenState = {
    opacity: 0,
    y: scrollDirection === "down" ? 24 : -24
  };

  return (
    <motion.div
      ref={containerRef}
      className={className}
      initial={prefersReducedMotion ? false : hiddenState}
      animate={prefersReducedMotion ? { opacity: 1 } : isInView ? { opacity: 1, y: 0 } : hiddenState}
      transition={{
        duration: 0.82,
        ease: [0.22, 1, 0.36, 1],
        delay
      }}
    >
      {children}
    </motion.div>
  );
}
