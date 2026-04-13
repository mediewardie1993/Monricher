"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { navItems } from "@/lib/site-data";
export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [glowOffset, setGlowOffset] = useState(-420);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition duration-300 ${
        scrolled
          ? "border-b border-white/10 bg-[linear-gradient(90deg,rgba(6,14,28,0.92)_0%,rgba(18,58,124,0.5)_50%,rgba(6,14,28,0.92)_100%)] backdrop-blur-xl"
          : "bg-[linear-gradient(90deg,rgba(6,14,28,0.96)_0%,rgba(28,90,176,0.52)_50%,rgba(6,14,28,0.96)_100%)]"
      }`}
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.div
          animate={{ x: glowOffset }}
          transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
          className="absolute right-[-2500px] top-[-150px] h-[340px] w-[2500px] rounded-[999px] bg-[linear-gradient(90deg,transparent_0%,rgba(20,54,110,0.08)_10%,rgba(32,82,164,0.34)_34%,rgba(114,187,255,0.54)_50%,rgba(34,85,166,0.34)_66%,rgba(18,50,108,0.08)_90%,transparent_100%)] blur-3xl"
        />
      </div>
      <div className="container-shell relative">
        <div className="flex items-center justify-between gap-4 py-3 md:py-4">
          <div className="h-10 w-20 shrink-0 sm:w-28" aria-hidden="true" />

          <nav className="hidden items-center gap-6 xl:flex">
            {navItems.map((item, index) => (
              <a
                key={item.href}
                href={item.href}
                className="nav-chip"
                onMouseEnter={() => {
                  const navGlowOffsets = [-2230, -2150, -2050, -1920, -1850];
                  setGlowOffset(navGlowOffsets[index] ?? -420);
                }}
                onFocus={() => {
                  const navGlowOffsets = [-2210, -1990, -1890, -1790, -1690];
                  setGlowOffset(navGlowOffsets[index] ?? -420);
                }}
                onMouseLeave={() => setGlowOffset(-420)}
              >
                {item.label}
              </a>
            ))}
            <a
              href="/projects"
              className="button-secondary min-h-10 px-4 py-2 text-[0.76rem]"
              onMouseEnter={() => setGlowOffset(-1780)}
              onFocus={() => setGlowOffset(-1780)}
              onMouseLeave={() => setGlowOffset(-420)}
            >
              <span>View Projects</span>
            </a>
            <a
              href="/contact"
              className="button-primary min-h-10 px-4 py-2 text-[0.76rem]"
              onMouseEnter={() => setGlowOffset(-1610)}
              onFocus={() => setGlowOffset(-1610)}
              onMouseLeave={() => setGlowOffset(-420)}
            >
              <span>Get a Quote</span>
            </a>
          </nav>

          <button
            type="button"
            aria-label="Toggle navigation"
            aria-expanded={open}
            onClick={() => setOpen((value) => !value)}
            className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] xl:hidden"
          >
            <div className="space-y-1.5">
              <span className="block h-0.5 w-5 rounded-full bg-white" />
              <span className="block h-0.5 w-5 rounded-full bg-white" />
              <span className="block h-0.5 w-5 rounded-full bg-white" />
            </div>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2 }}
            className="border-t border-white/10 bg-[#07101d]/95 backdrop-blur-xl xl:hidden"
          >
            <div className="container-shell grid gap-3 py-4">
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3.5 text-base font-semibold text-slate-100"
                >
                  {item.label}
                </a>
              ))}
              <a
                href="/projects"
                onClick={() => setOpen(false)}
                className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3.5 text-base font-semibold text-slate-100"
              >
                View Projects
              </a>
              <a
                href="/contact"
                onClick={() => setOpen(false)}
                className="button-primary w-full"
              >
                <span>Get a Quote</span>
              </a>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
