"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

type LightboxProps = {
  images: string[];
  index: number;
  title?: string;
  onClose: () => void;
  onNavigate: (index: number) => void;
};

export function Lightbox({ images, index, title, onClose, onNavigate }: LightboxProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && !document.fullscreenElement) onClose();
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

  useEffect(() => {
    function onFullscreenChange() {
      setIsFullscreen(Boolean(document.fullscreenElement));
    }
    document.addEventListener("fullscreenchange", onFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", onFullscreenChange);
      // Leaving fullscreen behind when the lightbox itself closes/unmounts
      // would strand the browser in fullscreen with nothing to show for it.
      if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
    };
  }, []);

  const toggleFullscreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    } else {
      containerRef.current?.requestFullscreen().catch(() => {});
    }
  };

  const src = images[index];
  if (!src) return null;

  return (
    <AnimatePresence>
      <motion.div
        key="lightbox-backdrop"
        ref={containerRef}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.18 }}
        className={`fixed inset-0 z-[100] flex items-center justify-center bg-black backdrop-blur-sm ${
          isFullscreen ? "p-0" : "bg-black/92 p-4 md:p-8"
        }`}
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-label={title ? `${title} photo viewer` : "Photo viewer"}
      >
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            toggleFullscreen();
          }}
          className="absolute right-[4.25rem] top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition hover:bg-white/20 md:right-[4.75rem] md:top-6"
          aria-label={isFullscreen ? "Exit fullscreen" : "View fullscreen"}
        >
          {isFullscreen ? (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
              <path d="M9 3v4a2 2 0 0 1-2 2H3M15 3v4a2 2 0 0 0 2 2h4M3 15h4a2 2 0 0 1 2 2v4M15 21v-4a2 2 0 0 1 2-2h4" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
              <path d="M8 3H5a2 2 0 0 0-2 2v3M16 3h3a2 2 0 0 1 2 2v3M21 16v3a2 2 0 0 1-2 2h-3M8 21H5a2 2 0 0 1-2-2v-3" />
            </svg>
          )}
        </button>

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
          className={`relative ${isFullscreen ? "flex h-screen w-screen items-center justify-center" : "max-w-5xl"}`}
          onClick={(event) => event.stopPropagation()}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt={title ? `${title} photo ${index + 1}` : `Photo ${index + 1}`}
            className={
              isFullscreen
                ? "max-h-[100vh] max-w-[100vw] w-auto h-auto object-contain"
                : "max-h-[80vh] w-auto max-w-full rounded-2xl object-contain shadow-2xl"
            }
          />
          {title ? (
            <p
              className={`text-center text-xs font-semibold uppercase tracking-[0.18em] text-white/75 ${
                isFullscreen ? "absolute bottom-4 left-0 right-0" : "mt-3"
              }`}
            >
              {title} — {index + 1} / {images.length}
            </p>
          ) : null}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
