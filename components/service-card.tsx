"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Reveal } from "@/components/reveal";
import { TiltCard } from "@/components/tilt-card";
import { withBasePath } from "@/lib/base-path";

type ServiceCardProps = {
  item: { title: string; text: string; image: string };
  index: number;
};

export function ServiceCard({ item, index }: ServiceCardProps) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setIsOpen(false);
    }
    window.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <>
      <Reveal delay={index * 0.06}>
        <TiltCard className="glass-panel h-full overflow-hidden rounded-[28px]">
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="block w-full text-left"
            aria-label={`View details for ${item.title}`}
          >
            <div
              className="photo-grade h-40 bg-cover bg-center transition-transform duration-500 hover:scale-105"
              style={{ backgroundImage: `url('${item.image}')` }}
              role="img"
              aria-label={item.title}
            />
            <div className="p-6">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-300">
                {`0${index + 1}`}
              </span>
              <h3 className="mt-4 text-2xl font-bold leading-tight text-white">{item.title}</h3>
              <p className="mt-4 text-base leading-7 text-muted">{item.text}</p>
            </div>
          </button>
        </TiltCard>
      </Reveal>

      <AnimatePresence>
        {isOpen ? (
          <motion.div
            key="service-modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm md:p-8"
            onClick={() => setIsOpen(false)}
            role="dialog"
            aria-modal="true"
            aria-label={`${item.title} details`}
          >
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                setIsOpen(false);
              }}
              className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/10 text-xl text-white transition hover:bg-white/20 md:right-6 md:top-6"
              aria-label="Close"
            >
              &times;
            </button>

            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.2 }}
              className="glass-panel max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-[28px]"
              onClick={(event) => event.stopPropagation()}
            >
              <div
                className="photo-grade h-52 bg-cover bg-center sm:h-64"
                style={{ backgroundImage: `url('${item.image}')` }}
                role="img"
                aria-label={item.title}
              />
              <div className="p-6 sm:p-8">
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-300">
                  {`0${index + 1}`}
                </span>
                <h3 className="mt-4 text-3xl font-bold leading-tight text-white">{item.title}</h3>
                <p className="mt-4 text-base leading-7 text-muted">{item.text}</p>
                <a
                  href={withBasePath(`/contact?service=${encodeURIComponent(item.title)}`)}
                  className="button-primary mt-8 w-full sm:w-auto"
                >
                  <span>Inquire About This Service</span>
                </a>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
