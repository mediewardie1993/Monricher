"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";
import { navItems } from "@/lib/site-data";
import { SiteLogo } from "@/components/site-logo";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition duration-300 ${
        scrolled ? "border-b border-white/10 bg-background/90 backdrop-blur-xl" : "bg-transparent"
      }`}
    >
      <div className="container-shell">
        <div className="flex items-center justify-between gap-4 py-4">
          <Link href="/" className="block">
            <SiteLogo className="h-auto w-full max-w-[17rem] md:max-w-[21rem]" />
          </Link>

          <nav className="hidden items-center gap-8 lg:flex">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-sm font-semibold text-slate-200 transition hover:text-white"
              >
                {item.label}
              </a>
            ))}
            <a href="#contact" className="button-primary">
              Get a Quote
            </a>
          </nav>

          <button
            type="button"
            aria-label="Toggle navigation"
            aria-expanded={open}
            onClick={() => setOpen((value) => !value)}
            className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] lg:hidden"
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
            className="border-t border-white/10 bg-background/95 backdrop-blur-xl lg:hidden"
          >
            <div className="container-shell grid gap-3 py-4">
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3 text-sm font-semibold text-slate-100"
                >
                  {item.label}
                </a>
              ))}
              <a href="#contact" onClick={() => setOpen(false)} className="button-primary">
                Get a Quote
              </a>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
