"use client";

import { motion, useInView, useReducedMotion } from "framer-motion";
import { useRef, type ElementType } from "react";

type WordRevealProps = {
  text: string;
  className?: string;
  as?: ElementType;
  delay?: number;
};

/**
 * Reveals text one word at a time as it scrolls into view — reserved for a
 * single deliberate headline/quote rather than every paragraph, so the
 * effect reads as a considered beat instead of a default animation.
 */
export function WordReveal({ text, className = "", as: Tag = "p", delay = 0 }: WordRevealProps) {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  const prefersReducedMotion = useReducedMotion();
  const words = text.split(" ");

  if (prefersReducedMotion) {
    return (
      <Tag ref={ref} className={className}>
        {text}
      </Tag>
    );
  }

  return (
    <Tag ref={ref} className={className}>
      {words.map((word, index) => (
        <span key={`${word}-${index}`}>
          <span className="inline-block overflow-hidden">
            <motion.span
              className="inline-block"
              initial={{ y: "110%", opacity: 0 }}
              animate={isInView ? { y: "0%", opacity: 1 } : undefined}
              transition={{
                duration: 0.6,
                delay: delay + index * 0.035,
                ease: [0.22, 1, 0.36, 1]
              }}
            >
              {word}
            </motion.span>
          </span>
          {index < words.length - 1 ? " " : ""}
        </span>
      ))}
    </Tag>
  );
}
