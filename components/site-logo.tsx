"use client";

import Image from "next/image";
import Link from "next/link";
import { withBasePath } from "@/lib/base-path";

type SiteLogoProps = {
  className?: string;
  size?: "md" | "lg";
};

export function SiteLogo({ className = "", size = "md" }: SiteLogoProps) {
  const iconClass = size === "lg" ? "h-14 w-14 sm:h-16 sm:w-16" : "h-10 w-10 sm:h-12 sm:w-12";
  const titleClass = size === "lg" ? "text-[1.2rem] sm:text-[1.35rem]" : "text-[1.05rem] sm:text-[1.2rem]";

  return (
    <Link
      href="/"
      aria-label="Monricher Construction and Development Corp — home"
      className={`group inline-flex items-center gap-3 text-white transition duration-500 ${className}`}
    >
      <span className={`relative block shrink-0 [perspective:600px] ${iconClass}`}>
        <span className="absolute inset-0 -z-10 rounded-2xl bg-[radial-gradient(circle,rgba(114,180,255,0.4),transparent_70%)] opacity-0 blur-md transition duration-500 group-hover:opacity-100" />
        <Image
          src={withBasePath("/logo-icon.png")}
          alt=""
          fill
          sizes="64px"
          className="object-contain transition duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] [transform:rotateY(0deg)_rotateX(0deg)] group-hover:[transform:rotateY(20deg)_rotateX(-8deg)_scale(1.08)]"
          priority
        />
      </span>
      <span className="hidden flex-col leading-none sm:flex">
        <span className={`font-display font-bold tracking-[-0.02em] text-white ${titleClass}`}>
          Monricher
        </span>
        <span className="mt-1 text-[0.58rem] font-semibold uppercase tracking-[0.22em] text-white/65 sm:text-[0.64rem]">
          Construction &amp; Development
        </span>
      </span>
    </Link>
  );
}
