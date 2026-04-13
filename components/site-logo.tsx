"use client";

import Link from "next/link";

type SiteLogoProps = {
  className?: string;
};

export function SiteLogo({
  className = ""
}: SiteLogoProps) {
  return (
    <Link
      href="/"
      aria-label="Monricher Construction"
      className={`group inline-flex items-center gap-2.5 text-white transition duration-500 ${className}`}
    >
      <div className="relative shrink-0">
        <span className="block font-display text-[2.3rem] leading-none tracking-[-0.08em] text-white sm:text-[2.7rem]">
          MC
        </span>
        <span className="pointer-events-none absolute inset-x-2 top-1/2 h-px bg-gradient-to-r from-transparent via-white/70 to-transparent" />
      </div>
      <div className="translate-y-[1px]">
        <p className="font-display text-[0.74rem] uppercase tracking-[0.24em] text-white/90 sm:text-[0.82rem]">
          Monricher Construction
        </p>
      </div>
    </Link>
  );
}
