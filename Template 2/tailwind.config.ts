import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        background: "#09111c",
        panel: "#0f1a2a",
        panelSoft: "#142235",
        text: "#f6f7fb",
        muted: "#aeb8c8",
        line: "rgba(255,255,255,0.09)",
        accent: "#72b4ff",
        accentSoft: "#c8a96a"
      },
      boxShadow: {
        soft: "0 18px 50px rgba(0, 0, 0, 0.18)",
        glow: "0 10px 30px rgba(114, 180, 255, 0.16)"
      },
      backgroundImage: {
        "hero-grid":
          "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)"
      }
    }
  },
  plugins: []
};

export default config;
