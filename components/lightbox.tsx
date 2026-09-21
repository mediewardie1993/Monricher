"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";

type LightboxProps = {
  images: string[];
  index: number;
  title?: string;
  onClose: () => void;
  onNavigate: (index: number) => void;
};

export function Lightbox({ images, index, title, onClose, onNavigate }: LightboxProps) {
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
      if (images.length > 1 && event.key === "ArrowRight") onNavigate((index + 1) % images.length);
      if (images.length > 1 && event.key === "ArrowLeft") onNavigate((index - 1 + images.length) % images.length);
    }
    window.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [index, images.length, onClose, onNavigate]);

  const src = images[index];
  if (!src) return null;

  return (
    <AnimatePresence>
      <motion.div
        key="lightbox-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.18 }}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/92 p-4 backdrop-blur-sm md:p-8"
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-label={title ? `${title} photo viewer` : "Photo viewer"}
      >
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onClose();
          }}
          className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/10 text-xl text-white transition hover:bg-white/20 md:right-6 md:top-6"
          aria-label="Close"
        >
          &times;
        </button>

        {images.length > 1 ? (
          <>
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                onNavigate((index - 1 + images.length) % images.length);
              }}
              className="absolute left-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-white/10 text-2xl text-white transition hover:bg-white/20 md:left-6"
              aria-label="Previous image"
            >
              &lsaquo;
            </button>
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                onNavigate((index + 1) % images.length);
              }}
              className="absolute right-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-white/10 text-2xl text-white transition hover:bg-white/20 md:right-6"
              aria-label="Next image"
            >
              &rsaquo;
            </button>
          </>
        ) : null}

        <motion.div
          key={src}
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.97 }}
          transition={{ duration: 0.18 }}
          className="relative max-w-5xl"
          onClick={(event) => event.stopPropagation()}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt={title ? `${title} photo ${index + 1}` : `Photo ${index + 1}`}
            className="max-h-[80vh] w-auto max-w-full rounded-2xl object-contain shadow-2xl"
          />
          {title ? (
            <p className="mt-3 text-center text-xs font-semibold uppercase tracking-[0.18em] text-white/75">
              {title} — {index + 1} / {images.length}
            </p>
          ) : null}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
