"use client";

import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { useRef } from "react";

type LagImageWindowProps = {
  image: string;
  heightClassName?: string;
  kicker?: string;
  title?: string;
  text?: string;
  className?: string;
};

export function LagImageWindow({
  image,
  heightClassName = "min-h-[18rem] sm:min-h-[22rem] md:min-h-[28rem] lg:min-h-[34rem]",
  kicker,
  title,
  text,
  className = ""
}: LagImageWindowProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  const imageBaseY = useTransform(scrollYProgress, [0, 1], [0, 72]);
  const imageY = useSpring(imageBaseY, {
    stiffness: 84,
    damping: 28,
    mass: 0.62
  });

  return (
    <section ref={sectionRef} className={`relative overflow-hidden py-16 md:py-24 ${className}`}>
      <motion.div style={{ y: imageY }} className="absolute -inset-y-12 inset-x-0" aria-hidden="true">
        <div
          className="absolute inset-0 scale-[1.18] bg-cover bg-center"
          style={{ backgroundImage: `url('${image}')` }}
        />
      </motion.div>
      <div
        className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,17,28,0.88)_0%,rgba(10,17,28,0.36)_24%,rgba(10,17,28,0.14)_50%,rgba(10,17,28,0.4)_76%,rgba(10,17,28,0.88)_100%)]"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 bg-[linear-gradient(90deg,rgba(8,15,25,0.72)_0%,rgba(8,15,25,0.18)_34%,rgba(8,15,25,0.16)_66%,rgba(8,15,25,0.74)_100%)]"
        aria-hidden="true"
      />
      <div className={`relative ${heightClassName}`}>
        {title ? (
          <div className="container-shell flex h-full items-end py-10 md:py-14">
            <div className="max-w-[32rem]">
              {kicker ? (
                <p className="text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-white/68">
                  {kicker}
                </p>
              ) : null}
              <h3 className="mt-3 text-balance font-display text-[2.1rem] font-semibold leading-[0.95] text-white sm:text-[2.7rem] md:text-[3.3rem]">
                {title}
              </h3>
              {text ? (
                <p className="mt-4 max-w-[30rem] text-[0.96rem] leading-7 text-white/78">
                  {text}
                </p>
              ) : null}
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
