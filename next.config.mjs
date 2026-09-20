/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com"
      }
    ]
  },
  // Only takes effect on the real Next.js server (Vercel) — the static
  // export used for GitHub Pages / the portable USB build can't run custom
  // header logic, so those rely on whatever host serves the files. No
  // Content-Security-Policy here on purpose: the hero's scroll animations
  // lean heavily on inline `style` attributes, and a strict CSP would need
  // real cross-page testing before shipping to avoid silently breaking them.
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" }
        ]
      }
    ];
  }
};

export default nextConfig;
