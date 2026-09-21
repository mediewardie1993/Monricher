"use client";

import { useState } from "react";
import { Lightbox } from "@/components/lightbox";
import { TiltCard } from "@/components/tilt-card";
import type { ProjectGalleryEntry } from "@/lib/site-data";

export function ProjectGalleryCard({ project }: { project: ProjectGalleryEntry }) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  return (
    <>
      <TiltCard className="glass-panel h-full overflow-hidden rounded-[24px]">
        <button
          type="button"
          onClick={() => setLightboxIndex(0)}
          className="relative block aspect-[4/3] w-full overflow-hidden"
          aria-label={`View ${project.title} photos larger`}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={project.cover}
            alt={project.title}
            className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
          />
        </button>
        <div className="p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-300">
            {project.location}
          </p>
          <h4 className="mt-3 text-2xl font-bold text-white">{project.title}</h4>
          <div className="mt-4 grid grid-cols-4 gap-2">
            {project.images.slice(0, 8).map((image, index) => (
              <button
                key={image}
                type="button"
                onClick={() => setLightboxIndex(index)}
                className="aspect-square w-full overflow-hidden rounded-lg"
                aria-label={`View ${project.title} photo ${index + 1} larger`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={image}
                  alt={`${project.title} photo ${index + 1}`}
                  className="h-full w-full object-cover transition-transform duration-300 hover:scale-110"
                />
              </button>
            ))}
          </div>
        </div>
      </TiltCard>

      {lightboxIndex !== null ? (
        <Lightbox
          images={project.images}
          index={lightboxIndex}
          title={project.title}
          onClose={() => setLightboxIndex(null)}
          onNavigate={setLightboxIndex}
        />
      ) : null}
    </>
  );
}
