"use client";

import { useRef, useState, type KeyboardEvent, type PointerEvent } from "react";

type CompareSliderProps = {
  before: { src: string; alt: string; label: string };
  after: { src: string; alt: string; label: string };
};

const KEY_STEP = 2;

export function CompareSlider({ before, after }: CompareSliderProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [position, setPosition] = useState(50);
  const [dragging, setDragging] = useState(false);

  const moveTo = (clientX: number) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect || rect.width === 0) return;
    const next = ((clientX - rect.left) / rect.width) * 100;
    setPosition(Math.min(100, Math.max(0, next)));
  };

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    setDragging(true);
    moveTo(event.clientX);
  };

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!dragging) return;
    moveTo(event.clientX);
  };

  const stopDragging = (event: PointerEvent<HTMLDivElement>) => {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    setDragging(false);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowLeft") setPosition((value) => Math.max(0, value - KEY_STEP));
    else if (event.key === "ArrowRight") setPosition((value) => Math.min(100, value + KEY_STEP));
    else if (event.key === "Home") setPosition(0);
    else if (event.key === "End") setPosition(100);
    else return;
    event.preventDefault();
  };

  return (
    <div
      ref={containerRef}
      role="slider"
      tabIndex={0}
      aria-label={`Compare ${before.label} and ${after.label}`}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(position)}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={stopDragging}
      onPointerCancel={stopDragging}
      onKeyDown={handleKeyDown}
      className="relative mx-auto aspect-[16/9] w-full max-w-5xl cursor-ew-resize touch-pan-y select-none overflow-hidden rounded-[22px] border border-white/10 shadow-soft outline-none focus-visible:ring-2 focus-visible:ring-accent/60 md:rounded-[28px]"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={after.src} alt={after.alt} draggable={false} className="absolute inset-0 h-full w-full object-cover" />

      <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={before.src} alt={before.alt} draggable={false} className="absolute inset-0 h-full w-full object-cover" />
      </div>

      <span className="pointer-events-none absolute bottom-3 left-3 rounded-full border border-white/20 bg-black/55 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-white backdrop-blur-sm md:bottom-4 md:left-4 md:text-xs">
        {before.label}
      </span>
      <span className="pointer-events-none absolute bottom-3 right-3 rounded-full border border-white/20 bg-black/55 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-white backdrop-blur-sm md:bottom-4 md:right-4 md:text-xs">
        {after.label}
      </span>

      <div
        className="pointer-events-none absolute inset-y-0 w-0.5 -translate-x-1/2 bg-white shadow-[0_0_12px_rgba(0,0,0,0.5)]"
        style={{ left: `${position}%` }}
        aria-hidden="true"
      >
        <div className="absolute left-1/2 top-1/2 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-white bg-black/60 text-white shadow-lg backdrop-blur-sm">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
            <path d="M9 6l-6 6 6 6M15 6l6 6-6 6" />
          </svg>
        </div>
      </div>
    </div>
  );
}
