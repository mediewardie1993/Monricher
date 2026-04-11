"use client";

import { useEffect, useState } from "react";

type SiteLogoProps = {
  className?: string;
  alt?: string;
};

const SOURCE = "/logo-2.png";

export function SiteLogo({
  className = "h-auto w-full max-w-[22rem]",
  alt = "Monricher Construction and Development Corp logo"
}: SiteLogoProps) {
  const [processedSrc, setProcessedSrc] = useState(SOURCE);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    let mounted = true;
    const image = new window.Image();
    image.src = SOURCE;

    image.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = image.naturalWidth;
      canvas.height = image.naturalHeight;
      const context = canvas.getContext("2d", { willReadFrequently: true });

      if (!context) {
        if (mounted) {
          setProcessedSrc(SOURCE);
          requestAnimationFrame(() => setIsVisible(true));
        }
        return;
      }

      context.drawImage(image, 0, 0);
      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
      const { data } = imageData;

      for (let index = 0; index < data.length; index += 4) {
        const r = data[index];
        const g = data[index + 1];
        const b = data[index + 2];
        const a = data[index + 3];
        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        const average = (r + g + b) / 3;
        const saturation = max - min;

        if (average > 242 && saturation < 26) {
          data[index + 3] = 0;
          continue;
        }

        if (average > 225 && saturation < 34) {
          const fadeStrength = Math.max(0, 1 - (average - 225) / 28);
          data[index + 3] = Math.round(a * fadeStrength);
        }
      }

      context.putImageData(imageData, 0, 0);

      if (mounted) {
        setProcessedSrc(canvas.toDataURL("image/png"));
        requestAnimationFrame(() => setIsVisible(true));
      }
    };

    image.onerror = () => {
      if (mounted) {
        setProcessedSrc(SOURCE);
        requestAnimationFrame(() => setIsVisible(true));
      }
    };

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <img
      src={processedSrc}
      alt={alt}
      className={`${className} transition duration-700 ease-out ${isVisible ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"}`}
      loading="eager"
      decoding="async"
    />
  );
}
