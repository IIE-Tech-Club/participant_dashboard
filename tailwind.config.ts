import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cyan: {
          glow: "#00f5ff",
          dark: "#001a4d",
        },
        neon: {
          dark: "#040b14",
          darker: "#020408",
          text: "#e0f7ff",
        },
      },
      fontFamily: {
        orbitron: "var(--font-orbitron)",
        space: "var(--font-space)",
        mono: "var(--font-mono)",
      },
      transitionDuration: {
        "400": "400ms",
      },
      boxShadow: {
        "glow-cyan": "0 0 20px rgba(0, 245, 255, 0.4)",
        "glow-inner": "inset 0 0 20px rgba(0, 245, 255, 0.05)",
        card: "0 8px 32px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.04)",
      },
      animation: {
        "fade-up": "fade-up 0.5s cubic-bezier(0.22, 1, 0.36, 1) both",
        "pulse-slow": "pulse-slow 3s ease-in-out infinite",
        "dot-pulse": "pulse-dot 1.4s ease-in-out infinite",
      },
      keyframes: {
        "fade-up": {
          from: { opacity: "0", transform: "translateY(16px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "pulse-slow": {
          "0%, 100%": { opacity: "0.2" },
          "50%": { opacity: "0.7" },
        },
        "pulse-dot": {
          "0%, 100%": { transform: "scale(1)", opacity: "1" },
          "50%": { transform: "scale(1.6)", opacity: "0.5" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
